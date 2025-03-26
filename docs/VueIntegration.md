# Vue项目集成指南

本文档提供了将ThreeJS-Advanced-Light高级光照渲染系统集成到Vue项目中的详细步骤。

## 前提条件

- 已有一个基于Vue的项目
- 项目中包含基本的场景结构（如loading, introduction, game, ending场景）
- 已准备好3D模型、烘焙贴图和光照贴图

## 文件结构集成

### 1. 必要文件迁移

从当前项目复制以下核心文件到Vue项目：

| 源文件 | 目标文件 |
|-------|---------|
| `/src/AdvancedRender/AdvancedRenderScene.js` | `/src/game/rendering/AdvancedRenderScene.js` |
| `/src/AdvancedRender/AdvancedRenderGUI.js` | `/src/game/rendering/AdvancedRenderGUI.js` |
| `/src/AdvancedRender/ErrorHandler.js` | `/src/game/rendering/ErrorHandler.js` |
| `/src/AdvancedRender/LoadingManager.js` | `/src/game/rendering/LoadingManager.js` |
| `/src/AdvancedRender/utils.js` | `/src/game/rendering/utils.js` |

### 2. 资源文件结构

在Vue项目中创建以下资源目录结构：

```
/public
  /assets
    /models        - 存放3D模型(.glb文件)
    /textures      - 存放烘焙贴图和光照贴图(.png文件)
  /lib             - 存放第三方库文件
```

### 3. 第三方库依赖

确保你的Vue项目安装了以下依赖：

```bash
npm install three@0.130.1 --save
```

对于Tweakpane，建议将其作为静态资源引入：

```html
<script src="/lib/tweakpane-3.1.0.min.js"></script>
```

## Vue组件实现

### GameScene.vue组件

```vue
<template>
  <div class="game-scene">
    <canvas ref="renderCanvas" class="render-canvas"></canvas>
    <div ref="guiContainer" class="gui-container"></div>
  </div>
</template>

<script>
import { AdvancedRenderScene } from '../game/rendering/AdvancedRenderScene';
import { AdvancedRenderGUI } from '../game/rendering/AdvancedRenderGUI';

export default {
  name: 'GameScene',
  data() {
    return {
      renderScene: null,
      gui: null,
      animationId: null
    }
  },
  mounted() {
    this.initRenderScene();
    this.animate();
    
    // 处理组件销毁时的清理
    window.addEventListener('resize', this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderScene) {
      this.renderScene.dispose();
    }
    if (this.gui) {
      this.gui.dispose();
    }
  },
  methods: {
    initRenderScene() {
      const canvas = this.$refs.renderCanvas;
      this.renderScene = new AdvancedRenderScene(canvas);
      
      // 配置场景
      this.renderScene.modelName = 'yourModelName'; // 替换为您的模型名称
      
      // 初始化资源路径，修改为Vue公共目录路径
      this.renderScene.modelPath = '/assets/models/';
      this.renderScene.texturePath = '/assets/textures/';
      
      // 加载模型和贴图
      this.renderScene.load();
      
      // 初始化GUI控制面板
      const guiContainer = this.$refs.guiContainer;
      this.gui = new AdvancedRenderGUI(this.renderScene, guiContainer);
    },
    animate() {
      this.animationId = requestAnimationFrame(this.animate);
      if (this.renderScene) {
        this.renderScene.update();
      }
    },
    onResize() {
      if (this.renderScene) {
        this.renderScene.resize();
      }
    }
  }
}
</script>

<style scoped>
.game-scene {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.render-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gui-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
```

## 需要修改的文件

### 1. 修改AdvancedRenderScene.js

需要对原始文件进行以下修改：

1. 添加`dispose`方法清理资源
2. 更新资源路径以适应Vue项目结构
3. 确保与Vue生命周期协调的事件处理

```javascript
// 添加dispose方法
dispose() {
  // 清理Three.js资源
  if (this.renderer) {
    this.renderer.dispose();
  }
  if (this.controls) {
    this.controls.dispose();
  }
  if (this.shaderMaterial) {
    this.shaderMaterial.dispose();
  }
  // 移除事件监听
  window.removeEventListener('resize', this.onResize);
}

// 更新资源路径
this.modelPath = '/assets/models/';
this.texturePath = '/assets/textures/';
```

### 2. 修改AdvancedRenderGUI.js

添加`dispose`方法：

```javascript
dispose() {
  if (this.pane) {
    this.pane.dispose();
  }
}
```

## 常见问题与解决方案

### 问题1: Vue项目中的静态资源路径不同

**解决方案**: 
在Vue项目中，静态资源通常放在`public`目录下，URL路径无需包含`public`前缀。确保资源路径使用绝对路径（以`/`开头）。

### 问题2: 组件生命周期管理

**解决方案**:
在Vue组件销毁时清理Three.js资源，防止内存泄漏：

```javascript
beforeUnmount() {
  // 取消动画帧请求
  cancelAnimationFrame(this.animationId);
  
  // 清理Three.js资源
  if (this.renderScene) {
    this.renderScene.dispose();
  }
  
  // 移除事件监听器
  window.removeEventListener('resize', this.onResize);
}
```

### 问题3: 初始化时机

**解决方案**:
确保在Vue组件完全挂载后初始化Three.js：

```javascript
mounted() {
  // Vue确保DOM已完全挂载
  this.$nextTick(() => {
    this.initRenderScene();
    this.animate();
  });
}
```

## 集成检查清单

- [ ] 复制所有必要的渲染相关JS文件到Vue项目
- [ ] 创建资源目录结构并放置模型和贴图
- [ ] 安装必要的npm依赖
- [ ] 创建或修改GameScene.vue组件
- [ ] 修改资源路径以适应Vue项目结构
- [ ] 添加资源清理方法
- [ ] 测试渲染效果和GUI控制

## 项目示例

完整的Vue集成示例代码可以在以下位置找到：
[Vue集成示例代码](https://github.com/litshrimp/ThreeJS-Advanced-LIght/tree/examples/vue-integration)

## 技术支持

如有任何集成问题，请参考[TROUBLESHOOTING.md](../TROUBLESHOOTING.md)或提交GitHub Issue。 