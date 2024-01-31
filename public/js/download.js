// SVG 源代码下载函数
function downloadSvgElement(svgElementId) {
  // 获取指定 ID 的 SVG 元素
  const svgElement = document.getElementById(svgElementId);
  if (!svgElement || !svgElement.innerHTML.trim()) {
    showTips('莫慌～ 二维码还没生成呢～', '#f44336');
    return;
  }

  // 获取 SVG 的源代码
  const svgData = svgElement.outerHTML;

  // 创建一个下载链接
  const downloadLink = document.createElement('a');
  downloadLink.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
  downloadLink.download = 'qrcode.svg';

  // 触发下载
  downloadLink.click();
}

// SVG 源代码复制函数
function copySvgToClipboard(svgElementId) {
  // 获取指定 ID 的 SVG 元素
  const svgElement = document.getElementById(svgElementId);
  if (!svgElement || !svgElement.innerHTML.trim()) {
    showTips('莫慌～ 二维码还没生成呢～', '#f44336');
    return;
  }

  // 获取 SVG 的源代码
  const svgData = svgElement.outerHTML;

  // 使用 Clipboard API 将 SVG 源代码复制到剪贴板
  navigator.clipboard.writeText(svgData)
    .then(() => {
      showTips('复制成功啦～ 去设计软件中粘贴看看～', '#4caf50');
    })
    .catch(err => {
      showTips('出现了一些未知错误呢...', '#f44336');
    });
}

// 显示提示信息的函数
function showTips(text, color) {
  const tipsElement = document.getElementById('tips');
  // 设置提示文本
  tipsElement.textContent = text;
  // 设置提示文本的背景颜色
  tipsElement.style.background = color;
  tipsElement.style.top = '0';
  setTimeout(() => {
    tipsElement.style.top = '-100px';
  }, 3000);
}
