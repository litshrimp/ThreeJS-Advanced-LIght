# 项目排障指南

## 常见问题与解决方案

### Node.js 加密模块错误

如果遇到以下错误：

```
Error: error:0308010C:digital envelope routines::unsupported
```

这是因为在 Node.js v17 及以上版本中，默认启用了更严格的 OpenSSL 处理。以下是解决方法：

#### 已应用的修复

项目已在 `package.json` 中添加了 `--openssl-legacy-provider` 标志：

```json
"scripts": {
  "dev": "cross-env NODE_OPTIONS=--openssl-legacy-provider webpack serve --config ./bundler/webpack.dev.js"
}
```

#### 手动解决方法（如果仍然遇到问题）

**方法 1: 降级 Node.js**
- 安装 Node.js v16.x LTS 版本
- 使用 nvm 管理多个 Node.js 版本：
  ```
  nvm install 16
  nvm use 16
  ```

**方法 2: 临时设置环境变量**
- macOS/Linux:
  ```
  export NODE_OPTIONS=--openssl-legacy-provider
  npm run dev
  ```
- Windows:
  ```
  set NODE_OPTIONS=--openssl-legacy-provider
  npm run dev
  ```

### 贴图加载问题

如果模型或贴图无法正确加载：

1. 确认文件路径是否正确
2. 检查 `/static/advanced-render/` 目录结构
3. 确保服务器正常运行
4. 检查浏览器控制台是否有 404 错误

目录结构应如下：

```
/static/advanced-render/
  ├── models/
  │   └── testAdvancedRender.glb
  └── textures/
      ├── testAdvancedRender.png
      └── testAdvancedRender_lightmap.png
```

### Tweakpane 加载问题

如果 GUI 控件不显示或报错：

1. 确认 `<script src="../../static/lib/tweakpane-3.1.0.min.js"></script>` 在 HTML 文件中
2. 确认 `static/lib/` 目录中存在 tweakpane 文件
3. 重新下载 tweakpane：
   ```
   curl -o static/lib/tweakpane-3.1.0.min.js https://cdn.jsdelivr.net/npm/tweakpane@3.1.0/dist/tweakpane.min.js
   ```

## 高级渲染模块特定问题

### 光照贴图不生效

1. 确认光照贴图格式正确
2. 查看控制台是否有加载错误
3. 确认光照贴图中红色通道有可见内容
4. 确认着色器代码正确引用 lightMapTexture

### GUI 控制不起作用

1. 检查控制台是否有 "No matching controller" 错误
2. 确认 GUI 引用的参数名称与场景中定义一致
3. 确认 updateLightColor 和 updateLightStrength 方法正确实现

## 联系与支持

如有其他问题，请提交 issue 或联系项目维护者。 