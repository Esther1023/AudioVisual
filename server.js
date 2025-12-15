// assets/js/web-renderer.js
const urlInput = document.getElementById('url-input');
const goButton = document.getElementById('go-button');
const parseButton = document.getElementById('parse-button');
const backButton = document.getElementById('back-button');
const forwardButton = document.getElementById('forward-button');
const homeButton = document.getElementById('home-button');
const platformSelect = document.getElementById('platform-select');
const loadingOverlay = document.getElementById('loading-overlay');
const videoContainer = document.getElementById('video-container');

let currentVideoUrl = '';
let isCurrentlyParsing = false;

// 初始化平台列表
async function initPlatforms() {
  try {
    const response = await fetch('/api/platforms');
    const platforms = await response.json();
    
    platformSelect.innerHTML = '<option value="">选择平台...</option>';
    platforms.forEach(platform => {
      const option = document.createElement('option');
      option.value = platform.value;
      option.textContent = platform.label;
      platformSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load platforms:', error);
    showToast('加载平台列表失败', 'error');
  }
}

// 显示加载状态
function showLoading(show = true) {
  loadingOverlay.style.display = show ? 'flex' : 'none';
}

// Toast 通知
function showToast(message, type = 'info') {
  const bgColor = type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#4dabf7';
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    backgroundColor: bgColor,
  }).showToast();
}

// 解析视频
async function parseVideo() {
  const url = urlInput.value.trim();
  const platform = platformSelect.value;

  if (!url) {
    showToast('请输入视频 URL', 'error');
    return;
  }

  if (isCurrentlyParsing) {
    showToast('正在解析中，请稍候...', 'info');
    return;
  }

  isCurrentlyParsing = true;
  showLoading(true);

  try {
    const response = await fetch('/api/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        platform: platform
      })
    });

    const data = await response.json();

    if (response.ok) {
      currentVideoUrl = url;
      showToast('视频解析成功！', 'success');
      
      // 在这里添加你的视频播放逻辑
      // 例如：displayVideo(data);
      
    } else {
      showToast(data.error || '解析失败', 'error');
    }
  } catch (error) {
    console.error('Parse error:', error);
    showToast('解析出错：' + error.message, 'error');
  } finally {
    isCurrentlyParsing = false;
    showLoading(false);
  }
}

// 事件监听
goButton.addEventListener('click', parseVideo);
parseButton.addEventListener('click', parseVideo);

urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    parseVideo();
  }
});

platformSelect.addEventListener('change', (e) => {
  if (e.target.value) {
    urlInput.focus();
  }
});

backButton.addEventListener('click', () => {
  window.history.back();
});

forwardButton.addEventListener('click', () => {
  window.history.forward();
});

homeButton.addEventListener('click', () => {
  urlInput.value = '';
  videoContainer.innerHTML = `
    <div class="placeholder">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
      <p>选择视频开始播放</p>
    </div>
  `;
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  initPlatforms();
});
