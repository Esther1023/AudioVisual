// server.js
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// 中间件
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 提供主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API 路由 - 解析视频
app.post('/api/parse', async (req, res) => {
  try {
    const { url, platform } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: '请提供视频 URL' });
    }

    // 这里添加你的视频解析逻辑
    // 例如调用第三方 API 或你自己的解析服务
    const result = {
      success: true,
      url: url,
      platform: platform,
      message: '视频解析成功'
    };

    res.json(result);
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API 路由 - 获取平台列表
app.get('/api/platforms', (req, res) => {
  const platforms = [
    { value: 'https://v.qq.com', label: '腾讯视频' },
    { value: 'https://www.iqiyi.com', label: '爱奇艺' },
    { value: 'https://www.youku.com', label: '优酷' },
    { value: 'https://www.bilibili.com', label: 'B站' },
    { value: 'https://www.mgtv.com', label: '芒果TV' },
    { value: 'https://www.pptv.com', label: 'PPTV' }
  ];
  res.json(platforms);
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AudioVisual Web Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
