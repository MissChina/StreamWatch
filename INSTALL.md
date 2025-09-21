# StreamWatch 安装指南 / Installation Guide

## 🚀 快速开始 / Quick Start

### 方式一：Tampermonkey 用户脚本 (推荐)

1. **安装 Tampermonkey**
   - Chrome: [Chrome 网上应用店](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Firefox 附加组件](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/)
   - Edge: [Microsoft Edge 外接程序](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **安装脚本**
   ```
   1. 下载 streamwatch-userscript.js 文件
   2. 在 Tampermonkey 管理页面点击"添加新脚本"
   3. 将文件内容复制粘贴到编辑器中
   4. 按 Ctrl+S 保存脚本
   ```

3. **使用脚本**
   - 访问任何包含视频的网站
   - 右上角会显示 StreamWatch 监控面板
   - 点击"启动监控"开始使用

### 方式二：控制台脚本

1. **准备脚本**
   - 打开 `streamwatch-console.js` 文件
   - 复制全部内容到剪贴板

2. **执行脚本**
   - 在目标网站按 F12 打开开发者工具
   - 切换到 Console (控制台) 标签
   - 粘贴脚本代码并按回车执行

3. **开始监控**
   ```javascript
   sw.help()     // 查看帮助
   sw.start()    // 开始监控
   ```

## 🧪 测试脚本

使用提供的 `test.html` 文件测试脚本功能：

1. 在浏览器中打开 `test.html` 文件
2. 按照页面指引安装并运行脚本
3. 测试各种功能和场景

## ⚙️ 配置选项

### Tampermonkey 版本配置

脚本支持以下配置选项，可在脚本头部修改：

```javascript
// @match        *://*/*          // 匹配所有网站
// @match        https://*.youtube.com/*  // 仅匹配 YouTube
// @match        https://*.bilibili.com/* // 仅匹配 B站
```

### 控制台版本配置

```javascript
// 修改监控格式
streamWatch.streamFormats.custom = ['.custom', '/custom/'];

// 添加自定义事件处理
streamWatch.customHandler = function(event) {
    console.log('Custom event:', event);
};
```

## 🔧 故障排除

### 常见问题

1. **脚本不工作**
   - 确保 Tampermonkey 已启用
   - 检查脚本是否正确安装
   - 刷新页面重试

2. **无法检测到媒体**
   - 确保监控已启动
   - 检查页面是否真的包含媒体内容
   - 查看控制台是否有错误信息

3. **权限问题**
   - 某些网站可能有安全限制
   - 尝试在隐私模式下使用
   - 检查浏览器扩展权限

### 调试模式

启用详细日志输出：

```javascript
// 控制台版本
sw.start()
sw.debug = true  // 启用调试模式

// Tampermonkey 版本
streamWatch.debug = true  // 在脚本中添加此行
```

## 📞 获取帮助

如果遇到问题，请：

1. 查看 [FAQ](README.md#-常见问题--faq) 部分
2. 在 [GitHub Issues](https://github.com/MissChina/StreamWatch/issues) 提交问题
3. 提供详细的错误信息和使用环境

## 🔄 更新脚本

### Tampermonkey 版本
- 脚本会自动检查更新
- 或手动访问管理页面检查更新

### 控制台版本
- 下载最新的 `streamwatch-console.js` 文件
- 重新执行新版本的脚本代码

---

**版权所有 © 2025 MissChina**