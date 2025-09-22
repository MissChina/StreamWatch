# StreamWatch 🎬
**流媒体监控脚本 / Stream Media Monitoring Script**

[![版本](https://img.shields.io/badge/版本-1.0.0--2025-green.svg)](https://github.com/MissChina/StreamWatch)
[![许可证](https://img.shields.io/badge/许可证-Custom%20Open%20Source-blue.svg)](./LICENSE)
[![作者](https://img.shields.io/badge/作者-MissChina-orange.svg)](https://github.com/MissChina)

一个功能强大的浏览器脚本，用于监控和检测网页中的流媒体加载情况。支持多种流媒体格式检测，包括 HLS、DASH、MP4 等。

A powerful browser script for monitoring and detecting streaming media loading on web pages. Supports detection of various streaming formats including HLS, DASH, MP4, and more.

## ✨ 功能特性 / Features

### 🎯 核心功能 / Core Features
- **实时监控** - 实时检测页面中的媒体元素和流媒体请求
- **格式识别** - 支持 HLS (.m3u8)、DASH (.mpd)、MP4、WebM 等多种格式
- **网络拦截** - 拦截并分析 fetch 和 XMLHttpRequest 请求
- **错误监控** - 监控播放错误和缓冲问题
- **性能统计** - 提供详细的监控统计信息

### 🎨 用户界面 / User Interface
- **可视化面板** - 浮动监控面板，可拖拽移动
- **控制台接口** - 丰富的控制台命令，便于调试
- **实时日志** - 实时显示监控日志和事件
- **数据导出** - 支持导出监控数据为 JSON 格式

### 🔧 技术特性 / Technical Features
- **用户脚本** - 提供高品质的 Tampermonkey 用户脚本
- **自动监控** - 页面加载完成后自动开启流媒体监控
- **零依赖** - 纯 JavaScript 实现，无需外部依赖
- **跨站点** - 支持在任何网站上运行
- **HLS增强** - 特别优化对HLS(.m3u8)流媒体的监控和错误处理

## 📦 安装使用 / Installation & Usage

### Tampermonkey 用户脚本 / Tampermonkey UserScript

1. **安装 Tampermonkey**
   - Chrome: [Tampermonkey Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Tampermonkey Add-on](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

2. **安装脚本**

   - [点击安装](https://github.com/MissChina/StreamWatch/raw/main/streamwatch-userscript.js)


3. **使用方法**
   - 访问任何视频网站
   - 脚本会自动加载监控面板
   - 监控会在页面加载完成后自动启动
   - 可以手动点击"停止监控"/"启动监控"切换状态

## 🎮 用户界面功能 / User Interface Features

### 监控面板控制 / Monitoring Panel Controls
- **启动/停止监控** - 手动切换监控状态
- **最小化面板** - 点击 `_` 按钮最小化监控面板
- **拖拽移动** - 可以拖拽面板到任意位置
- **实时统计** - 显示媒体元素、流媒体请求、错误数和运行时间

### 全局控制台命令 / Global Console Commands

```javascript
// 查看监控报告
streamWatchReport()

// 切换监控状态  
streamWatchToggle()
```

## 🎯 支持的流媒体格式 / Supported Formats

| 格式 Format | 扩展名 Extensions | 描述 Description |
|-------------|-------------------|------------------|
| **HLS** | `.m3u8` | HTTP Live Streaming |
| **DASH** | `.mpd` | Dynamic Adaptive Streaming |
| **MP4** | `.mp4` | MPEG-4 视频格式 |
| **WebM** | `.webm` | Google WebM 格式 |
| **Audio** | `.mp3`, `.aac`, `.ogg` | 音频格式 |
| **Live** | `rtmp://`, `rtsp://` | 实时流协议 |

## 📊 监控功能详解 / Monitoring Features

### 媒体元素检测 / Media Element Detection
- 自动检测页面中的 `<video>` 和 `<audio>` 元素
- 监控元素的 `src` 属性变化
- 追踪播放状态和事件

### 网络请求拦截 / Network Request Interception
- 拦截 `fetch()` 和 `XMLHttpRequest` 请求
- 识别流媒体相关的网络请求
- 分析请求的格式和来源

### 事件监控 / Event Monitoring
- `loadstart` - 开始加载
- `loadeddata` - 数据加载完成
- `playing` - 开始播放
- `error` - 播放错误
- `stalled` - 播放卡顿

## 🛠️ 开发说明 / Development

### 项目结构 / Project Structure
```
StreamWatch/
├── README.md                    # 项目说明
├── LICENSE                      # 自定义许可证
├── streamwatch-userscript.js    # Tampermonkey 用户脚本 (主要脚本)
└── test.html                    # 测试页面
```

### 自定义扩展 / Custom Extensions
```javascript
// 添加新的流媒体格式检测
streamWatch.streamFormats.newFormat = ['.custom', '/custom/'];

// 添加自定义事件处理
streamWatch.customHandler = function(event) {
    console.log('Custom event:', event);
};
```

## 🔒 许可证 / License

本项目采用自定义开源协议，具体条款请查看 [LICENSE](./LICENSE) 文件。

**重要提醒:**
- ❌ 禁止商业用途
- ❌ 禁止盗用代码
- ✅ 个人学习使用
- ✅ 二次开发需保留原作者信息

This project uses a custom open source license. Please see the [LICENSE](./LICENSE) file for details.

## 📝 使用示例 / Usage Examples

### 示例1：监控 B站视频 / Example 1: Monitor Bilibili
```javascript
// 在 B站 打开控制台，粘贴脚本后
sw.start()              // 开始监控
sw.monitor('video')     // 监控所有video元素
sw.search('m4s')        // 搜索B站的m4s分段
```

### 示例2：监控直播流 / Example 2: Monitor Live Stream
```javascript
sw.start()              // 开始监控
sw.search('m3u8')       // 搜索HLS流
sw.analyze(url)         // 分析具体的流URL
```

### 示例3：导出数据 / Example 3: Export Data
```javascript
sw.start()              // 监控一段时间后
const data = sw.export() // 导出监控数据
```

## 🐛 常见问题 / FAQ

### Q: 脚本无法检测到流媒体？
A: 请确保：
1. 脚本已正确加载
2. 脚本会自动启动监控
3. 页面确实包含流媒体内容
4. 检查浏览器控制台是否有错误信息

### Q: 如何在特定网站使用？
A: 
1. Tampermonkey版本会自动在所有网站运行
2. 脚本会在页面加载完成后自动开始监控
3. 可以通过监控面板手动控制开启/关闭

### Q: HLS流无法检测？
A: 
1. 确保URL包含.m3u8或相关HLS标识
2. 检查网络请求是否被正确拦截
3. 查看错误日志获取详细信息

### Q: 如何贡献代码？
A: 
1. Fork 项目
2. 创建功能分支
3. 提交 Pull Request
4. **必须保留原作者信息**

## 🤝 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

Guidelines for contributing:
- 保持代码风格一致
- 添加必要的注释
- 测试新功能
- **必须遵守许可证条款**

## 📞 联系方式 / Contact

- **作者 Author**: MissChina
- **GitHub**: https://github.com/MissChina
- **项目地址 Repository**: https://github.com/MissChina/StreamWatch
- **问题反馈 Issues**: https://github.com/MissChina/StreamWatch/issues

---

## 🌟 Star History

如果这个项目对你有帮助，请考虑给它一个 ⭐️

If this project helps you, please consider giving it a ⭐️

---

**版权所有 © 2025 MissChina | Copyright © 2025 MissChina**
