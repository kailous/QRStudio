const express = require('express');
const multer = require('multer');
const decodeQRCode = require('./api/decode');
const generateQRCode = require('./api/generate');
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.static('public')); 
app.use(express.json());
const morgan = require('morgan');
// 创建一个日志记录格式
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
  });
  
  // 设置 morgan 中间件
  app.use(morgan('[:date[clf]] :method :url :status :response-time ms - :res[content-length] :body'));
  

// 二维码解码
app.post('/decode', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('未上传图片');
    }

    // 解码二维码
    const decodedText = await decodeQRCode(req.file.path);
    
    // 根据解码结果返回响应
    if (decodedText) {
        res.send({ decodedText });
    } else {
        res.status(400).send('无法解析二维码');
    }
});

// 生成二维码（返回SVG格式）
app.post('/generate', async (req, res) => {
    try {
        const { text, options } = req.body;
        const selectedECL = req.body.ecl; // 获取纠错等级
        const qrCodeSvg = await generateQRCode(text, options, selectedECL); // 传递纠错等级
        res.send({ qrCodeSvg }); // 返回SVG格式的二维码
    } catch (error) {
        res.status(500).send('生成二维码失败');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
