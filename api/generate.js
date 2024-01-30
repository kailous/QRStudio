const QRCode = require('qrcode-svg'); // 导入qrcode-svg库

/**
 * 生成SVG格式的二维码
 * @param {string} text 要编码的文本
 * @return {string} 生成的SVG格式二维码
 */
function generateSVGQRCode(text) {
    const qrCode = new QRCode(text); // 创建SVG格式的QRCode对象
    return qrCode.svg(); // 返回SVG格式的二维码
}

module.exports = generateSVGQRCode; // 导出生成SVG二维码的函数
