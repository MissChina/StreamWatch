# StreamWatch 🎬
**流媒体监控脚本 / Stream Media Monitoring Script**

[![版本](https://img.shields.io/badge/版本-2.7.0-green.svg)](https://github.com/MissChina/StreamWatch)
[![许可证](https://img.shields.io/badge/许可证-Custom%20Open%20Source-blue.svg)](./LICENSE)
[![作者](https://img.shields.io/badge/作者-MissChina-orange.svg)](https://github.com/MissChina)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-compatible-blue.svg)](https://tampermonkey.net/)

一个功能强大的浏览器用户脚本，专为监控和检测网页中的流媒体加载情况而设计。支持多种流媒体格式检测，包括 HLS、DASH、MP4 等，提供实时监控面板和丰富的API接口。

A powerful browser userscript designed for monitoring and detecting streaming media loading on web pages. Supports detection of various streaming formats including HLS, DASH, MP4, and more, with real-time monitoring panel and rich API interfaces.

## ✨ 功能特性 / Features

### 🎯 核心功能 / Core Features
- **🔍 实时监控** - 实时检测页面中的媒体元素和流媒体请求
- **📡 格式识别** - 支持 HLS (.m3u8)、DASH (.mpd)、MP4、WebM、AAC 等多种格式
- **🌐 网络拦截** - 智能拦截并分析 fetch 和 XMLHttpRequest 请求
- **⚠️ 错误监控** - 监控播放错误和缓冲问题
- **📊 性能统计** - 提供详细的监控统计信息和运行报告
- **💾 数据导出** - 支持导出监控数据为 JSON 格式，包含 FFmpeg 命令

### 🎨 用户界面 / User Interface
- **🎛️ 可视化面板** - 半透明浮动监控面板，可拖拽移动和最小化
- **🎮 控制台接口** - 丰富的控制台命令，便于调试和自动化
- **📝 实时日志** - 实时显示监控日志和事件，支持彩色输出
- **🔄 智能更新** - 实时更新检测计数和状态指示器
- **📱 响应式设计** - 支持桌面和移动设备的优化显示

### 🔧 技术特性 / Technical Features
- **📦 用户脚本** - 提供高品质的 Tampermonkey 用户脚本
- **🚀 自动监控** - 页面加载完成后自动开启流媒体监控
- **🔄 零依赖** - 纯 JavaScript 实现，无需外部依赖
- **⚡ 性能优化** - 智能过滤和高效检测算法
- **🔒 安全可靠** - 严格的URL验证和错误处理机制

## 📦 安装使用 / Installation & Usage

### 方法一：Tampermonkey 用户脚本 (推荐)
1. **安装 Tampermonkey 扩展**
   - [Chrome/Edge 安装](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox 安装](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

2. **安装 StreamWatch 脚本**
   ```
   https://github.com/MissChina/StreamWatch/raw/main/streamwatch-userscript.js
   ```

3. **自动运行**
   - 脚本会在所有网站自动运行
   - 右上角出现监控面板即表示运行成功

### 方法二：手动加载测试
1. 下载 `streamwatch-userscript.js` 文件
2. 打开 `test.html` 页面进行功能测试
3. 在浏览器控制台手动执行脚本代码

## 🎮 用户界面功能 / User Interface Features

### 监控面板控制 / Monitoring Panel Controls
- **▶️/⏹️ 启动/停止监控** - 手动切换监控状态
- **➖ 最小化面板** - 点击最小化按钮收起监控面板
- **❌ 关闭面板** - 临时隐藏面板，通过重新打开按钮恢复
- **🔄 拖拽移动** - 可以拖拽面板到任意位置，自动保存位置
- **📊 实时统计** - 显示检测到的流媒体数量和类型

### 操作按钮 / Action Buttons
- **🗑️ 清空列表** - 清空当前检测到的所有流媒体记录
- **📥 导出数据** - 导出监控数据为 JSON 文件，包含完整信息

## 🎯 支持的流媒体格式 / Supported Formats

| 格式 | 扩展名 | 说明 |
|------|-------|------|
| **HLS** | `.m3u8` | HTTP Live Streaming，支持自适应码率 |
| **DASH** | `.mpd` | Dynamic Adaptive Streaming，MPEG-DASH 格式 |
| **MP4** | `.mp4` | 标准 MP4 视频格式 |
| **WebM** | `.webm` | 开源 WebM 视频格式 |
| **AVI** | `.avi` | 传统 AVI 视频格式 |
| **MOV** | `.mov` | QuickTime 视频格式 |
| **FLV** | `.flv` | Flash 视频格式 |
| **MP3** | `.mp3` | MP3 音频格式 |
| **AAC** | `.aac` | AAC 音频格式 |
| **WAV** | `.wav` | WAV 无损音频格式 |

## 📊 监控功能详解 / Monitoring Features

### 🔍 检测机制 / Detection Mechanisms
1. **DOM 元素监控** - 监控页面中的 `<video>` 和 `<audio>` 元素
2. **网络请求拦截** - 拦截 `fetch` 和 `XMLHttpRequest` 请求
3. **URL 模式匹配** - 基于文件扩展名和路径模式识别流媒体
4. **事件监听** - 监听媒体元素的加载和播放事件
5. **动态扫描** - 定期扫描页面变化和新增元素

### 📈 统计信息 / Statistics
- **总检测数量** - 累计检测到的流媒体数量
- **格式分类统计** - 按格式类型分类的详细统计
- **时间戳记录** - 每个检测事件的精确时间记录
- **页面信息** - 当前页面URL和标题记录

## 💻 API 接口 / API Interface

### 全局控制台命令 / Global Console Commands

```javascript
// 基础控制命令
swToggle()                  // 切换监控状态
swClear()                   // 清空检测列表
swExport()                  // 导出数据为JSON文件
swReport()                  // 显示统计报告（表格形式）
swDestroy()                 // 完全卸载脚本

// 向后兼容命令
streamWatchReport()         // 等同于 swReport()
streamWatchToggle()         // 等同于 swToggle()
```

### 高级 API 操作 / Advanced API Operations

```javascript
// 访问主实例
const sw = window.streamWatch;          // 主实例引用
const swPro = window.streamWatchPro;    // 完整实例引用

// 获取详细报告
const report = sw.getReport();
console.log('监控报告:', report);

// 手动分析URL
sw.analyze('https://example.com/video.m3u8');

// 手动切换状态
sw.toggle();

// 检查当前状态
console.log('监控状态:', sw.isActive);
console.log('检测数量:', sw.streams.size);
```

## 🛠️ 开发说明 / Development

### 项目结构 / Project Structure
```
StreamWatch/
├── README.md                    # 项目说明文档
├── LICENSE                      # 自定义开源许可证
├── streamwatch-userscript.js    # Tampermonkey 用户脚本 (主要文件)
├── test.html                    # 功能测试页面
└── streamwatch.png             # 项目图标
```

### 配置选项 / Configuration Options
```javascript
const CONFIG = {
    VERSION: '2.7.0',
    SCAN_INTERVAL: 3000,         // 扫描间隔(毫秒)
    MAX_STREAMS: 100,            // 最大缓存数量
    TOAST_DURATION: 3000,        // 提示持续时间
    THEME: {                     // 主题配色
        PRIMARY: '#00ff88',
        SECONDARY: '#6c5ce7',
        // ... 更多颜色设置
    }
};
```

### 自定义扩展 / Custom Extensions
```javascript
// 添加新的流媒体格式检测
STREAM_PATTERNS.CUSTOM = ['.custom', '/custom/path'];

// 添加自定义事件处理
window.streamWatch.customHandler = function(event) {
    console.log('自定义事件:', event);
};

// 修改检测过滤规则
window.streamWatch.isBlockedUrl = function(url) {
    return url.includes('blocked-domain.com');
};
```

## 📝 使用示例 / Usage Examples

### 示例1：监控 B站视频 / Example 1: Monitor Bilibili
```javascript
// 在 B站 打开控制台，查看检测结果
swReport()                    // 查看当前检测结果
swToggle()                    // 手动控制监控状态

// 获取详细信息
const report = window.streamWatch.getReport();
console.log('B站检测报告:', report);
```

### 示例2：监控直播流 / Example 2: Monitor Live Stream
```javascript
// 在直播网站使用
swToggle()                    // 开始监控
setTimeout(() => {
    swReport();              // 5秒后查看结果
}, 5000);

// 导出检测到的流媒体
swExport();                  // 下载 JSON 文件
```

### 示例3：自动化脚本 / Example 3: Automation Script
```javascript
// 页面加载后自动执行
setTimeout(() => {
    const streams = window.streamWatch.getReport().streams;
    if (streams.length > 0) {
        console.log(`检测到 ${streams.length} 个流媒体:`, streams);
        // 自动导出或处理...
    }
}, 5000);
```

## 🐛 常见问题 / FAQ

### Q: 为什么看不到监控面板？
A: 
1. 确保已安装 Tampermonkey 扩展
2. 检查脚本是否正确安装和启用
3. 刷新页面重新加载脚本
4. 查看浏览器控制台是否有错误信息

### Q: HLS流无法检测？
A: 
1. 确保URL包含 `.m3u8` 标识或相关模式
2. 检查网络请求是否被正确拦截
3. 某些网站可能使用加密或混淆的请求
4. 查看控制台错误日志获取详细信息

### Q: 如何自定义检测规则？
A: 
```javascript
// 修改检测模式
window.streamWatch.analyzeUrl = function(url) {
    // 自定义检测逻辑
    if (url.includes('custom-pattern')) {
        // 处理自定义格式
    }
};
```

### Q: 数据导出格式说明？
A: 导出的JSON文件包含：
- 脚本版本和时间戳
- 页面信息（URL和标题）
- 检测到的流媒体列表
- 对应的FFmpeg下载命令

### Q: 如何贡献代码？
A: 
1. Fork 项目到自己的账户
2. 创建新的功能分支
3. 提交代码修改和测试
4. 发起 Pull Request
5. **必须保留原作者信息和许可证条款**

## 🔒 许可证 / License

本项目采用自定义开源协议，具体条款请查看 [LICENSE](./LICENSE) 文件。

**重要提醒:**
- ❌ 禁止商业用途和盈利性使用
- ❌ 禁止盗用代码和移除作者信息
- ✅ 允许个人学习和研究使用
- ✅ 允许二次开发，但需保留原作者信息
- ✅ 允许非营利性分享和传播

This project uses a custom open source license. Please see the [LICENSE](./LICENSE) file for details.

**Important Notes:**
- ❌ Commercial use and profit-making activities are prohibited
- ❌ Code theft and removal of author information are prohibited
- ✅ Personal learning and research use is allowed
- ✅ Secondary development is allowed, but original author information must be retained
- ✅ Non-profit sharing and distribution is allowed

## 🤝 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！我们期待您的参与和贡献。

**贡献指南 / Guidelines:**
- 保持代码风格一致性
- 添加必要的注释和文档
- 充分测试新功能和修改
- 遵守项目许可证条款
- **必须保留原作者信息**

**开发环境 / Development Environment:**
- 支持所有现代浏览器
- 需要 Tampermonkey 扩展
- 建议使用 Visual Studio Code
- 支持 ES6+ 语法

## 📞 联系方式 / Contact

- **作者 Author**: MissChina
- **GitHub**: https://github.com/MissChina
- **项目地址 Repository**: https://github.com/MissChina/StreamWatch
- **问题反馈 Issues**: https://github.com/MissChina/StreamWatch/issues
- **功能建议 Feature Requests**: 欢迎通过 Issues 提出

## 📈 更新日志 / Changelog

### v2.7.0 (2025-01-XX)
- 🔧 **修复版本号不一致问题**
- 🌟 **优化全局变量命名规范**
- 🐛 **改进代码逻辑和错误处理**
- 📚 **完全重写README文档**
- ⚡ **统一API接口命名**
- 🎨 **优化UI交互体验**
- 🔄 **添加向后兼容性支持**

### v2.6.0 (2024)
- 全新半透明UI设计
- 精确的流媒体检测算法
- 改进的拖拽体验
- 添加关闭按钮
- 更严格的筛选条件

## 🌟 Star History

如果这个项目对你有帮助，请考虑给它一个 ⭐️！

If this project helps you, please consider giving it a ⭐️!

[![Star History Chart](https://api.star-history.com/svg?repos=MissChina/StreamWatch&type=Date)](https://star-history.com/#MissChina/StreamWatch&Date)

---

**版权所有 © 2025 MissChina | Copyright © 2025 MissChina**

*StreamWatch - 让流媒体监控变得简单而强大*