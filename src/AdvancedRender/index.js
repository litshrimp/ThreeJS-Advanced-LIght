import AdvancedRenderScene from './AdvancedRenderScene.js';
import AdvancedRenderGUI from './AdvancedRenderGUI.js';

export default class AdvancedRender {
  constructor() {
    // 创建canvas
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('advanced-render-canvas');
    document.body.appendChild(this.canvas);
    
    // 初始化场景
    this.scene = new AdvancedRenderScene(this.canvas);
    
    // 初始化GUI
    this.gui = new AdvancedRenderGUI(this.scene);
  }
  
  // 销毁场景，用于清理资源
  destroy() {
    // 移除canvas
    document.body.removeChild(this.canvas);
    
    // 移除事件监听器
    window.removeEventListener('resize', this.scene.resize);
    
    // 处理其他清理工作...
  }
} 