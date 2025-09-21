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
            
            // 支持的流媒体格式 - 增强HLS和流媒体检测
            this.streamFormats = {
                hls: ['.m3u8', '/playlist.m3u8', '/index.m3u8', 'master.m3u8', 'playlist', '/live/'],
                dash: ['.mpd', '/manifest.mpd', '/dash/'],
                video: ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.ts'],
                audio: ['.mp3', '.aac', '.ogg', '.wav', '.flac', '.m4a'],
                live: ['live', 'stream', 'rtmp', 'rtsp', 'websocket', 'wss://', '/live/', '/stream/'],
                adaptive: ['m3u8', 'mpd', 'playlist', 'manifest', 'segment', 'chunk']
            };
            
            // HLS特定的错误类型
            this.hlsErrors = {
                NETWORK_ERROR: 'HLS网络错误',
                MEDIA_ERROR: 'HLS媒体错误', 
                KEY_SYSTEM_ERROR: 'HLS密钥系统错误',
                MUX_ERROR: 'HLS复用错误',
                OTHER_ERROR: 'HLS其他错误'
            };
            
            this.init();
        }
        
        init() {
            this.createUI();
            this.setupEventListeners();
            this.monitorExistingMedia();
            this.interceptNetworkRequests();
            this.startPeriodicCheck();
            
            // 当页面加载完成时自动开启监控
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.autoStartMonitoring();
                });
            } else {
                // 页面已经加载完成
                this.autoStartMonitoring();
            }
        }
        
        // 自动开启监控
        autoStartMonitoring() {
            setTimeout(() => {
                if (!this.isActive) {
                    this.toggle();
                    this.log('🎯 页面加载完成，自动开启流媒体监控');
                }
            }, 1000); // 延迟1秒确保页面完全加载
        }
        
        // 创建监控界面
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'streamwatch-panel';
            panel.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 999999;
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.95));
                    color: #00ff88;
                    padding: 20px;
                    border-radius: 12px;
                    font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
                    font-size: 13px;
                    border: 2px solid #00ff88;
                    min-width: 320px;
                    max-height: 500px;
                    overflow-y: auto;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 255, 136, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(0, 255, 136, 0.3); padding-bottom: 10px;">
                        <div style="display: flex; align-items: center;">
                            <span style="font-size: 18px; margin-right: 8px;">🎬</span>
                            <strong style="color: #ffffff; font-size: 14px;">StreamWatch v${STREAMWATCH_VERSION}</strong>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button id="streamwatch-minimize" style="
                                background: rgba(255, 193, 7, 0.8);
                                color: #000;
                                border: none;
                                padding: 4px 8px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 11px;
                                font-weight: bold;
                                transition: all 0.2s ease;
                            ">_</button>
                            <button id="streamwatch-toggle" style="
                                background: linear-gradient(135deg, #00ff88, #00cc6a);
                                color: #000;
                                border: none;
                                padding: 6px 12px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 11px;
                                font-weight: bold;
                                transition: all 0.2s ease;
                                box-shadow: 0 2px 8px rgba(0, 255, 136, 0.3);
                            ">启动监控</button>
                        </div>
                    </div>
                    <div id="streamwatch-content">
                        <div id="streamwatch-stats" style="margin-bottom: 15px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                                <div style="background: rgba(0, 255, 136, 0.1); padding: 8px; border-radius: 6px; text-align: center;">
                                    <div style="color: #00ff88; font-weight: bold; font-size: 16px;" id="media-count">0</div>
                                    <div style="color: #ccc; font-size: 10px;">媒体元素</div>
                                </div>
                                <div style="background: rgba(54, 162, 235, 0.1); padding: 8px; border-radius: 6px; text-align: center;">
                                    <div style="color: #36a2eb; font-weight: bold; font-size: 16px;" id="stream-count">0</div>
                                    <div style="color: #ccc; font-size: 10px;">流媒体请求</div>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <div style="background: rgba(255, 99, 132, 0.1); padding: 8px; border-radius: 6px; text-align: center;">
                                    <div style="color: #ff6384; font-weight: bold; font-size: 16px;" id="error-count">0</div>
                                    <div style="color: #ccc; font-size: 10px;">错误数</div>
                                </div>
                                <div style="background: rgba(255, 206, 86, 0.1); padding: 8px; border-radius: 6px; text-align: center;">
                                    <div style="color: #ffce56; font-weight: bold; font-size: 16px;" id="runtime">0s</div>
                                    <div style="color: #ccc; font-size: 10px;">运行时间</div>
                                </div>
                            </div>
                        </div>
                        <div id="streamwatch-log" style="
                            margin-top: 10px;
                            max-height: 200px;
                            overflow-y: auto;
                            border-top: 1px solid rgba(0, 255, 136, 0.3);
                            padding-top: 10px;
                            font-size: 11px;
                            color: #ccc;
                        "></div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // 添加事件监听
            const toggleBtn = document.getElementById('streamwatch-toggle');
            const minimizeBtn = document.getElementById('streamwatch-minimize');
            const content = document.getElementById('streamwatch-content');
            
            toggleBtn.addEventListener('click', () => this.toggle());
            
            // 最小化功能
            let isMinimized = false;
            minimizeBtn.addEventListener('click', () => {
                isMinimized = !isMinimized;
                content.style.display = isMinimized ? 'none' : 'block';
                minimizeBtn.textContent = isMinimized ? '□' : '_';
                minimizeBtn.style.background = isMinimized ? 'rgba(76, 175, 80, 0.8)' : 'rgba(255, 193, 7, 0.8)';
            });
            
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
            toggleBtn.style.background = this.isActive ? 
                'linear-gradient(135deg, #ff4444, #cc3333)' : 
                'linear-gradient(135deg, #00ff88, #00cc6a)';
            toggleBtn.style.boxShadow = this.isActive ? 
                '0 2px 8px rgba(255, 68, 68, 0.3)' : 
                '0 2px 8px rgba(0, 255, 136, 0.3)';
            
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
            
            // 监控媒体事件 - 增加更多事件类型用于全面监控
            ['loadstart', 'loadeddata', 'loadedmetadata', 'canplay', 'canplaythrough', 
             'playing', 'pause', 'ended', 'error', 'stalled', 'waiting', 'seeking', 
             'seeked', 'ratechange', 'volumechange', 'abort', 'emptied', 'suspend'].forEach(event => {
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
        
        // 处理媒体事件 - 增强错误处理和HLS监控
        handleMediaEvent(event) {
            const element = event.target;
            const eventType = event.type;
            const currentSrc = element.currentSrc || element.src;
            
            try {
                if (eventType === 'error') {
                    this.stats.errors++;
                    let errorMessage = '未知错误';
                    let errorCode = '';
                    
                    if (element.error) {
                        errorCode = element.error.code;
                        switch (element.error.code) {
                            case 1:
                                errorMessage = 'MEDIA_ERR_ABORTED - 媒体加载被中止';
                                break;
                            case 2:
                                errorMessage = 'MEDIA_ERR_NETWORK - 网络错误';
                                break;
                            case 3:
                                errorMessage = 'MEDIA_ERR_DECODE - 解码错误';
                                break;
                            case 4:
                                errorMessage = 'MEDIA_ERR_SRC_NOT_SUPPORTED - 不支持的媒体格式';
                                break;
                            default:
                                errorMessage = element.error.message || '未知错误';
                        }
                    }
                    
                    // 特殊处理HLS错误
                    if (currentSrc && this.isHLSUrl(currentSrc)) {
                        this.handleHLSError(element, errorCode, errorMessage);
                    } else {
                        this.log(`❌ 媒体错误: ${element.tagName} (${errorCode}) - ${errorMessage}`);
                        this.log(`📍 错误源: ${currentSrc}`);
                    }
                    
                } else if (eventType === 'playing') {
                    this.log(`▶️ 开始播放: ${element.tagName} - ${currentSrc}`);
                    if (this.isHLSUrl(currentSrc)) {
                        this.log(`🎯 检测到HLS流播放: ${currentSrc}`);
                    }
                } else if (eventType === 'loadeddata') {
                    this.log(`📥 数据加载完成: ${element.tagName}`);
                    this.analyzeMediaUrl(currentSrc, element.tagName.toLowerCase());
                } else if (eventType === 'stalled') {
                    this.log(`⏸️ 播放停滞: ${element.tagName} - 可能的网络问题`);
                } else if (eventType === 'loadstart') {
                    this.log(`🔄 开始加载: ${element.tagName} - ${currentSrc}`);
                }
                
            } catch (error) {
                console.error('StreamWatch处理媒体事件时出错:', error);
                this.log(`⚠️ 事件处理异常: ${error.message}`);
            }
            
            this.updateStats();
        }
        
        // 检查是否为HLS URL
        isHLSUrl(url) {
            if (!url) return false;
            const urlLower = url.toLowerCase();
            return this.streamFormats.hls.some(pattern => urlLower.includes(pattern));
        }
        
        // 处理HLS特定错误
        handleHLSError(element, errorCode, errorMessage) {
            this.log(`🚨 HLS流错误: ${element.tagName} (${errorCode}) - ${errorMessage}`);
            this.log(`📍 HLS源: ${element.currentSrc || element.src}`);
            
            // 尝试获取更多HLS错误信息
            if (element.error && element.error.data) {
                this.log(`🔍 HLS错误详情: ${JSON.stringify(element.error.data)}`);
            }
            
            // 建议解决方案
            if (errorCode === 2) {
                this.log(`💡 建议: 检查网络连接和HLS服务器状态`);
            } else if (errorCode === 4) {
                this.log(`💡 建议: 浏览器可能不支持此HLS格式，尝试使用hls.js库`);
            }
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
        
        // 记录日志 - 增强UI展示
        log(message) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] ${message}`;
            
            console.log(`%c[StreamWatch] ${message}`, 'color: #00ff88;');
            
            // 添加到UI日志
            const logContainer = document.getElementById('streamwatch-log');
            if (logContainer) {
                const logElement = document.createElement('div');
                logElement.innerHTML = `<span style="color: #666; font-size: 10px;">[${timestamp}]</span> <span style="color: #ccc;">${message}</span>`;
                logElement.style.marginBottom = '4px';
                logElement.style.lineHeight = '1.3';
                logElement.style.fontSize = '11px';
                
                // 根据消息类型设置颜色
                if (message.includes('❌') || message.includes('🚨')) {
                    logElement.style.color = '#ff6384';
                } else if (message.includes('🎯') || message.includes('▶️')) {
                    logElement.style.color = '#00ff88';
                } else if (message.includes('⚠️') || message.includes('⏸️')) {
                    logElement.style.color = '#ffce56';
                } else if (message.includes('🌐') || message.includes('📥')) {
                    logElement.style.color = '#36a2eb';
                }
                
                logContainer.appendChild(logElement);
                
                // 保持最新日志在底部可见
                logContainer.scrollTop = logContainer.scrollHeight;
                
                // 限制日志条数防止内存占用过多
                while (logContainer.children.length > 100) {
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