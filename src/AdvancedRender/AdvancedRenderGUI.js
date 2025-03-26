// Tweakpane由script标签加载，成为全局变量

export default class AdvancedRenderGUI {
  constructor(scene) {
    this.scene = scene;
    
    // 存储光照参数，以便在未创建着色器材质前也能记录值
    this.lightParams = {
      color: '#ff115e',
      strength: 1.5
    };
    
    // 创建GUI面板
    this.pane = new Tweakpane.Pane();
    this.pane.containerElem_.style.width = '250px';
    
    // 光照颜色控制
    const lightFolder = this.pane.addFolder({
      title: '光照设置',
      expanded: true
    });
    
    // 灯光颜色
    lightFolder.addInput(this.lightParams, 'color', {
      label: '光源颜色'
    }).on('change', (ev) => {
      this.scene.updateLightColor(ev.value);
    });
    
    // 灯光强度
    lightFolder.addInput(this.lightParams, 'strength', {
      label: '光源强度',
      min: 0,
      max: 3,
      step: 0.1
    }).on('change', (ev) => {
      this.scene.updateLightStrength(ev.value);
    });
  }
} 