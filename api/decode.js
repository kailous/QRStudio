// decode.js
// 二维码解码

const Jimp = require('jimp');
const jsQR = require('jsqr');


async function decodeQRCode(imagePath) {
    try {
        const image = await Jimp.read(imagePath);

        // 调整对比度，值范围从-1到1，例如0.5表示增加50%的对比度
        image.contrast(0.5);

        // 首次尝试解码
        let qrCode = decodeImage(image);
        if (qrCode) {
            return qrCode.data;
        }

        // 如果首次解码失败，则反色后再次尝试
        image.invert();
        qrCode = decodeImage(image);
        if (qrCode) {
            return qrCode.data;
        }

        return null;
    } catch (error) {
        console.error('解码二维码时出错：', error);
        return null;
    }
}

function decodeImage(image) {
    const { width, height, data } = image.bitmap;
    const qrCodeImageData = new Uint8ClampedArray(data);
    return jsQR(qrCodeImageData, width, height);
}

// 传出模块
module.exports = decodeQRCode;