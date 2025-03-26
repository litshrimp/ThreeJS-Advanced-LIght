import * as THREE from 'three';

/**
 * 加载管理器类，用于显示加载进度和管理资源加载
 */
export default class LoadingManager {
  constructor() {
    // 创建THREE.js加载管理器
    this.manager = new THREE.LoadingManager();
    this.createLoadingUI();
    
    // 配置加载管理器事件
    this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(`Started loading: ${url}`);
      this.showLoadingUI();
    };
    
    this.manager.onLoad = () => {
      console.log('Loading complete!');
      this.hideLoadingUI();
    };
    
    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(`Loading file: ${url} (${itemsLoaded}/${itemsTotal})`);
      const progress = itemsLoaded / itemsTotal;
      this.updateLoadingProgress(progress);
    };
    
    this.manager.onError = (url) => {
      console.error(`Error loading ${url}`);
      this.showLoadingError(url);
    };
  }
  
  /**
   * 创建加载界面
   */
  createLoadingUI() {
    // 创建加载容器
    this.loadingContainer = document.createElement('div');
    this.loadingContainer.className = 'loading-container';
    this.loadingContainer.style.position = 'fixed';
    this.loadingContainer.style.top = '0';
    this.loadingContainer.style.left = '0';
    this.loadingContainer.style.width = '100%';
    this.loadingContainer.style.height = '100%';
    this.loadingContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.loadingContainer.style.display = 'flex';
    this.loadingContainer.style.alignItems = 'center';
    this.loadingContainer.style.justifyContent = 'center';
    this.loadingContainer.style.flexDirection = 'column';
    this.loadingContainer.style.zIndex = '1000';
    
    // 创建加载文本
    this.loadingText = document.createElement('div');
    this.loadingText.textContent = '加载中...';
    this.loadingText.style.color = 'white';
    this.loadingText.style.fontSize = '16px';
    this.loadingText.style.marginBottom = '10px';
    
    // 创建进度条容器
    this.progressContainer = document.createElement('div');
    this.progressContainer.style.width = '200px';
    this.progressContainer.style.height = '5px';
    this.progressContainer.style.backgroundColor = '#444';
    this.progressContainer.style.borderRadius = '2px';
    
    // 创建进度条
    this.progressBar = document.createElement('div');
    this.progressBar.style.width = '0%';
    this.progressBar.style.height = '100%';
    this.progressBar.style.backgroundColor = '#3498db';
    this.progressBar.style.borderRadius = '2px';
    this.progressBar.style.transition = 'width 0.3s';
    
    // 组装界面
    this.progressContainer.appendChild(this.progressBar);
    this.loadingContainer.appendChild(this.loadingText);
    this.loadingContainer.appendChild(this.progressContainer);
    
    // 初始状态为隐藏
    this.loadingContainer.style.display = 'none';
  }
  
  /**
   * 显示加载界面
   */
  showLoadingUI() {
    document.body.appendChild(this.loadingContainer);
    this.loadingContainer.style.display = 'flex';
  }
  
  /**
   * 隐藏加载界面
   */
  hideLoadingUI() {
    // 使用淡出效果
    this.loadingContainer.style.opacity = '0';
    this.loadingContainer.style.transition = 'opacity 0.5s';
    
    // 完全隐藏并移除
    setTimeout(() => {
      if (this.loadingContainer.parentNode) {
        this.loadingContainer.parentNode.removeChild(this.loadingContainer);
      }
    }, 500);
  }
  
  /**
   * 更新加载进度
   * @param {number} progress - 加载进度(0-1)
   */
  updateLoadingProgress(progress) {
    const percent = Math.min(100, Math.round(progress * 100));
    this.progressBar.style.width = `${percent}%`;
    this.loadingText.textContent = `加载中... ${percent}%`;
  }
  
  /**
   * 显示加载错误
   * @param {string} url - 加载失败的文件URL
   */
  showLoadingError(url) {
    this.loadingText.textContent = `加载失败: ${url}`;
    this.loadingText.style.color = '#e74c3c';
    this.progressBar.style.backgroundColor = '#e74c3c';
    
    // 添加详细错误信息和解决方案
    const errorDetails = document.createElement('div');
    errorDetails.style.marginTop = '15px';
    errorDetails.style.fontSize = '14px';
    errorDetails.style.maxWidth = '400px';
    errorDetails.style.textAlign = 'center';
    
    let errorMessage = '';
    if (url.includes('.glb')) {
      errorMessage = `
        模型文件加载失败。可能的原因：<br>
        - 文件不存在或路径错误<br>
        - 服务器无法访问该文件<br>
        - GLB文件格式不正确<br><br>
        请确保文件 static/advanced-render/models/testAdvancedRender.glb 存在并且可访问。
      `;
    } else if (url.includes('.png') || url.includes('.jpg')) {
      errorMessage = `
        贴图文件加载失败。可能的原因：<br>
        - 文件不存在或路径错误<br>
        - 图片格式不正确<br><br>
        请确保文件 ${url.split('/').pop()} 存在并且可访问。
      `;
    } else {
      errorMessage = `
        资源加载失败。请检查文件是否存在并且路径正确。
      `;
    }
    
    errorDetails.innerHTML = errorMessage;
    this.loadingContainer.appendChild(errorDetails);
    
    // 添加重试按钮
    const retryButton = document.createElement('button');
    retryButton.textContent = '重新加载页面';
    retryButton.style.marginTop = '20px';
    retryButton.style.padding = '8px 16px';
    retryButton.style.backgroundColor = '#3498db';
    retryButton.style.border = 'none';
    retryButton.style.borderRadius = '4px';
    retryButton.style.color = 'white';
    retryButton.style.cursor = 'pointer';
    retryButton.onclick = () => window.location.reload();
    
    this.loadingContainer.appendChild(retryButton);
  }
  
  /**
   * 获取加载管理器
   * @returns {THREE.LoadingManager}
   */
  getManager() {
    return this.manager;
  }
} 