/*
 * StreamWatch Console Script - 流媒体监控控制台脚本
 * 
 * 使用方法：复制此脚本到浏览器控制台并执行
 * Usage: Copy this script to browser console and execute
 * 
 * Copyright (c) 2025 MissChina
 * GitHub: https://github.com/MissChina/StreamWatch
 * 
 * 自定义开源协议：
 * - 禁止商业用途
 * - 禁止盗用
 * - 个人二次开发必须保留原出处及作者信息
 * 
 * Custom Open Source License:
 * - No commercial use allowed
 * - No plagiarism allowed  
 * - Personal modifications must retain original source and author information
 * 
 * 版本: 1.0.0-2025
 * Version: 1.0.0-2025
 */

(function() {
    'use strict';
    
    // 防止重复加载
    if (window.StreamWatchConsole) {
        console.warn('StreamWatch 控制台脚本已经在运行中！');
        return;
    }
    
    // 版本信息
    const STREAMWATCH_VERSION = '1.0.0-2025';
    const AUTHOR = 'MissChina';
    const REPO_URL = 'https://github.com/MissChina/StreamWatch';
    
    // 显示版权信息
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🎬 StreamWatch Console v${STREAMWATCH_VERSION}                        ║
║  📝 Author: ${AUTHOR}                                      ║
║  📍 Repository: ${REPO_URL}     ║
║                                                              ║
║  ⚖️  自定义开源协议 - Custom Open Source License:             ║
║  • 禁止商业用途 - No commercial use                          ║
║  • 禁止盗用 - No plagiarism                                  ║
║  • 个人二开必须保留原出处 - Keep attribution for modifications ║
╚══════════════════════════════════════════════════════════════╝
    `);
    
    // 流媒体监控控制台类
    class StreamWatchConsole {
        constructor() {
            this.version = STREAMWATCH_VERSION;
            this.author = AUTHOR;
            this.isActive = false;
            this.mediaElements = new Set();
            this.networkRequests = new Map();
            this.stats = {
                mediaElementsFound: 0,
                streamRequests: 0,
                errors: 0,
                startTime: Date.now(),
                lastUpdate: Date.now()
            };
            
            // 支持的流媒体格式
            this.streamFormats = {
                hls: ['.m3u8', '/hls/', 'manifest.m3u8'],
                dash: ['.mpd', '/dash/', 'manifest.mpd'],
                video: ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv'],
                audio: ['.mp3', '.aac', '.ogg', '.wav', '.flac', '.m4a'],
                live: ['live', 'stream', 'rtmp://', 'rtsp://', 'ws://', 'wss://'],
                cdn: ['cdn', 'edge', 'origin', 'streaming']
            };
            
            this.init();
        }
        
        init() {
            console.log('🚀 正在初始化 StreamWatch 监控系统...');
            this.setupEventListeners();
            this.monitorExistingMedia();
            this.interceptNetworkRequests();
            this.createConsoleInterface();
            console.log('✅ StreamWatch 监控系统初始化完成！');
            console.log('💡 输入 sw.help() 查看可用命令');
        }
        
        // 创建控制台接口
        createConsoleInterface() {
            const self = this;
            
            // 创建简化的控制台接口
            window.sw = {
                // 基本控制
                start: () => self.start(),
                stop: () => self.stop(),
                toggle: () => self.toggle(),
                status: () => self.getStatus(),
                
                // 信息查看
                stats: () => self.getStats(),
                report: () => self.getDetailedReport(),
                media: () => self.getMediaElements(),
                requests: () => self.getNetworkRequests(),
                
                // 实用功能
                clear: () => self.clearLogs(),
                export: () => self.exportData(),
                help: () => self.showHelp(),
                
                // 高级功能
                monitor: (selector) => self.monitorSpecificElements(selector),
                analyze: (url) => self.analyzeUrl(url),
                search: (keyword) => self.searchLogs(keyword)
            };
            
            console.log('🎛️ 控制台接口已创建，使用 sw.命令名() 来操作');
        }
        
        // 显示帮助信息
        showHelp() {
            console.log(`
🎬 StreamWatch Console Commands (v${this.version}) - 命令列表

📊 基本控制 Basic Controls:
  sw.start()        - 开始监控 Start monitoring
  sw.stop()         - 停止监控 Stop monitoring  
  sw.toggle()       - 切换监控状态 Toggle monitoring
  sw.status()       - 查看当前状态 Check current status

📈 信息查看 Information:
  sw.stats()        - 查看统计信息 View statistics
  sw.report()       - 详细报告 Detailed report
  sw.media()        - 媒体元素列表 Media elements list
  sw.requests()     - 网络请求列表 Network requests list

🔧 实用功能 Utilities:
  sw.clear()        - 清除日志 Clear logs
  sw.export()       - 导出数据 Export data
  sw.help()         - 显示帮助 Show this help

🔍 高级功能 Advanced:
  sw.monitor('video') - 监控特定元素 Monitor specific elements
  sw.analyze(url)     - 分析URL Analysis URL
  sw.search('hls')    - 搜索日志 Search logs

📍 作者: ${this.author} | 仓库: ${REPO_URL}
            `);
        }
        
        // 开始监控
        start() {
            if (this.isActive) {
                console.warn('⚠️ 监控已经在运行中！');
                return;
            }
            
            this.isActive = true;
            this.stats.startTime = Date.now();
            console.log('🚀 StreamWatch 监控已启动！');
            this.startPeriodicReport();
        }
        
        // 停止监控
        stop() {
            if (!this.isActive) {
                console.warn('⚠️ 监控尚未启动！');
                return;
            }
            
            this.isActive = false;
            console.log('⏹️ StreamWatch 监控已停止！');
            console.log('📊 最终统计:', this.getStats());
        }
        
        // 切换监控状态
        toggle() {
            if (this.isActive) {
                this.stop();
            } else {
                this.start();
            }
        }
        
        // 获取状态
        getStatus() {
            const status = {
                active: this.isActive,
                version: this.version,
                author: this.author,
                uptime: this.isActive ? Math.floor((Date.now() - this.stats.startTime) / 1000) : 0
            };
            
            console.log('📊 StreamWatch 状态:', status);
            return status;
        }
        
        // 设置事件监听器
        setupEventListeners() {
            // 监控DOM变化
            const observer = new MutationObserver((mutations) => {
                if (!this.isActive) return;
                
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            this.checkForMediaElements(node);
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // 监控媒体事件
            const mediaEvents = [
                'loadstart', 'loadeddata', 'loadedmetadata', 'canplay', 
                'canplaythrough', 'playing', 'pause', 'ended', 'error', 
                'stalled', 'waiting', 'seeking', 'seeked'
            ];
            
            mediaEvents.forEach(event => {
                document.addEventListener(event, (e) => {
                    if (!this.isActive) return;
                    this.handleMediaEvent(e);
                }, true);
            });
        }
        
        // 监控现有媒体元素
        monitorExistingMedia() {
            const mediaSelectors = 'video, audio, source, embed, object';
            document.querySelectorAll(mediaSelectors).forEach(element => {
                this.addMediaElement(element);
            });
        }
        
        // 检查媒体元素
        checkForMediaElements(node) {
            if (node.matches && node.matches('video, audio, source, embed, object')) {
                this.addMediaElement(node);
            }
            
            if (node.querySelectorAll) {
                node.querySelectorAll('video, audio, source, embed, object').forEach(element => {
                    this.addMediaElement(element);
                });
            }
        }
        
        // 添加媒体元素
        addMediaElement(element) {
            if (this.mediaElements.has(element)) return;
            
            this.mediaElements.add(element);
            this.stats.mediaElementsFound++;
            
            const src = element.src || element.currentSrc || element.data || '';
            if (src) {
                this.analyzeMediaUrl(src, element.tagName.toLowerCase());
            }
            
            this.log(`📺 发现媒体元素: ${element.tagName.toLowerCase()} | 源: ${src || '无源地址'}`);
        }
        
        // 处理媒体事件
        handleMediaEvent(event) {
            const element = event.target;
            const eventType = event.type;
            
            switch(eventType) {
                case 'error':
                    this.stats.errors++;
                    this.log(`❌ 媒体错误: ${element.tagName} - ${element.error?.message || '未知错误'}`);
                    break;
                case 'playing':
                    this.log(`▶️ 开始播放: ${element.tagName} - ${element.currentSrc || element.src}`);
                    break;
                case 'loadeddata':
                    this.log(`📥 数据加载: ${element.tagName} - 准备状态: ${element.readyState}`);
                    break;
                case 'loadedmetadata':
                    const duration = element.duration ? `${Math.round(element.duration)}s` : '未知';
                    this.log(`📊 元数据加载: ${element.tagName} - 时长: ${duration}`);
                    break;
                case 'stalled':
                    this.log(`⏸️ 播放卡顿: ${element.tagName}`);
                    break;
                case 'waiting':
                    this.log(`⏳ 缓冲等待: ${element.tagName}`);
                    break;
            }
        }
        
        // 拦截网络请求
        interceptNetworkRequests() {
            const self = this;
            
            // 拦截 fetch
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                if (self.isActive) {
                    self.analyzeNetworkRequest(args[0]);
                }
                return originalFetch.apply(this, args);
            };
            
            // 拦截 XMLHttpRequest
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                if (self.isActive) {
                    self.analyzeNetworkRequest(url);
                }
                return originalOpen.apply(this, [method, url, ...args]);
            };
            
            console.log('🌐 网络请求拦截器已设置');
        }
        
        // 分析网络请求
        analyzeNetworkRequest(url) {
            let requestUrl = url;
            
            if (typeof url !== 'string') {
                if (url instanceof Request) {
                    requestUrl = url.url;
                } else if (url instanceof URL) {
                    requestUrl = url.href;
                } else {
                    return;
                }
            }
            
            if (this.isStreamingUrl(requestUrl)) {
                this.stats.streamRequests++;
                this.log(`🌐 流媒体请求: ${requestUrl}`);
                this.analyzeMediaUrl(requestUrl, 'network');
            }
        }
        
        // 判断是否为流媒体URL
        isStreamingUrl(url) {
            const urlLower = url.toLowerCase();
            
            // 检查文件扩展名和路径
            for (const [format, patterns] of Object.entries(this.streamFormats)) {
                for (const pattern of patterns) {
                    if (urlLower.includes(pattern.toLowerCase())) {
                        return true;
                    }
                }
            }
            
            // 检查常见流媒体关键词
            const streamKeywords = [
                'stream', 'live', 'video', 'audio', 'media', 'playlist',
                'segment', 'chunk', 'fragment', 'manifest'
            ];
            
            return streamKeywords.some(keyword => urlLower.includes(keyword));
        }
        
        // 分析媒体URL
        analyzeMediaUrl(url, type) {
            if (!url) return;
            
            const analysis = {
                url: url,
                type: type,
                format: this.detectFormat(url),
                timestamp: new Date().toISOString(),
                domain: this.extractDomain(url)
            };
            
            this.networkRequests.set(url, analysis);
            
            if (analysis.format !== 'unknown') {
                this.log(`🔍 格式: ${analysis.format.toUpperCase()} | 类型: ${type} | 域名: ${analysis.domain}`);
            }
        }
        
        // 检测媒体格式
        detectFormat(url) {
            const urlLower = url.toLowerCase();
            
            for (const [format, patterns] of Object.entries(this.streamFormats)) {
                for (const pattern of patterns) {
                    if (urlLower.includes(pattern.toLowerCase())) {
                        return format;
                    }
                }
            }
            
            return 'unknown';
        }
        
        // 提取域名
        extractDomain(url) {
            try {
                return new URL(url).hostname;
            } catch {
                return 'unknown';
            }
        }
        
        // 记录日志
        log(message) {
            if (!this.isActive) return;
            
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] ${message}`;
            
            console.log(`%c[StreamWatch] ${message}`, 'color: #00ff88; font-weight: bold;');
        }
        
        // 获取统计信息
        getStats() {
            const uptime = this.isActive ? Math.floor((Date.now() - this.stats.startTime) / 1000) : 0;
            const stats = {
                ...this.stats,
                uptime: uptime,
                formatBreakdown: this.getFormatBreakdown()
            };
            
            console.table(stats);
            return stats;
        }
        
        // 获取格式统计
        getFormatBreakdown() {
            const breakdown = {};
            for (const [url, analysis] of this.networkRequests) {
                breakdown[analysis.format] = (breakdown[analysis.format] || 0) + 1;
            }
            return breakdown;
        }
        
        // 获取媒体元素
        getMediaElements() {
            const elements = Array.from(this.mediaElements).map(el => ({
                tag: el.tagName.toLowerCase(),
                src: el.src || el.currentSrc || el.data || '',
                readyState: el.readyState,
                duration: el.duration || 0,
                paused: el.paused,
                ended: el.ended,
                error: el.error?.message || null
            }));
            
            console.table(elements);
            return elements;
        }
        
        // 获取网络请求
        getNetworkRequests() {
            const requests = Array.from(this.networkRequests.values());
            console.table(requests);
            return requests;
        }
        
        // 获取详细报告
        getDetailedReport() {
            const report = {
                version: this.version,
                author: this.author,
                timestamp: new Date().toISOString(),
                stats: this.getStats(),
                mediaElements: this.getMediaElements(),
                networkRequests: this.getNetworkRequests(),
                formatBreakdown: this.getFormatBreakdown(),
                domainBreakdown: this.getDomainBreakdown()
            };
            
            console.log('📊 StreamWatch 详细报告:', report);
            return report;
        }
        
        // 获取域名统计
        getDomainBreakdown() {
            const breakdown = {};
            for (const [url, analysis] of this.networkRequests) {
                breakdown[analysis.domain] = (breakdown[analysis.domain] || 0) + 1;
            }
            return breakdown;
        }
        
        // 监控特定元素
        monitorSpecificElements(selector) {
            const elements = document.querySelectorAll(selector);
            console.log(`🎯 监控特定元素: ${selector} (找到 ${elements.length} 个)`);
            
            elements.forEach(el => {
                this.addMediaElement(el);
            });
            
            return elements.length;
        }
        
        // 分析URL
        analyzeUrl(url) {
            console.log(`🔍 分析URL: ${url}`);
            
            const analysis = {
                url: url,
                isStreaming: this.isStreamingUrl(url),
                format: this.detectFormat(url),
                domain: this.extractDomain(url)
            };
            
            console.table(analysis);
            return analysis;
        }
        
        // 搜索日志
        searchLogs(keyword) {
            console.log(`🔍 搜索关键词: ${keyword}`);
            // 这里可以扩展为更复杂的日志搜索功能
            const results = Array.from(this.networkRequests.values()).filter(req => 
                req.url.toLowerCase().includes(keyword.toLowerCase()) ||
                req.format.toLowerCase().includes(keyword.toLowerCase())
            );
            
            console.table(results);
            return results;
        }
        
        // 清除日志
        clearLogs() {
            this.networkRequests.clear();
            this.stats.streamRequests = 0;
            console.log('🧹 日志已清除');
        }
        
        // 导出数据
        exportData() {
            const data = this.getDetailedReport();
            const jsonString = JSON.stringify(data, null, 2);
            
            console.log('📤 数据已准备导出:');
            console.log(jsonString);
            
            // 如果支持，可以下载文件
            if (typeof document !== 'undefined') {
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `streamwatch-report-${new Date().toISOString().slice(0,10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                console.log('💾 报告文件已下载');
            }
            
            return data;
        }
        
        // 定期报告
        startPeriodicReport() {
            if (this.reportInterval) {
                clearInterval(this.reportInterval);
            }
            
            this.reportInterval = setInterval(() => {
                if (this.isActive) {
                    const uptime = Math.floor((Date.now() - this.stats.startTime) / 1000);
                    if (uptime % 30 === 0 && uptime > 0) { // 每30秒报告一次
                        console.log(`📊 运行 ${uptime}s | 媒体: ${this.stats.mediaElementsFound} | 请求: ${this.stats.streamRequests} | 错误: ${this.stats.errors}`);
                    }
                }
            }, 1000);
        }
    }
    
    // 初始化StreamWatch控制台
    window.StreamWatchConsole = new StreamWatchConsole();
    
    console.log('🎉 StreamWatch 控制台脚本加载完成！');
    console.log('💡 输入 sw.help() 查看所有可用命令');
    console.log('🚀 输入 sw.start() 开始监控流媒体');
    
})();