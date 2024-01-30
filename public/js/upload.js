// 获取页面上的各个DOM元素
const submitButton = document.getElementById('submit-button'); // 提交按钮
const uploadForm = document.getElementById('upload-form'); // 上传表单
const uploadArea = document.getElementById('upload-area'); // 上传区域
const imageInput = document.getElementById('image-input'); // 图像输入框
const decodedTextElement = document.getElementById('decoded-text'); // 解码后文本显示区域
const generatedQRCodeSVG = document.getElementById('generated-qrcode-svg'); // 生成的QR码SVG显示区域
const statusElement = document.getElementById('status'); // 状态信息显示区域

// 定义不同状态下的消息
const messages = {
    uploading: '<dotlottie-player src="https://lottie.host/8d9e7c33-8283-41b6-abea-a60cebed05ae/AGfXLEynAl.json" background="transparent" speed="1" style="width: 64px; height: 64px;" loop autoplay></dotlottie-player>',
    decoding: '解析中...',
    generating: '生成中...',
    success: '成功',
    failure: '失败',
};

// 处理文件选择事件
function handleFileSelection(files) {
    if (files.length > 0) {
        imageInput.files = files;
        // 自动触发表单提交
        submitForm();
    }
}

// 提交表单的函数
function submitForm() {
    // 您可以在这里添加任何提交前的验证或处理逻辑
    const formData = new FormData(uploadForm);
    decodeAndGenerateQRCode(formData);
}

// 添加拖拽和放置事件监听器
function addDragAndDropListeners() {
    uploadArea.addEventListener('dragover', (e) => e.preventDefault());
    // 上传区域的放置事件监听器
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault(); // 阻止默认行为
        uploadArea.classList.remove('active'); // 移除active类
        handleFileSelection(e.dataTransfer.files); // 处理文件选择
    });
    // 上传区域的拖拽进入事件监听器
    uploadArea.addEventListener('dragenter', (e) => {
        e.preventDefault(); // 阻止默认行为
        uploadArea.classList.add('active'); // 添加active类
    });
    // 上传区域的拖拽离开事件监听器
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('active'));
}

// 添加点击和改变事件监听器
function addClickAndChangeListeners() {
    uploadArea.addEventListener('click', (e) => {
        e.preventDefault(); // 阻止默认行为
        e.stopPropagation(); // 阻止事件冒泡
        // 只有当点击的不是 imageInput 本身时，才触发 imageInput 的点击事件
        if (e.target !== imageInput) {
            imageInput.click();
        }
    });

    imageInput.addEventListener('change', () => {
        handleFileSelection(imageInput.files);
    });

    // 阻止 imageInput 的点击事件冒泡
    imageInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}



// 解码并生成QR码的异步函数
async function decodeAndGenerateQRCode(formData) {
    setStatusMessage(messages.uploading);
    try {
        const decodeResponse = await fetch('/decode', { method: 'POST', body: formData });
        if (!decodeResponse.ok) throw new Error('这不是二维码图片 你在逗我-_- ～');

        const decodeData = await decodeResponse.json();
        if (!decodeData.decodedText) throw new Error('无法解析二维码');

        decodedTextElement.textContent = decodeData.decodedText;
        const selectedECL = document.getElementById('ecl').value;
        const generateResponse = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: decodeData.decodedText, ecl: selectedECL })
        });

        if (!generateResponse.ok) throw new Error('生成二维码失败');
        const generateData = await generateResponse.json();
        generateQRCode(generateData.qrCodeSvg);
        setStatusMessage(messages.success);
    } catch (error) {
        console.error(error.message);
        setStatusMessage(messages.failure, error.message);
    }
}

// 生成QR码的函数
function generateQRCode(svgText) {
    while (generatedQRCodeSVG.firstChild) {
        generatedQRCodeSVG.removeChild(generatedQRCodeSVG.firstChild);
    }

    try {
        const svgElement = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement;
        generatedQRCodeSVG.appendChild(svgElement);
        generatedQRCodeSVG.style.display = 'block';
    } catch (error) {
        console.error('生成二维码错误', error);
        generatedQRCodeSVG.style.display = 'none';
    }
}

// 设置状态消息的函数
function setStatusMessage(status, customMessage = '') {
    statusElement.innerHTML = customMessage ? `${status}:${customMessage}` : status;
}

// 添加事件监听器
addDragAndDropListeners();
addClickAndChangeListeners();

// 提交表单时的事件处理
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm();
    const formData = new FormData(uploadForm);
    decodeAndGenerateQRCode(formData);
});
