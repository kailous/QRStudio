const submitButton = document.getElementById('submit-button');
const uploadForm = document.getElementById('upload-form');
const decodedTextElement = document.getElementById('decoded-text');
const generatedQRCodeSVG = document.getElementById('generated-qrcode-svg');
const statusElement = document.getElementById('status'); // 获取状态显示元素

// 提示信息集中管理
const messages = {
    uploading: '<dotlottie-player src="https://lottie.host/8d9e7c33-8283-41b6-abea-a60cebed05ae/AGfXLEynAl.json" background="transparent" speed="1" style="width: 64px; height: 64px;" loop autoplay></dotlottie-player>',
    decoding: '解析中...',
    generating: '生成中...',
    success: '成功',
    failure: '失败',
};

uploadForm.addEventListener('submit', async (e) => {
    // 清空SVG元素
    while (generatedQRCodeSVG.firstChild) {
        generatedQRCodeSVG.removeChild(generatedQRCodeSVG.firstChild);
    }
    e.preventDefault();
    const formData = new FormData(uploadForm);

    try {
        // 显示上传中状态
        setStatusMessage(messages.uploading);

        // 发送解码请求
        const decodeResponse = await fetch('/decode', {
            method: 'POST',
            body: formData
        });

        if (decodeResponse.ok) {
            const decodeData = await decodeResponse.json();
            if (decodeData.decodedText) {
                decodedTextElement.textContent = '解码内容: ' + decodeData.decodedText;

                // 获取所选的纠错等级的值
                const selectedECL = document.getElementById('ecl').value;

                // 发送生成请求
                const generateResponse = await fetch('/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: decodeData.decodedText, ecl: selectedECL }) // 传递所选的纠错等级
                });

                if (generateResponse.ok) {
                    const generateData = await generateResponse.json();
                    generateQRCode(generateData.qrCodeSvg);
                    // 显示成功状态
                    setStatusMessage(messages.success);
                } else {
                    console.error('生成二维码请求失败');
                    setStatusMessage(messages.failure, '生成二维码失败');
                }
            } else {
                decodedTextElement.textContent = '解码失败: 无法解析二维码';
                generatedQRCodeSVG.style.display = 'none';
                // 显示失败状态
                setStatusMessage(messages.failure, '解码失败: 无法解析二维码');
            }
        } else {
            console.error('解码请求失败');
            // 显示失败状态
            setStatusMessage(messages.failure, '解码请求失败');
        }
    } catch (error) {
        console.error('请求错误', error);
        // 显示失败状态
        setStatusMessage(messages.failure, '请求错误');
    }
});

// Function to generate QR code as SVG based on text
function generateQRCode(svgText) {
    // 清空SVG元素
    while (generatedQRCodeSVG.firstChild) {
        generatedQRCodeSVG.removeChild(generatedQRCodeSVG.firstChild);
    }

    try {
        // 创建一个新的SVG元素
        const svgElement = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement;

        // 将新创建的SVG元素添加到generatedQRCodeSVG中
        generatedQRCodeSVG.appendChild(svgElement);
        generatedQRCodeSVG.style.display = 'block'; // 显示SVG元素
    } catch (error) {
        console.error('生成二维码错误', error);
        generatedQRCodeSVG.style.display = 'none'; // 隐藏SVG元素
    }
}

// 设置状态消息
function setStatusMessage(status, customMessage = '') {
    if (customMessage) {
        statusElement.innerHTML = `状态: ${status} - ${customMessage}`;
    } else {
        statusElement.innerHTML = status;
    }
}
