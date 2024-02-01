const express = require('express');
const multer = require('multer');
const cors = require('cors');
const decodeQRCode = require('./api/decode');
const generateQRCode = require('./api/generate');
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public')); 
app.use(express.json());
// 允许所有域名的跨域请求
app.use(cors());

// 二维码解码
// index.js 或者处理请求的服务器端代码
app.post('/decode', upload.single('image'), async (req, res) => {
    if (!req.file) {
      console.log('No file received');
      return res.status(400).send('未上传图片');
    }
  
    try {
      console.log('解码二维码');
      const decodedText = await decodeQRCode(req.file.buffer);
      // ...
    } catch (error) {
      console.error('解码过程中出错：', error);
      // ...
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
