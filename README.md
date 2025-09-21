# StreamWatch 🎬
**流媒体监控与下载工具 / Stream Media Monitoring & Download Tool**

[![版本](https://img.shields.io/badge/版本-1.0.0--2025--Enhanced-green.svg)](https://github.com/MissChina/StreamWatch)
[![许可证](https://img.shields.io/badge/许可证-Custom%20Open%20Source-blue.svg)](./LICENSE)
[![作者](https://img.shields.io/badge/作者-MissChina-orange.svg)](https://github.com/MissChina)

一个功能强大的浏览器脚本，用于监控、检测和下载网页中的流媒体。支持多种流媒体格式检测，包括 HLS、DASH、MP4 等，并提供完整的下载解决方案。

A powerful browser script for monitoring, detecting and downloading streaming media on web pages. Supports detection of various streaming formats including HLS, DASH, MP4, and more, with complete download solutions.

## ✨ 功能特性 / Features

### 🎯 核心功能 / Core Features
- **实时监控** - 自动检测页面中的所有 `<video>` 元素和新增视频
- **智能识别** - 自动识别流媒体类型（HLS、DASH、MP4、WebM、Blob）
- **一键操作** - 每个视频条目支持复制链接、新窗口打开、下载和预览
- **FFmpeg集成** - 专业的HLS流媒体下载解决方案
- **网络拦截** - 拦截并分析 fetch 和 XMLHttpRequest 请求
- **错误监控** - 监控播放错误和缓冲问题
- **性能统计** - 提供详细的监控统计信息

### 🎨 用户界面 / User Interface  
- **可视化面板** - 浮动监控面板，可拖拽移动，支持最小化
- **视频列表** - 实时显示检测到的视频，按格式分类显示
- **操作按钮** - 每个视频条目提供四个操作按钮：
  - 📋 **复制链接** → 一键复制视频URL
  - 🔗 **新窗口打开** → 在独立标签中播放
  - 💾 **下载视频** → 直接保存（若支持）
  - 👁️ **预览** → 内嵌播放器弹出小窗
- **实时日志** - 实时显示监控日志和事件
- **提示通知** - 操作反馈的Toast通知系统

### 🔧 技术特性 / Technical Features
- **用户脚本** - 提供高品质的 Tampermonkey 用户脚本
- **自动监控** - 页面加载完成后自动开启流媒体监控
- **零依赖** - 纯 JavaScript 实现，无需外部依赖
- **跨站点** - 支持在任何网站上运行
- **HLS增强** - 特别优化对HLS(.m3u8)流媒体的监控和下载
- **格式支持** - 支持HLS、DASH、MP4、WebM、Blob等多种格式

### 💾 下载功能 / Download Features
- **HLS流下载** - 集成FFmpeg命令生成，提供完整下载指导
- **直接下载** - 支持MP4、WebM等直接格式的下载  
- **Blob下载** - 支持浏览器生成的Blob URL下载
- **批量操作** - 支持清空列表、批量管理视频条目
- **下载指导** - 详细的FFmpeg使用说明和命令示例

## 📦 安装使用 / Installation & Usage

### Tampermonkey 用户脚本 / Tampermonkey UserScript

1. **安装 Tampermonkey**
   - Chrome: [Tampermonkey Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Tampermonkey Add-on](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

2. **安装脚本**
   ```
   点击安装: streamwatch-userscript.js
   ```

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

| 格式 Format | 扩展名 Extensions | 描述 Description | 下载支持 Download Support |
|-------------|-------------------|------------------|---------------------------|
| **HLS** | `.m3u8` | HTTP Live Streaming | ✅ FFmpeg集成下载 |
| **DASH** | `.mpd` | Dynamic Adaptive Streaming | ✅ FFmpeg集成下载 |
| **MP4** | `.mp4` | MPEG-4 视频格式 | ✅ 直接下载 |
| **WebM** | `.webm` | Google WebM 格式 | ✅ 直接下载 |
| **Audio** | `.mp3`, `.aac`, `.ogg` | 音频格式 | ✅ 直接下载 |
| **Blob** | `blob:` | 浏览器生成的临时URL | ✅ 直接下载 |
| **Live** | `rtmp://`, `rtsp://` | 实时流协议 | 🔄 开发中 |

## 📊 监控功能详解 / Monitoring Features

### 视频元素检测 / Video Element Detection
- 自动检测页面中的 `<video>` 和 `<audio>` 元素
- 监控元素的 `src` 属性变化和新增媒体
- 追踪播放状态和事件
- 实时显示在视频列表中

### 网络请求拦截 / Network Request Interception
- 拦截 `fetch()` 和 `XMLHttpRequest` 请求
- 识别流媒体相关的网络请求
- 分析请求的格式和来源
- 自动添加到视频列表

### 操作功能 / Action Features
- **📋 复制链接**: 一键复制视频URL到剪贴板
- **🔗 新窗口打开**: 在新标签页中打开视频进行播放
- **💾 下载视频**: 根据格式选择最佳下载方式
- **👁️ 预览**: 弹出式视频播放器进行预览

### 事件监控 / Event Monitoring
- `loadstart` - 开始加载
- `loadeddata` - 数据加载完成
- `playing` - 开始播放
- `error` - 播放错误
- `stalled` - 播放卡顿

## 💾 FFmpeg下载指导 / FFmpeg Download Guide

### HLS流媒体下载 / HLS Stream Download

当检测到HLS(.m3u8)流媒体时，StreamWatch会提供完整的FFmpeg下载指导：

#### 基础下载命令 / Basic Download
```bash
ffmpeg -i "https://example.com/playlist.m3u8" -c copy output.mp4
```

#### 高质量转码 / High Quality Transcode  
```bash
ffmpeg -i "https://example.com/playlist.m3u8" -c:v libx264 -c:a aac -b:v 2M -b:a 128k output.mp4
```

#### 仅提取音频 / Audio Only
```bash
ffmpeg -i "https://example.com/playlist.m3u8" -vn -c:a aac output.aac
```

### FFmpeg安装 / FFmpeg Installation

- **Windows**: 下载官方包或使用 `choco install ffmpeg`
- **macOS**: 使用 `brew install ffmpeg`  
- **Ubuntu**: 使用 `sudo apt install ffmpeg`

### 使用流程 / Usage Workflow

1. 📺 **检测视频** - StreamWatch自动检测页面中的视频
2. 🎯 **识别格式** - 自动识别HLS、DASH、MP4等格式
3. 💾 **点击下载** - 点击下载按钮获取FFmpeg命令
4. 📋 **复制命令** - 一键复制到剪贴板
5. ⚡ **执行下载** - 在命令行中执行FFmpeg命令

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

### 示例1：监控B站视频 / Example 1: Monitor Bilibili
```javascript
// 安装脚本后自动开始监控
// 在B站打开任意视频页面，右上角会显示StreamWatch面板
// 点击视频条目的下载按钮获取FFmpeg命令

// 控制台命令（可选）
streamWatchReport()      // 查看监控报告
streamWatchToggle()      // 切换监控状态
```

### 示例2：下载HLS直播流 / Example 2: Download HLS Live Stream
```javascript
// 1. 访问直播网站
// 2. StreamWatch自动检测HLS流
// 3. 点击💾下载按钮
// 4. 在弹出的指导窗口中复制FFmpeg命令
// 5. 在命令行执行：
ffmpeg -i "https://live.example.com/stream.m3u8" -c copy live_stream.mp4
```

### 示例3：批量管理视频 / Example 3: Batch Video Management
```javascript
// 访问包含多个视频的页面
// StreamWatch会在视频列表中显示所有检测到的视频
// 可以：
// - 📋 复制所有视频链接
// - 🔗 在新窗口中打开播放
// - 👁️ 预览视频内容
// - 🗑️ 清空视频列表
```

### 示例4：下载不同格式 / Example 4: Download Different Formats
```javascript
// MP4/WebM直接下载
点击💾按钮 → 浏览器直接下载

// HLS流下载
点击💾按钮 → 获取FFmpeg命令 → 命令行执行

// Blob URL下载  
点击💾按钮 → 浏览器直接保存

// 音频提取
复制FFmpeg音频命令 → 命令行执行
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
