const submitButton = document.getElementById('submit-button');
const uploadForm = document.getElementById('upload-form');
const decodedTextElement = document.getElementById('decoded-text');
const generatedQRCodeSVG = document.getElementById('generated-qrcode-svg'); // 修改为SVG元素的id

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);

    try {
        // 发送解码请求
        const decodeResponse = await fetch('/decode', {
            method: 'POST',
            body: formData
        });

        if (decodeResponse.ok) {
            const decodeData = await decodeResponse.json();
            if (decodeData.decodedText) {
                decodedTextElement.textContent = '解码内容: ' + decodeData.decodedText;

                // 发送生成请求
                const generateResponse = await fetch('/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: decodeData.decodedText })
                });

                if (generateResponse.ok) {
                    const generateData = await generateResponse.json();
                    generateQRCode(generateData.qrCodeSvg);
                } else {
                    console.error('生成二维码请求失败');
                }
            } else {
                decodedTextElement.textContent = '解码失败: 无法解析二维码';
                generatedQRCodeSVG.style.display = 'none';
            }
        } else {
            console.error('解码请求失败');
        }
    } catch (error) {
        console.error('请求错误', error);
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
