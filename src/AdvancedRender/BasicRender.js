import BasicRenderScene from './BasicRenderScene.js';

export default class BasicRender {
  constructor() {
    // 创建canvas
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('basic-render-canvas');
    document.body.appendChild(this.canvas);
    
    // 初始化场景
    this.scene = new BasicRenderScene(this.canvas);
  }
  
  // 销毁场景，用于清理资源
  destroy() {
    // 移除canvas
    document.body.removeChild(this.canvas);
    
    // 移除事件监听器
    window.removeEventListener('resize', this.scene.resize);
  }
} 