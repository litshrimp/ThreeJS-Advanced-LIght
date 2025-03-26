# 高级烘焙渲染示例

这是一个简单的演示项目，展示如何在Three.js中实现高质量的烘焙渲染效果。项目提供了两种实现方式：

1. 标准版（带光照贴图）：使用烘焙贴图 + 光照贴图实现动态光照效果
2. 简化版：仅使用烘焙贴图，无动态光照效果

## 使用方法

### 准备资源

将以下文件放入相应目录：

- 模型：`/static/advanced-render/models/testAdvancedRender.glb`
- 烘焙贴图：`/static/advanced-render/textures/testAdvancedRender.png`
- 光照贴图（可选）：`/static/advanced-render/textures/testAdvancedRender_lightmap.png`

#### 资源命名规则

- 模型和贴图应该保持相同的基础名称（例如`testAdvancedRender`）
- 光照贴图应该添加`_lightmap`后缀
- 所有路径都应该相对于`static/advanced-render/`目录

### 运行项目

在本地服务器中运行项目（如Live Server）：

1. 基础版本：打开 `src/AdvancedRender/basic-test.html`
2. 高级版本：打开 `src/AdvancedRender/test.html`

## 光照贴图制作与使用

### 光照贴图是什么？

光照贴图是一种特殊的纹理贴图，用于控制动态光源的影响区域和强度：

- **红色通道(R)**：控制第一种光源（如电视/显示器）
- **绿色通道(G)**：控制第二种光源（如桌面灯）
- **蓝色通道(B)**：控制第三种光源（如其他装饰灯）

颜色越亮，光照效果越强。

### 创建光照贴图的步骤

1. **在Blender中创建**：
   - 使用已有的UV映射
   - 为发光区域创建红色材质
   - 烘焙为纹理图
   - 保存为PNG格式

2. **使用图像编辑软件**：
   - 复制烘焙贴图
   - 删除所有内容，保留黑色背景
   - 在发光区域绘制红色
   - 调整红色亮度控制光照强度

3. **简单测试方法**：
   - 创建纯黑色图像
   - 绘制一个红色区域（如圆形）
   - 保存为`yourModelName_lightmap.png`

### 光照贴图使用要点

- 光照贴图必须与模型使用相同的UV坐标
- PNG格式支持透明度
- 不同光源可以使用不同RGB通道区分
- 光照贴图不需要高分辨率，可以比烘焙贴图小

## GLSL混合模式使用

本项目使用了自定义GLSL着色器实现光照效果，特别是`lighten`混合模式：

```glsl
// 简化的lighten混合模式
vec3 lighten(vec3 base, vec3 blend, float opacity) {
  vec3 lightened = max(base, blend);
  return mix(base, lightened, opacity);
}
```

### 可用混合模式

除了`lighten`外，还可以尝试其他混合模式：

- `add`：将光源颜色叠加到基础颜色上
- `screen`：类似Photoshop中的"滤色"，适合模拟光照
- `overlay`：类似Photoshop中的"叠加"，增强对比度

修改方式：简单替换`lighten`函数实现即可。

## 技术实现细节

### 关键代码解析

光照效果的核心代码在shader中：

```glsl
// 从光照贴图中获取光照信息 (R通道)
float lightMask = texture2D(uLightMapTexture, vUv).r;

// 应用光照效果
vec3 finalColor = lighten(bakedColor, uLightColor, lightMask * uLightStrength);
```

### 参数调整

使用GUI面板可以调整以下参数：

- **光源颜色**：改变发光区域的颜色
- **光源强度**：调整发光效果的强度（0-3）

### 代码层次结构

- `AdvancedRenderScene.js`：处理场景、模型和着色器
- `AdvancedRenderGUI.js`：提供交互控制界面
- `utils.js`：处理不同版本Three.js的兼容性
- `ErrorHandler.js`：提供错误处理和显示
- `LoadingManager.js`：管理资源加载

## 实现自己的项目

### 1. 复制必要文件

```
/src/AdvancedRender
/static/advanced-render
```

### 2. 替换资源

- 替换模型和贴图
- 确保文件名匹配
- 调整光照贴图以匹配你的模型

### 3. 自定义光照

- 修改默认光源颜色和强度
- 为不同区域创建不同光照（使用RGB通道）
- 调整混合模式以获得最佳效果

## 故障排除

如果遇到问题，请检查：

1. 文件路径和命名是否正确
2. 光照贴图是否包含有效数据（非全黑）
3. 贴图的UV映射是否与模型匹配
4. 控制台是否有错误信息

## 制作光照贴图指南

如果您想为自己的模型创建光照贴图，可以按照以下步骤：

1. 在Blender中创建场景并设置UV坐标
2. 创建一个新的材质，用于绘制光照区域
3. 在发光区域（如灯光、显示器等）使用红色材质
4. 烘焙出这个材质作为光照贴图
5. 在Three.js中结合使用基础烘焙贴图和光照贴图

更详细的指南请查看 `LightMapGuide.md`

## 项目结构

```
/src/AdvancedRender
  ├── AdvancedRenderScene.js - 完整版渲染场景（带光照贴图）
  ├── AdvancedRenderGUI.js - GUI控制界面
  ├── BasicRenderScene.js - 简化版渲染场景（仅烘焙贴图）
  ├── ErrorHandler.js - 错误处理类
  ├── LoadingManager.js - 加载管理器
  ├── utils.js - 实用工具函数
  ├── index.js - 主入口
  ├── test.html - 测试页面
  ├── basic-test.html - 简化版测试页面
  └── README.md - 说明文档

/static/advanced-render
  ├── models/ - 模型文件
  └── textures/ - 贴图文件
```

## 参数调整

使用GUI控制面板可以调整以下参数：

- 光源颜色：调整动态光源的颜色
- 光源强度：调整动态光源的强度（0-3） 