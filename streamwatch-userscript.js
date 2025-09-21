// ==UserScript==
// @name         StreamWatch - 流媒体监控
// @name:zh-CN   StreamWatch - 流媒体监控  
// @namespace    https://github.com/MissChina/StreamWatch
// @version      1.0.0-2025
// @description  Monitor and detect streaming media loading on web pages
// @description:zh-CN  监控和检测网页中的流媒体加载情况
// @author       MissChina
// @match        *://*/*
// @grant        none
// @license      Custom License - No Commercial Use, Attribution Required
// @homepageURL  https://github.com/MissChina/StreamWatch
// @supportURL   https://github.com/MissChina/StreamWatch/issues
// @updateURL    https://github.com/MissChina/StreamWatch/raw/main/streamwatch-userscript.js
// @downloadURL  https://github.com/MissChina/StreamWatch/raw/main/streamwatch-userscript.js
// ==/UserScript==

/*
 * StreamWatch - 流媒体监控脚本
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
 */

(function() {
    'use strict';
    
    // 版本信息
    const STREAMWATCH_VERSION = '1.0.0-2025';
    const AUTHOR = 'MissChina';
    const REPO_URL = 'https://github.com/MissChina/StreamWatch';
    
    console.log(`%c🎬 StreamWatch v${STREAMWATCH_VERSION} by ${AUTHOR}`, 
                'color: #00ff88; font-size: 14px; font-weight: bold;');
    console.log(`%c📍 Repository: ${REPO_URL}`, 'color: #888;');
    
    // 流媒体监控类
    class StreamWatch {
        constructor() {
            this.isActive = false;
            this.mediaElements = new Set();
            this.networkRequests = new Map();
            this.stats = {
                mediaElementsFound: 0,
                streamRequests: 0,
                errors: 0,
                startTime: Date.now()
            };
            
            // 支持的流媒体格式
            this.streamFormats = {
                hls: ['.m3u8'],
                dash: ['.mpd'],
                video: ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'],
                audio: ['.mp3', '.aac', '.ogg', '.wav', '.flac'],
                live: ['live', 'stream', 'rtmp', 'rtsp']
            };
            
            this.init();
        }
        
        init() {
            this.createUI();
            this.setupEventListeners();
            this.monitorExistingMedia();
            this.interceptNetworkRequests();
            this.startPeriodicCheck();
        }
        
        // 创建监控界面
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'streamwatch-panel';
            panel.innerHTML = `
                <div style="
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    z-index: 999999;
                    background: rgba(0, 0, 0, 0.9);
                    color: #00ff88;
                    padding: 15px;
                    border-radius: 8px;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    border: 2px solid #00ff88;
                    min-width: 280px;
                    max-height: 400px;
                    overflow-y: auto;
                    backdrop-filter: blur(5px);
                ">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                        <strong>🎬 StreamWatch v${STREAMWATCH_VERSION}</strong>
                        <button id="streamwatch-toggle" style="
                            background: #00ff88;
                            color: black;
                            border: none;
                            padding: 5px 10px;
                            border-radius: 4px;
                            cursor: pointer;
                            margin-left: 10px;
                        ">启动监控</button>
                    </div>
                    <div id="streamwatch-stats">
                        <div>📊 媒体元素: <span id="media-count">0</span></div>
                        <div>🌐 流媒体请求: <span id="stream-count">0</span></div>
                        <div>❌ 错误数: <span id="error-count">0</span></div>
                        <div>⏱️ 运行时间: <span id="runtime">0s</span></div>
                    </div>
                    <div id="streamwatch-log" style="
                        margin-top: 10px;
                        max-height: 200px;
                        overflow-y: auto;
                        border-top: 1px solid #00ff88;
                        padding-top: 8px;
                        font-size: 11px;
                    "></div>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // 添加事件监听
            const toggleBtn = document.getElementById('streamwatch-toggle');
            toggleBtn.addEventListener('click', () => this.toggle());
            
            // 使面板可拖拽
            this.makeDraggable(panel.firstElementChild);
        }
        
        // 使界面可拖拽
        makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            element.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
                element.style.right = 'auto';
            }
            
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
        
        // 开启/关闭监控
        toggle() {
            this.isActive = !this.isActive;
            const toggleBtn = document.getElementById('streamwatch-toggle');
            toggleBtn.textContent = this.isActive ? '停止监控' : '启动监控';
            toggleBtn.style.background = this.isActive ? '#ff4444' : '#00ff88';
            
            if (this.isActive) {
                this.log('🚀 开始监控流媒体加载...');
                this.stats.startTime = Date.now();
            } else {
                this.log('⏹️ 监控已停止');
            }
        }
        
        // 设置事件监听器
        setupEventListeners() {
            // 监控新添加的媒体元素
            const observer = new MutationObserver((mutations) => {
                if (!this.isActive) return;
                
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // ELEMENT_NODE
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
            ['loadstart', 'loadeddata', 'canplay', 'playing', 'error', 'stalled'].forEach(event => {
                document.addEventListener(event, (e) => {
                    if (!this.isActive) return;
                    this.handleMediaEvent(e);
                }, true);
            });
        }
        
        // 检查现有媒体元素
        monitorExistingMedia() {
            const mediaSelectors = 'video, audio, source';
            document.querySelectorAll(mediaSelectors).forEach(element => {
                this.addMediaElement(element);
            });
        }
        
        // 检查媒体元素
        checkForMediaElements(node) {
            if (node.matches && node.matches('video, audio, source')) {
                this.addMediaElement(node);
            }
            
            // 检查子元素
            if (node.querySelectorAll) {
                node.querySelectorAll('video, audio, source').forEach(element => {
                    this.addMediaElement(element);
                });
            }
        }
        
        // 添加媒体元素到监控列表
        addMediaElement(element) {
            if (this.mediaElements.has(element)) return;
            
            this.mediaElements.add(element);
            this.stats.mediaElementsFound++;
            this.updateStats();
            
            const src = element.src || element.currentSrc || '';
            if (src) {
                this.analyzeMediaUrl(src, element.tagName.toLowerCase());
            }
            
            this.log(`📺 发现${element.tagName.toLowerCase()}元素: ${src || '无源地址'}`);
        }
        
        // 处理媒体事件
        handleMediaEvent(event) {
            const element = event.target;
            const eventType = event.type;
            
            if (eventType === 'error') {
                this.stats.errors++;
                this.log(`❌ 媒体错误: ${element.tagName} - ${element.error?.message || '未知错误'}`);
            } else if (eventType === 'playing') {
                this.log(`▶️ 开始播放: ${element.tagName} - ${element.currentSrc}`);
            } else if (eventType === 'loadeddata') {
                this.log(`📥 数据加载完成: ${element.tagName}`);
                this.analyzeMediaUrl(element.currentSrc, element.tagName.toLowerCase());
            }
            
            this.updateStats();
        }
        
        // 拦截网络请求
        interceptNetworkRequests() {
            // 拦截 fetch
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                if (this.isActive) {
                    this.analyzeNetworkRequest(args[0]);
                }
                return originalFetch.apply(window, args);
            };
            
            // 拦截 XMLHttpRequest
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                if (window.streamWatch && window.streamWatch.isActive) {
                    window.streamWatch.analyzeNetworkRequest(url);
                }
                return originalOpen.apply(this, [method, url, ...args]);
            };
        }
        
        // 分析网络请求
        analyzeNetworkRequest(url) {
            if (typeof url !== 'string') {
                if (url instanceof Request) {
                    url = url.url;
                } else {
                    return;
                }
            }
            
            if (this.isStreamingUrl(url)) {
                this.stats.streamRequests++;
                this.log(`🌐 检测到流媒体请求: ${url}`);
                this.analyzeMediaUrl(url, 'network');
            }
        }
        
        // 判断是否为流媒体URL
        isStreamingUrl(url) {
            const urlLower = url.toLowerCase();
            
            // 检查文件扩展名
            for (const [format, extensions] of Object.entries(this.streamFormats)) {
                for (const ext of extensions) {
                    if (urlLower.includes(ext)) {
                        return true;
                    }
                }
            }
            
            // 检查常见流媒体关键词
            const streamKeywords = [
                'stream', 'live', 'video', 'audio', 'media',
                'hls', 'dash', 'rtmp', 'rtsp', 'playlist'
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
                timestamp: new Date().toLocaleTimeString()
            };
            
            this.networkRequests.set(url, analysis);
            
            if (analysis.format) {
                this.log(`🔍 格式检测: ${analysis.format.toUpperCase()} - ${type}`);
            }
        }
        
        // 检测媒体格式
        detectFormat(url) {
            const urlLower = url.toLowerCase();
            
            for (const [format, extensions] of Object.entries(this.streamFormats)) {
                for (const ext of extensions) {
                    if (urlLower.includes(ext)) {
                        return format;
                    }
                }
            }
            
            return 'unknown';
        }
        
        // 记录日志
        log(message) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] ${message}`;
            
            console.log(`%c[StreamWatch] ${message}`, 'color: #00ff88;');
            
            // 添加到UI日志
            const logContainer = document.getElementById('streamwatch-log');
            if (logContainer) {
                const logElement = document.createElement('div');
                logElement.textContent = logEntry;
                logElement.style.marginBottom = '2px';
                logContainer.appendChild(logElement);
                
                // 保持最新日志在顶部
                logContainer.scrollTop = logContainer.scrollHeight;
                
                // 限制日志条数
                while (logContainer.children.length > 50) {
                    logContainer.removeChild(logContainer.firstChild);
                }
            }
        }
        
        // 更新统计信息
        updateStats() {
            document.getElementById('media-count').textContent = this.stats.mediaElementsFound;
            document.getElementById('stream-count').textContent = this.stats.streamRequests;
            document.getElementById('error-count').textContent = this.stats.errors;
        }
        
        // 定期检查
        startPeriodicCheck() {
            setInterval(() => {
                if (this.isActive) {
                    const runtime = Math.floor((Date.now() - this.stats.startTime) / 1000);
                    document.getElementById('runtime').textContent = `${runtime}s`;
                    
                    // 定期扫描新的媒体元素
                    this.monitorExistingMedia();
                }
            }, 1000);
        }
        
        // 获取监控报告
        getReport() {
            return {
                version: STREAMWATCH_VERSION,
                author: AUTHOR,
                stats: this.stats,
                mediaElements: Array.from(this.mediaElements).map(el => ({
                    tag: el.tagName,
                    src: el.src || el.currentSrc,
                    duration: el.duration,
                    readyState: el.readyState
                })),
                networkRequests: Array.from(this.networkRequests.entries()),
                timestamp: new Date().toISOString()
            };
        }
    }
    
    // 初始化StreamWatch
    window.streamWatch = new StreamWatch();
    
    // 添加全局控制台命令
    window.streamWatchReport = () => {
        console.log('StreamWatch 监控报告:', window.streamWatch.getReport());
    };
    
    window.streamWatchToggle = () => {
        window.streamWatch.toggle();
    };
    
    console.log('%c💡 可用命令: streamWatchReport() - 查看监控报告, streamWatchToggle() - 切换监控状态', 'color: #888;');
    
})();