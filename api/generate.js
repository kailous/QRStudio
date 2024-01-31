const QRCode = require('qrcode-svg');

/**
 * 生成SVG格式的二维码
 * @param {string} text 要编码的文本
 * @return {string} 生成的SVG格式二维码
 */
function generateSVGQRCode(text, options, ecl) {
    const qrCode = new QRCode({
        content: text,
        padding: 1,
        join: false,
        ecl: ecl
    });
    return qrCode.svg();
}

module.exports = generateSVGQRCode;