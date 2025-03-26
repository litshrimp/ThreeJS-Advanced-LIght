# ThreeJS-Advanced-Light

使用Three.js实现高级光照效果的演示项目，包含烘焙贴图和动态光照系统。

## 项目特点

- 基于Three.js的高质量烘焙渲染
- 动态光照系统，支持实时调整光照颜色和强度
- 自定义着色器实现光照混合效果
- 交互式GUI控制面板
- 支持不同版本Three.js的兼容性处理

## 在线演示

[查看在线演示](https://litshrimp.github.io/ThreeJS-Advanced-LIght/)（即将上线）

## 项目结构

```
/src
  /AdvancedRender      - 高级渲染核心代码
    AdvancedRenderScene.js  - 场景和渲染逻辑
    AdvancedRenderGUI.js    - 交互式GUI控制面板
    ErrorHandler.js         - 错误处理组件
    LoadingManager.js       - 资源加载管理
    utils.js                - 工具函数和兼容性处理
    README.md               - 高级渲染模块文档
    test.html               - 完整版测试页面
    basic-test.html         - 简化版测试页面

/static
  /advanced-render     - 示例资源文件
    /models            - 3D模型文件
    /textures          - 烘焙贴图和光照贴图
  /lib                 - 第三方库
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 光照贴图使用指南

光照贴图是一种特殊的纹理贴图，用于控制动态光源的影响区域和强度：

- **红色通道(R)**：控制第一种光源（如电视/显示器）
- **绿色通道(G)**：控制第二种光源（如桌面灯）
- **蓝色通道(B)**：控制第三种光源（如其他装饰灯）

详细使用指南请参考 [src/AdvancedRender/README.md](src/AdvancedRender/README.md)

## 在Vue项目中使用

这个项目中的高级渲染系统也可以集成到Vue项目中，详细步骤请参考 [Vue集成指南](docs/VueIntegration.md)。

## 技术实现

- **Three.js**：WebGL 3D渲染
- **Tweakpane**：交互式GUI控制面板
- **GLSL着色器**：自定义光照混合效果

## 常见问题

如果遇到问题，请参考 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) 获取解决方案。

## 许可证

[MIT](LICENSE)
