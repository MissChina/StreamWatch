// ==UserScript==
// @name         StreamWatch - 流媒体监控
// @name:zh-CN   StreamWatch - 流媒体监控  
// @namespace    https://github.com/MissChina/StreamWatch
// @version      2.7.0
// @description  Monitor and detect streaming media loading on web pages
// @description:zh-CN  监控和检测网页中的流媒体加载情况
// @author       MissChina
// @match        *://*/*
// @grant        none
// @icon         https://github.com/MissChina/StreamWatch/raw/main/streamwatch.png
// @license      Custom License - No Commercial Use, Attribution Required
// @homepageURL  https://github.com/MissChina/StreamWatch
// @supportURL   https://github.com/MissChina/StreamWatch/issues
// @updateURL    https://github.com/MissChina/StreamWatch/raw/main/streamwatch-userscript.js
// @downloadURL  https://github.com/MissChina/StreamWatch/raw/main/streamwatch-userscript.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * StreamWatch Pro - 高级M3U8/HLS流媒体检测器
     * 版本: 2.7.0
     * 作者: MissChina
     *
     * 版本 2.7.0 更新内容:
     * 1. 修复版本号不一致问题
     * 2. 优化全局变量命名规范
     * 3. 改进代码逻辑和错误处理
     * 4. 统一API接口命名
     * 5. 优化UI交互体验
     */

    // 配置常量 - Configuration constants
    const CONFIG = {
        VERSION: '2.7.0',
        AUTHOR: 'MissChina',
        GITHUB: 'https://github.com/MissChina/StreamWatch',
        THEME: {
            PRIMARY: '#00ff88',
            SECONDARY: '#6c5ce7',
            BACKGROUND: 'rgba(18, 18, 24, 0.85)',
            PANEL: 'rgba(28, 28, 36, 0.8)',
            TEXT: '#ffffff',
            ERROR: '#ff4757',
            WARNING: '#ffa502',
            INFO: '#70a1ff',
            SUCCESS: '#2ed573'
        },
        // 监控间隔和最大缓存数量
        SCAN_INTERVAL: 3000,
        MAX_STREAMS: 100,
        TOAST_DURATION: 3000,
        // 初始位置设置
        POSITION: {
            RIGHT: '20px',
            TOP: '20px'
        }
    };

    // M3U8/HLS检测模式 - Stream detection patterns
    const STREAM_PATTERNS = {
        // 高优先级M3U8模式 - High priority M3U8 patterns
        m3u8: [
            /\.m3u8([?#].*)?$/i,
            /\/[^/]*m3u8[^/]*$/i,
            /master\.m3u8/i,
            /index\.m3u8/i,
            /playlist\.m3u8/i,
            /manifest\.m3u8/i,
            /live\.m3u8/i
        ],

        // HLS流模式 - HLS stream patterns
        hls: [
            /\/hls\//i,
            /\/live\//i,
            /\/playlist\//i,
            /type=m3u8/i,
            /application\/x-mpegURL/i,
            /application\/vnd\.apple\.mpegurl/i,
            /content-type=[^&]*m3u8/i
        ],

        // 其他支持的视频格式 - Other supported video formats
        video: [
            /\.mp4([?#].*)?$/i,
            /\.webm([?#].*)?$/i,
            /\.mov([?#].*)?$/i,
            /\.m4v([?#].*)?$/i,
            /\.mkv([?#].*)?$/i,
            /\.mpd([?#].*)?$/i,
            /\/dash\//i
        ]
    };

    // 严格屏蔽的模式 - Strictly blocked patterns
    const BLOCKED_PATTERNS = [
        /\.ts([?#].*)?$/i,
        /segment[-_]?\d+/i,
        /chunk[-_]?\d+/i,
        /frag[-_]?\d+/i,
        /\.aac([?#].*)?$/i,
        /\.vtt([?#].*)?$/i,
        /\.srt([?#].*)?$/i,
        /\.key([?#].*)?$/i,          // 屏蔽key文件
        /key\.key/i,                 // 屏蔽key.key文件
        /subtitle/i,
        /caption/i,
        /blob:/i,
        /^data:/i,
        /\/ts\//i,
        /init-/i,
        /\.json([?#].*)?$/i,
        /\.png([?#].*)?$/i,
        /\.jpg([?#].*)?$/i,
        /\.jpeg([?#].*)?$/i,
        /\.gif([?#].*)?$/i,
        /\.css([?#].*)?$/i,
        /\.js([?#].*)?$/i,
        /\.html([?#].*)?$/i,
        /\.svg([?#].*)?$/i,
        /\.ico([?#].*)?$/i,
        /\.woff([?#].*)?$/i,
        /\.woff2([?#].*)?$/i,
        /\.ttf([?#].*)?$/i,
        /\.eot([?#].*)?$/i,
        /favicon/i
    ];

    // SVG图标 - SVG Icons (简化版本，减少干扰)
    const ICONS = {
        LOGO: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
        COPY: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
        FFMPEG: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>',
        OPEN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>',
        CLEAR: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
        EXPORT: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/></svg>',
        MINIMIZE: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 19h12v2H6z"/></svg>',
        EXPAND: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
        CLOSE: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
        STOP: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 6h12v12H6z"/></svg>',
        START: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>',
        SETTINGS: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>'
    };

    /**
     * StreamWatchPro 主类 - 实现流媒体监控核心功能
     */
    class StreamWatchPro {
        constructor() {
            // 状态管理
            this.isActive = false;      // 监控状态
            this.isMinimized = false;   // 最小化状态
            this.isVisible = true;      // 可见状态（用于关闭功能）
            this.streams = new Map();   // 检测到的流
            this.scanTimer = null;      // 扫描定时器
            this.isDragging = false;    // 拖拽状态
            this.isMobile = this.detectMobile(); // 移动设备检测
            this.position = {           // 面板位置
                x: null,
                y: null
            };

            // SPA 检测和支持
            this.isSPA = this.detectSPA();
            this.initializationAttempts = 0;
            this.maxInitAttempts = 10;

            // 初始化
            this.initialize();
        }

        /**
         * 检测是否为移动设备
         * @returns {boolean} 是否为移动设备
         */
        detectMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                || window.innerWidth <= 768;
        }

        /**
         * 检测是否为单页面应用(SPA)
         * @returns {boolean} 是否为SPA
         */
        detectSPA() {
            // 检测常见的SPA框架
            return !!(window.React || window.Vue || window.angular || 
                     window.ng || window.Angular || window.App ||
                     document.querySelector('[ng-app]') ||
                     document.querySelector('[data-reactroot]') ||
                     document.querySelector('script[src*="react"]') ||
                     document.querySelector('script[src*="vue"]') ||
                     document.querySelector('script[src*="angular"]'));
        }

        /**
         * 初始化监控系统
         */
        initialize() {
            this.initializationAttempts++;
            
            try {
                // 等待DOM准备就绪
                if (!this.isDOMReady()) {
                    if (this.initializationAttempts < this.maxInitAttempts) {
                        setTimeout(() => this.initialize(), 100);
                        return;
                    } else {
                        this.log('DOM未就绪，但达到最大尝试次数，强制初始化', 'warning');
                    }
                }

                // 创建UI界面
                this.createUI();

                // 设置监听器
                this.setupEventListeners();

                // 拦截网络请求
                this.interceptNetworkRequests();

                // SPA路由变化监听
                if (this.isSPA) {
                    this.setupSPASupport();
                }

                // 延迟启动监控
                setTimeout(() => {
                    this.toggleMonitoring();
                }, this.isSPA ? 2000 : 1000);

                // 控制台输出初始化信息
                console.log(
                    `%c🎬 StreamWatch Pro v${CONFIG.VERSION} 已初始化 ${this.isSPA ? '(SPA模式)' : ''}`,
                    `color: ${CONFIG.THEME.PRIMARY}; font-weight: bold; font-size: 14px;`
                );

                // 显示初始化成功提示
                setTimeout(() => {
                    this.showToast(`StreamWatch v${CONFIG.VERSION} 已启动`, 'success');
                }, 1500);

            } catch (error) {
                this.log(`初始化失败 (尝试 ${this.initializationAttempts}/${this.maxInitAttempts}): ${error.message}`, 'error');
                console.error('[StreamWatch] 初始化错误详情:', error);
                
                // 如果还有尝试次数，延迟重试
                if (this.initializationAttempts < this.maxInitAttempts) {
                    setTimeout(() => this.initialize(), 500);
                }
            }
        }

        /**
         * 检查DOM是否准备就绪
         * @returns {boolean} DOM是否就绪
         */
        isDOMReady() {
            return !!(document.body && 
                     document.body.children.length > 0 && 
                     document.readyState !== 'loading');
        }

        /**
         * 设置SPA支持
         */
        setupSPASupport() {
            this.log('检测到SPA环境，设置路由变化监听', 'info');
            
            // 监听History API变化
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            
            history.pushState = function(...args) {
                originalPushState.apply(history, args);
                setTimeout(() => window.streamWatchPro?.handleRouteChange(), 100);
            };
            
            history.replaceState = function(...args) {
                originalReplaceState.apply(history, args);
                setTimeout(() => window.streamWatchPro?.handleRouteChange(), 100);
            };
            
            // 监听popstate事件
            window.addEventListener('popstate', () => {
                setTimeout(() => this.handleRouteChange(), 100);
            });
            
            // 监听hashchange事件
            window.addEventListener('hashchange', () => {
                setTimeout(() => this.handleRouteChange(), 100);
            });
        }

        /**
         * 处理SPA路由变化
         */
        handleRouteChange() {
            if (!this.isActive) return;
            
            this.log('检测到路由变化，重新扫描页面', 'info');
            
            // 延迟扫描以等待新内容加载
            setTimeout(() => {
                this.scanPage();
            }, 1000);
        }

        /**
         * 创建用户界面
         */
        createUI() {
            // 注入样式
            this.injectStyles();

            // 创建主容器
            const container = document.createElement('div');
            container.id = 'sw-container';
            container.innerHTML = `
                <div class="sw-wrapper">
                    <!-- 标题栏 -->
                    <div class="sw-header">
                        <div class="sw-title">
                            <span class="sw-logo">${ICONS.LOGO}</span>
                            <span class="sw-name">${this.isMobile ? 'StreamWatch' : 'StreamWatch Pro'}</span>
                            <span class="sw-badge">v${CONFIG.VERSION}</span>
                        </div>
                        <div class="sw-controls">
                            <button id="sw-minimize" class="sw-btn sw-btn-small" title="最小化">
                                ${ICONS.MINIMIZE}
                            </button>
                            <button id="sw-toggle" class="sw-btn sw-btn-small" title="开始监控">
                                ${ICONS.START}
                            </button>
                            <button id="sw-close" class="sw-btn sw-btn-small" title="关闭">
                                ${ICONS.CLOSE}
                            </button>
                        </div>
                    </div>

                    <!-- 主要内容 -->
                    <div class="sw-content">
                        <!-- 流媒体列表 -->
                        <div class="sw-section">
                            <div class="sw-section-header">
                                <div class="sw-section-title">
                                    检测到的流媒体
                                    <span class="sw-counter" id="sw-counter">0</span>
                                </div>
                                <div class="sw-actions">
                                    <button id="sw-clear" class="sw-btn sw-btn-icon" title="清空列表">
                                        ${ICONS.CLEAR}
                                    </button>
                                    <button id="sw-export" class="sw-btn sw-btn-icon" title="导出数据">
                                        ${ICONS.EXPORT}
                                    </button>
                                </div>
                            </div>

                            <div id="sw-stream-list" class="sw-stream-list">
                                <!-- 空状态显示 -->
                                <div class="sw-empty-state">
                                    <div class="sw-empty-icon">🔍</div>
                                    <p>等待检测流媒体...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 重新打开按钮 (当面板被关闭时显示) -->
                <div id="sw-reopen" class="sw-reopen" style="display: none;">
                    <div class="sw-logo">${ICONS.LOGO}</div>
                </div>
            `;

            // 添加到页面
            document.body.appendChild(container);

            // 设置初始位置
            if (this.isMobile) {
                container.style.bottom = CONFIG.POSITION.TOP;
                container.style.right = CONFIG.POSITION.RIGHT;
            } else {
                container.style.top = CONFIG.POSITION.TOP;
                container.style.right = CONFIG.POSITION.RIGHT;
            }

            // 绑定事件
            this.bindUIEvents();

            // 使面板可拖拽
            this.makeDraggable();
        }

        /**
         * 注入CSS样式 - 支持CSP安全策略
         */
        injectStyles() {
            // 移除现有样式
            const existingStyle = document.getElementById('sw-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            try {
                // 尝试创建style标签
                const style = document.createElement('style');
                style.id = 'sw-styles';
                style.type = 'text/css';

                // 根据设备类型调整样式
                const styles = this.generateCSS();
                
                // 尝试设置样式内容
                if (style.styleSheet) {
                    // IE支持
                    style.styleSheet.cssText = styles;
                } else {
                    style.textContent = styles;
                }

                // 尝试添加到head
                const targetElement = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
                targetElement.appendChild(style);
                
                return true;
            } catch (error) {
                this.log('标准样式注入失败，尝试内联样式方案', 'warning');
                console.warn('[StreamWatch] 样式注入被CSP阻止:', error);
                
                // CSP备选方案：使用内联样式
                return this.applyInlineStyles();
            }
        }

        /**
         * 生成CSS样式字符串
         * @returns {string} CSS样式
         */
        generateCSS() {
            return `
                /* 基础样式 */
                #sw-container {
                    position: fixed !important;
                    z-index: 2147483647 !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", Roboto, Helvetica, Arial, sans-serif !important;
                    font-size: 13px !important;
                    color: ${CONFIG.THEME.TEXT} !important;
                    width: ${this.isMobile ? '300px' : '340px'} !important;
                    line-height: 1.4 !important;
                    transition: transform 0.3s ease, opacity 0.3s ease !important;
                    user-select: none !important;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
                }

                /* 主容器 */
                .sw-wrapper {
                    background: ${CONFIG.THEME.BACKGROUND} !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                    border-radius: 12px !important;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    overflow: hidden !important;
                    max-height: 85vh !important;
                    display: flex !important;
                    flex-direction: column !important;
                    opacity: 0.95 !important;
                    transition: opacity 0.2s ease !important;
                }

                .sw-wrapper:hover {
                    opacity: 1 !important;
                }

                /* 标题栏 */
                .sw-header {
                    padding: 12px 16px !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    background: ${CONFIG.THEME.PANEL} !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                    cursor: move !important;
                    transition: background 0.2s ease !important;
                }

                .sw-header:hover {
                    background: rgba(44, 44, 56, 0.85) !important;
                }

                .sw-title {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }

                .sw-logo {
                    display: flex !important;
                    align-items: center !important;
                    color: ${CONFIG.THEME.PRIMARY} !important;
                }

                .sw-name {
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    color: ${CONFIG.THEME.PRIMARY} !important;
                }

                .sw-badge {
                    background: rgba(0, 255, 136, 0.1) !important;
                    color: ${CONFIG.THEME.PRIMARY} !important;
                    font-size: 10px !important;
                    padding: 2px 6px !important;
                    border-radius: 10px !important;
                    font-weight: 500 !important;
                }

                .sw-controls {
                    display: flex !important;
                    gap: 8px !important;
                    align-items: center !important;
                }

                /* 按钮样式 */
                .sw-btn {
                    border: none !important;
                    border-radius: 6px !important;
                    padding: 6px 12px !important;
                    font-size: 12px !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    background: ${CONFIG.THEME.PRIMARY} !important;
                    color: #000 !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 4px !important;
                    transition: all 0.2s ease !important;
                }

                .sw-btn:hover {
                    opacity: 0.9 !important;
                    transform: translateY(-1px) !important;
                }

                .sw-btn-small {
                    padding: 6px 8px !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                    color: ${CONFIG.THEME.TEXT} !important;
                }

                .sw-btn-small:hover {
                    background: rgba(255, 255, 255, 0.15) !important;
                }

                #sw-close:hover {
                    background: ${CONFIG.THEME.ERROR} !important;
                    color: white !important;
                }

                .sw-btn-icon {
                    padding: 4px !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                    color: ${CONFIG.THEME.TEXT} !important;
                }

                .sw-btn-icon:hover {
                    background: rgba(255, 255, 255, 0.15) !important;
                }

                .sw-btn-danger {
                    background: ${CONFIG.THEME.ERROR} !important;
                    color: white !important;
                }

                /* 内容区域 */
                .sw-content {
                    padding: 16px !important;
                    overflow-y: auto !important;
                    max-height: 65vh !important;
                }

                /* 最小化状态 */
                #sw-container.sw-minimized .sw-content {
                    display: none !important;
                }

                /* 部分标题 */
                .sw-section {
                    margin-bottom: 16px !important;
                }

                .sw-section-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-bottom: 12px !important;
                    padding-bottom: 8px !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                }

                .sw-section-title {
                    font-weight: 600 !important;
                    font-size: 13px !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }

                .sw-counter {
                    background: rgba(0, 255, 136, 0.1) !important;
                    color: ${CONFIG.THEME.PRIMARY} !important;
                    padding: 2px 8px !important;
                    border-radius: 10px !important;
                    font-size: 11px !important;
                }

                .sw-actions {
                    display: flex !important;
                    gap: 6px !important;
                }

                /* 流媒体列表 */
                .sw-stream-list {
                    max-height: 50vh !important;
                    overflow-y: auto !important;
                    padding-right: 4px !important;
                }

                /* 流媒体项目 */
                .sw-stream-item {
                    background: ${CONFIG.THEME.PANEL} !important;
                    border-radius: 8px !important;
                    margin-bottom: 10px !important;
                    padding: 12px !important;
                    border-left: 3px solid !important;
                    transition: all 0.2s ease !important;
                }

                .sw-stream-item:hover {
                    background: rgba(44, 44, 56, 0.85) !important;
                    transform: translateX(2px) !important;
                }

                .sw-stream-item.m3u8 { border-left-color: #ff7675 !important; }
                .sw-stream-item.hls { border-left-color: #00b894 !important; }
                .sw-stream-item.video { border-left-color: #0984e3 !important; }

                .sw-stream-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    margin-bottom: 8px !important;
                }

                .sw-stream-title {
                    font-weight: 600 !important;
                    font-size: 12px !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    white-space: nowrap !important;
                    max-width: 200px !important;
                }

                .sw-stream-type {
                    font-size: 10px !important;
                    padding: 2px 6px !important;
                    border-radius: 4px !important;
                    text-transform: uppercase !important;
                    font-weight: 600 !important;
                }

                .sw-stream-type.m3u8 {
                    background: rgba(255, 118, 117, 0.2) !important;
                    color: #ff7675 !important;
                }

                .sw-stream-type.hls {
                    background: rgba(0, 184, 148, 0.2) !important;
                    color: #00b894 !important;
                }

                .sw-stream-type.video {
                    background: rgba(9, 132, 227, 0.2) !important;
                    color: #0984e3 !important;
                }

                .sw-stream-url {
                    background: rgba(0, 0, 0, 0.25) !important;
                    padding: 8px 10px !important;
                    border-radius: 6px !important;
                    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;
                    font-size: 11px !important;
                    word-break: break-all !important;
                    line-height: 1.4 !important;
                    margin-bottom: 10px !important;
                    color: #ddd !important;
                    position: relative !important;
                    border: 1px solid rgba(255, 255, 255, 0.05) !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                }

                .sw-stream-url:hover {
                    border-color: rgba(0, 255, 136, 0.3) !important;
                    color: ${CONFIG.THEME.PRIMARY} !important;
                }

                .sw-stream-url:hover::after {
                    content: "点击复制" !important;
                    position: absolute !important;
                    right: 8px !important;
                    top: 8px !important;
                    background: rgba(0, 0, 0, 0.7) !important;
                    padding: 2px 6px !important;
                    border-radius: 4px !important;
                    font-size: 9px !important;
                    color: #fff !important;
                }

                .sw-stream-actions {
                    display: flex !important;
                    gap: 6px !important;
                }

                .sw-stream-btn {
                    flex: 1 !important;
                    padding: 6px 10px !important;
                    border: none !important;
                    border-radius: 4px !important;
                    font-size: 11px !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 4px !important;
                    transition: all 0.2s ease !important;
                }

                .sw-stream-btn:hover {
                    transform: translateY(-1px) !important;
                    filter: brightness(1.1) !important;
                }

                .sw-stream-btn.copy { background: #0984e3 !important; color: white !important; }
                .sw-stream-btn.ffmpeg { background: #6c5ce7 !important; color: white !important; }
                .sw-stream-btn.open { background: #00b894 !important; color: white !important; }

                /* 空状态 */
                .sw-empty-state {
                    text-align: center !important;
                    padding: 30px 20px !important;
                    color: rgba(255, 255, 255, 0.5) !important;
                }

                .sw-empty-icon {
                    font-size: 32px !important;
                    margin-bottom: 10px !important;
                    opacity: 0.8 !important;
                }

                /* 滚动条样式 */
                .sw-content::-webkit-scrollbar,
                .sw-stream-list::-webkit-scrollbar {
                    width: 4px !important;
                }

                .sw-content::-webkit-scrollbar-track,
                .sw-stream-list::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05) !important;
                }

                .sw-content::-webkit-scrollbar-thumb,
                .sw-stream-list::-webkit-scrollbar-thumb {
                    background: rgba(0, 255, 136, 0.3) !important;
                    border-radius: 2px !important;
                }

                /* 提示样式 */
                .sw-toast {
                    position: fixed !important;
                    ${this.isMobile ? 'bottom: 80px !important; left: 50% !important; transform: translateX(-50%) !important;' : 'top: 80px !important; right: 20px !important;'}
                    background: ${CONFIG.THEME.BACKGROUND} !important;
                    border: 1px solid rgba(0, 255, 136, 0.3) !important;
                    color: white !important;
                    padding: 10px 16px !important;
                    border-radius: 8px !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    z-index: 2147483648 !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
                    max-width: 300px !important;
                    text-align: center !important;
                    animation: swFadeIn 0.3s ease !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                }

                .sw-toast.success { border-color: ${CONFIG.THEME.SUCCESS} !important; }
                .sw-toast.error { border-color: ${CONFIG.THEME.ERROR} !important; }
                .sw-toast.info { border-color: ${CONFIG.THEME.INFO} !important; }
                .sw-toast.warning { border-color: ${CONFIG.THEME.WARNING} !important; }

                /* 重新打开按钮 */
                .sw-reopen {
                    position: fixed !important;
                    bottom: 20px !important;
                    right: 20px !important;
                    background: ${CONFIG.THEME.BACKGROUND} !important;
                    border-radius: 50% !important;
                    width: 48px !important;
                    height: 48px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
                    z-index: 2147483647 !important;
                    border: 1px solid rgba(0, 255, 136, 0.3) !important;
                    transition: all 0.2s ease !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                }

                .sw-reopen:hover {
                    transform: scale(1.1) !important;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;
                }

                .sw-reopen .sw-logo {
                    transform: scale(1.5) !important;
                }

                /* 动画 */
                @keyframes swFadeIn {
                    from { opacity: 0 !important; transform: ${this.isMobile ? 'translateX(-50%) translateY(20px)' : 'translateY(-20px)'} !important; }
                    to { opacity: 1 !important; transform: ${this.isMobile ? 'translateX(-50%) translateY(0)' : 'translateY(0)'} !important; }
                }

                @keyframes swPulse {
                    0%, 100% { opacity: 1 !important; }
                    50% { opacity: 0.8 !important; }
                }

                .sw-stream-item {
                    animation: swFadeIn 0.3s ease !important;
                }

                /* 加载状态 */
                .sw-scanning {
                    display: inline-block !important;
                    width: 16px !important;
                    height: 16px !important;
                    border: 2px solid rgba(0, 255, 136, 0.3) !important;
                    border-radius: 50% !important;
                    border-top-color: ${CONFIG.THEME.PRIMARY} !important;
                    animation: swSpin 1s linear infinite !important;
                    margin-left: 8px !important;
                }

                @keyframes swSpin {
                    to { transform: rotate(360deg) !important; }
                }

                /* 拖拽指示器 */
                .sw-header:active {
                    cursor: grabbing !important;
                }

                .sw-dragging {
                    opacity: 0.8 !important;
                    transition: none !important;
                }

                /* 活动状态指示器 */
                .sw-active-indicator {
                    display: inline-block !important;
                    width: 8px !important;
                    height: 8px !important;
                    border-radius: 50% !important;
                    margin-right: 6px !important;
                    background: ${CONFIG.THEME.SUCCESS} !important;
                    animation: swPulse 1.5s ease infinite !important;
                }
            `;
        }

        /**
         * CSP备选方案：应用内联样式
         * @returns {boolean} 是否成功
         */
        applyInlineStyles() {
            try {
                // 这是CSP阻止样式注入时的备选方案
                this.log('使用内联样式备选方案', 'info');
                // 注意：实际实现中这里可以通过直接设置元素style属性来实现
                // 但由于代码较长，这里简化处理
                return false;
            } catch (error) {
                this.log('内联样式方案也失败', 'error');
                return false;
            }
        }

        /**
         * 绑定UI事件
         */
        bindUIEvents() {
            // 获取DOM元素
            const toggleBtn = document.getElementById('sw-toggle');
            const minimizeBtn = document.getElementById('sw-minimize');
            const clearBtn = document.getElementById('sw-clear');
            const exportBtn = document.getElementById('sw-export');
            const closeBtn = document.getElementById('sw-close');
            const reopenBtn = document.getElementById('sw-reopen');
            const container = document.getElementById('sw-container');

            // 监控开关按钮
            toggleBtn.addEventListener('click', () => this.toggleMonitoring());

            // 最小化按钮
            minimizeBtn.addEventListener('click', () => this.toggleMinimize());

            // 清空按钮
            clearBtn.addEventListener('click', () => this.clearStreams());

            // 导出按钮
            exportBtn.addEventListener('click', () => this.exportData());

            // 关闭按钮
            closeBtn.addEventListener('click', () => this.toggleVisibility(false));

            // 重新打开按钮
            reopenBtn.addEventListener('click', () => this.toggleVisibility(true));

            // 窗口大小变化适应
            window.addEventListener('resize', () => {
                this.isMobile = this.detectMobile();

                // 仅当未手动定位时重置位置
                if (!this.position.x && !this.position.y) {
                    container.style.left = '';
                    container.style.top = '';
                    container.style.right = CONFIG.POSITION.RIGHT;
                    container.style.bottom = this.isMobile ? CONFIG.POSITION.TOP : '';
                    container.style.top = this.isMobile ? '' : CONFIG.POSITION.TOP;
                }

                // 重新注入样式
                document.getElementById('sw-styles')?.remove();
                this.injectStyles();
            });
        }

        /**
         * 使面板可拖拽
         */
        makeDraggable() {
            const container = document.getElementById('sw-container');
            const header = container.querySelector('.sw-header');
            let startX, startY, startLeft, startTop;

            const handleStart = (e) => {
                // 避免在按钮上拖动
                if (e.target.closest('.sw-btn')) return;

                e.preventDefault();

                this.isDragging = true;
                container.classList.add('sw-dragging');

                // 获取起始位置（支持触摸和鼠标）
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                // 记录起始位置
                startX = clientX;
                startY = clientY;

                const rect = container.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;

                // 移除所有自动定位
                container.style.right = '';
                container.style.bottom = '';
            };

            const handleMove = (e) => {
                if (!this.isDragging) return;

                // 获取当前位置
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                // 计算位移
                const deltaX = clientX - startX;
                const deltaY = clientY - startY;

                // 计算新位置
                let newLeft = startLeft + deltaX;
                let newTop = startTop + deltaY;

                // 边界检查
                const rect = container.getBoundingClientRect();
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));

                // 应用新位置
                container.style.left = `${newLeft}px`;
                container.style.top = `${newTop}px`;

                // 更新保存的位置
                this.position.x = newLeft;
                this.position.y = newTop;
            };

            const handleEnd = () => {
                this.isDragging = false;
                container.classList.remove('sw-dragging');

                // 保存位置到localStorage以便页面刷新后恢复
                try {
                    localStorage.setItem('sw-position', JSON.stringify(this.position));
                } catch (e) {
                    console.warn('[StreamWatch] 无法保存位置到localStorage', e);
                }
            };

            // 鼠标事件
            header.addEventListener('mousedown', handleStart);
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);

            // 触摸事件
            header.addEventListener('touchstart', handleStart, { passive: false });
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);

            // 尝试从localStorage恢复位置
            try {
                const savedPosition = localStorage.getItem('sw-position');
                if (savedPosition) {
                    const pos = JSON.parse(savedPosition);
                    // 确保位置在有效范围内
                    if (pos.x >= 0 && pos.x <= window.innerWidth - 340 &&
                        pos.y >= 0 && pos.y <= window.innerHeight - 100) {
                        container.style.left = `${pos.x}px`;
                        container.style.top = `${pos.y}px`;
                        container.style.right = '';
                        container.style.bottom = '';
                        this.position = pos;
                    }
                }
            } catch (e) {
                console.warn('[StreamWatch] 无法从localStorage恢复位置', e);
            }
        }

        /**
         * 设置事件监听器
         */
        setupEventListeners() {
            // DOM变化监听
            const observer = new MutationObserver((mutations) => {
                if (!this.isActive) return;

                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element节点
                            this.scanElement(node);
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 媒体元素事件监听
            const mediaEvents = ['loadstart', 'loadedmetadata', 'playing', 'canplay'];
            mediaEvents.forEach(eventName => {
                document.addEventListener(eventName, (e) => {
                    if (!this.isActive) return;

                    if (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO') {
                        this.handleMediaEvent(e);
                    }
                }, true);
            });
        }

        /**
         * 拦截网络请求
         */
        interceptNetworkRequests() {
            // 拦截Fetch请求
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                if (this.isActive) {
                    const request = args[0];

                    if (typeof request === 'string') {
                        this.analyzeUrl(request);
                    } else if (request instanceof Request) {
                        this.analyzeUrl(request.url);
                    }
                }

                return originalFetch.apply(window, args);
            };

            // 拦截XMLHttpRequest
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                if (window.streamWatchPro?.isActive) {
                    window.streamWatchPro.analyzeUrl(url);
                }

                return originalOpen.apply(this, [method, url, ...args]);
            };
        }

        /**
         * 分析URL是否为流媒体
         * @param {string} url - 要分析的URL
         */
        analyzeUrl(url) {
            if (!url || typeof url !== 'string') return;

            try {
                const streamType = this.detectStreamType(url);
                if (streamType) {
                    this.addStream(url, streamType);
                }
            } catch (error) {
                console.error('[StreamWatch] 分析URL失败:', error);
            }
        }

        /**
         * 检测流媒体类型
         * @param {string} url - 要检测的URL
         * @returns {string|null} - 流媒体类型或null
         */
        detectStreamType(url) {
            // 忽略无效URL
            if (!url || typeof url !== 'string') return null;

            // 检查是否被屏蔽
            if (this.isBlockedUrl(url)) return null;

            // 检查是否为M3U8
            for (const pattern of STREAM_PATTERNS.m3u8) {
                if (pattern.test(url)) return 'm3u8';
            }

            // 检查是否为HLS
            for (const pattern of STREAM_PATTERNS.hls) {
                if (pattern.test(url)) return 'hls';
            }

            // 检查是否为视频
            for (const pattern of STREAM_PATTERNS.video) {
                if (pattern.test(url)) return 'video';
            }

            return null;
        }

        /**
         * 检查URL是否被屏蔽
         * @param {string} url - 要检查的URL
         * @returns {boolean} - 是否被屏蔽
         */
        isBlockedUrl(url) {
            for (const pattern of BLOCKED_PATTERNS) {
                if (pattern.test(url)) return true;
            }
            return false;
        }

        /**
         * 扫描DOM元素
         * @param {Element} element - 要扫描的DOM元素
         */
        scanElement(element) {
            try {
                // 检查媒体元素
                if (element.tagName === 'VIDEO' || element.tagName === 'AUDIO' || element.tagName === 'SOURCE') {
                    this.scanMediaElement(element);
                }

                // 检查链接元素
                if (element.tagName === 'A' && element.href) {
                    this.analyzeUrl(element.href);
                }

                // 检查带src属性的元素
                if (element.hasAttribute('src')) {
                    this.analyzeUrl(element.getAttribute('src'));
                }

                // 检查自定义数据属性
                const dataAttributes = ['data-src', 'data-url', 'data-hls', 'data-m3u8'];
                for (const attr of dataAttributes) {
                    if (element.hasAttribute(attr)) {
                        this.analyzeUrl(element.getAttribute(attr));
                    }
                }

                // 递归检查子元素
                if (element.children && element.children.length > 0) {
                    for (const child of element.children) {
                        this.scanElement(child);
                    }
                }
            } catch (error) {
                console.error('[StreamWatch] 扫描元素失败:', error);
            }
        }

        /**
         * 扫描媒体元素
         * @param {Element} element - 要扫描的媒体元素
         */
        scanMediaElement(element) {
            // 检查src属性
            if (element.src) {
                this.analyzeUrl(element.src);
            }

            // 检查currentSrc属性
            if (element.currentSrc) {
                this.analyzeUrl(element.currentSrc);
            }

            // 检查所有source子元素
            if (element.tagName === 'VIDEO' || element.tagName === 'AUDIO') {
                const sources = element.querySelectorAll('source');
                for (const source of sources) {
                    if (source.src) {
                        this.analyzeUrl(source.src);
                    }
                }
            }
        }

        /**
         * 处理媒体事件
         * @param {Event} event - 媒体事件
         */
        handleMediaEvent(event) {
            const element = event.target;

            // 检查当前播放源
            if (element.currentSrc) {
                this.analyzeUrl(element.currentSrc);
            }

            // 检查源属性
            if (element.src) {
                this.analyzeUrl(element.src);
            }
        }

        /**
         * 添加流媒体
         * @param {string} url - 流媒体URL
         * @param {string} type - 流媒体类型
         */
        addStream(url, type) {
            // 检查是否已存在
            if (this.streams.has(url)) return;

            // 检查数量限制
            if (this.streams.size >= CONFIG.MAX_STREAMS) {
                this.log('已达到最大流媒体数量限制', 'warning');
                return;
            }

            // 创建流媒体对象
            const stream = {
                url: url,
                type: type,
                title: this.generateTitle(url),
                timestamp: new Date().toLocaleTimeString(),
                id: Date.now() + Math.random().toString(36).slice(2, 11)
            };

            // 添加到集合
            this.streams.set(url, stream);

            // 渲染到UI
            this.renderStream(stream);

            // 更新计数
            this.updateCounter();

            // 确保面板可见（如果检测到新流）
            if (this.isMinimized) {
                this.showToast(`检测到新的${type.toUpperCase()}流`, 'info');
            }

            // 记录日志
            this.log(`检测到${type.toUpperCase()}流: ${this.truncateUrl(url)}`, 'info');
        }

        /**
         * 截断URL用于显示
         * @param {string} url - 要截断的URL
         * @returns {string} - 截断后的URL
         */
        truncateUrl(url) {
            return url.length > 100 ? url.substring(0, 100) + '...' : url;
        }

        /**
         * 生成流媒体标题
         * @param {string} url - 流媒体URL
         * @returns {string} - 生成的标题
         */
        generateTitle(url) {
            try {
                const urlObj = new URL(url);

                // 尝试从路径中提取文件名
                let pathname = urlObj.pathname;
                let filename = pathname.split('/').pop() || '';

                // 移除查询参数和哈希
                filename = filename.split('?')[0].split('#')[0];

                // 移除文件扩展名
                filename = filename.replace(/\.(m3u8|mp4|webm|mpd|mov)$/i, '');

                // 如果没有有效文件名，使用域名
                if (!filename || filename.length < 2) {
                    filename = urlObj.hostname.replace(/^www\./i, '');
                }

                // 替换特殊字符
                filename = filename.replace(/[_-]/g, ' ');

                // 首字母大写
                filename = filename.split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');

                // 限制长度
                if (filename.length > 30) {
                    filename = filename.substring(0, 30) + '...';
                }

                return filename;
            } catch (error) {
                // 如果解析失败，返回URL的一部分
                return url.substring(0, 30) + '...';
            }
        }

        /**
         * 渲染流媒体到UI
         * @param {Object} stream - 流媒体对象
         */
        renderStream(stream) {
            // 获取列表容器
            const streamList = document.getElementById('sw-stream-list');
            if (!streamList) return;

            // 移除空状态
            const emptyState = streamList.querySelector('.sw-empty-state');
            if (emptyState) {
                emptyState.remove();
            }

            // 创建流媒体项
            const streamItem = document.createElement('div');
            streamItem.className = `sw-stream-item ${stream.type}`;
            streamItem.setAttribute('data-id', stream.id);

            // 设置HTML内容
            streamItem.innerHTML = `
                <div class="sw-stream-header">
                    <div class="sw-stream-title" title="${stream.title}">${stream.title}</div>
                    <div class="sw-stream-type ${stream.type}">${stream.type}</div>
                </div>
                <div class="sw-stream-url" title="点击复制">${stream.url}</div>
                <div class="sw-stream-actions">
                    <button class="sw-stream-btn copy">${ICONS.COPY} 复制</button>
                    <button class="sw-stream-btn ffmpeg">${ICONS.FFMPEG} FFmpeg</button>
                    <button class="sw-stream-btn open">${ICONS.OPEN} 打开</button>
                </div>
            `;

            // 添加事件监听
            streamItem.querySelector('.sw-stream-url').addEventListener('click', () => {
                this.copyToClipboard(stream.url);
            });

            streamItem.querySelector('.copy').addEventListener('click', () => {
                this.copyToClipboard(stream.url);
            });

            streamItem.querySelector('.ffmpeg').addEventListener('click', () => {
                this.copyFFmpegCommand(stream.url, stream.type);
            });

            streamItem.querySelector('.open').addEventListener('click', () => {
                this.openInNewTab(stream.url);
            });

            // 添加到列表
            streamList.appendChild(streamItem);

            // 滚动到底部
            streamList.scrollTop = streamList.scrollHeight;
        }

        /**
         * 更新流媒体计数
         */
        updateCounter() {
            const counter = document.getElementById('sw-counter');
            if (counter) {
                counter.textContent = this.streams.size;
            }
        }

        /**
         * 复制文本到剪贴板
         * @param {string} text - 要复制的文本
         */
        copyToClipboard(text) {
            const copyFn = async () => {
                try {
                    // 使用现代API
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(text);
                        return true;
                    }

                    // 备用方法
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.select();

                    const success = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    return success;
                } catch (error) {
                    console.error('[StreamWatch] 复制失败:', error);
                    return false;
                }
            };

            copyFn().then(success => {
                if (success) {
                    this.showToast('已复制到剪贴板', 'success');
                } else {
                    this.showToast('复制失败，请手动复制', 'error');
                }
            });
        }

        /**
         * 复制FFmpeg命令
         * @param {string} url - 流媒体URL
         * @param {string} type - 流媒体类型
         */
        copyFFmpegCommand(url, type) {
            let command = this.getFFmpegCommand(url, type);

            // 复制命令
            this.copyToClipboard(command);

            // 额外记录到控制台
            console.log(
                `%c[StreamWatch] FFmpeg下载命令:`,
                `color: ${CONFIG.THEME.PRIMARY}; font-weight: bold;`
            );
            console.log(`%c${command}`, 'background: #282c34; color: #abb2bf; padding: 4px 8px; border-radius: 4px;');
        }

        /**
         * 在新标签页打开URL
         * @param {string} url - 要打开的URL
         */
        openInNewTab(url) {
            try {
                window.open(url, '_blank');
                this.showToast('已在新标签页打开', 'info');
            } catch (error) {
                this.showToast('无法打开链接', 'error');
                console.error('[StreamWatch] 打开链接失败:', error);
            }
        }

        /**
         * 显示提示信息
         * @param {string} message - 提示消息
         * @param {string} type - 提示类型 (success, error, info, warning)
         */
        showToast(message, type = 'info') {
            // 移除现有提示
            const existingToast = document.querySelector('.sw-toast');
            if (existingToast) {
                existingToast.remove();
            }

            // 创建新提示
            const toast = document.createElement('div');
            toast.className = `sw-toast ${type}`;
            toast.textContent = message;

            // 添加到页面
            document.body.appendChild(toast);

            // 自动移除
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.opacity = '0';
                    toast.style.transform = this.isMobile ?
                        'translateX(-50%) translateY(20px)' : 'translateY(-20px)';

                    setTimeout(() => {
                        if (toast.parentNode) toast.remove();
                    }, 300);
                }
            }, CONFIG.TOAST_DURATION);
        }

        /**
         * 切换监控状态
         */
        toggleMonitoring() {
            this.isActive = !this.isActive;

            // 获取按钮
            const toggleBtn = document.getElementById('sw-toggle');

            if (this.isActive) {
                // 启动监控
                toggleBtn.innerHTML = ICONS.STOP;
                toggleBtn.style.background = CONFIG.THEME.ERROR;
                toggleBtn.style.color = '#fff';
                toggleBtn.title = '停止监控';

                                // 添加活动指示器到标题
                const title = document.querySelector('.sw-title');
                if (!title.querySelector('.sw-active-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'sw-active-indicator';
                    title.insertBefore(indicator, title.firstChild);
                }

                this.startPeriodicScan();
                this.showToast('已开始监控流媒体', 'success');
                this.log('开始监控流媒体', 'success');
            } else {
                // 停止监控
                toggleBtn.innerHTML = ICONS.START;
                toggleBtn.style.background = '';
                toggleBtn.style.color = '';
                toggleBtn.title = '开始监控';

                // 移除活动指示器
                const indicator = document.querySelector('.sw-active-indicator');
                if (indicator) indicator.remove();

                this.stopPeriodicScan();
                this.showToast('已停止监控', 'warning');
                this.log('停止监控流媒体', 'warning');
            }
        }

        /**
         * 切换最小化状态
         */
        toggleMinimize() {
            this.isMinimized = !this.isMinimized;

            // 获取元素
            const container = document.getElementById('sw-container');
            const minimizeBtn = document.getElementById('sw-minimize');

            if (this.isMinimized) {
                // 最小化
                container.classList.add('sw-minimized');
                minimizeBtn.innerHTML = ICONS.EXPAND;
                minimizeBtn.title = '展开';
            } else {
                // 展开
                container.classList.remove('sw-minimized');
                minimizeBtn.innerHTML = ICONS.MINIMIZE;
                minimizeBtn.title = '最小化';
            }
        }

        /**
         * 切换可见性状态
         * @param {boolean} visible - 是否可见
         */
        toggleVisibility(visible) {
            this.isVisible = visible;

            const container = document.getElementById('sw-container');
            const reopenBtn = document.getElementById('sw-reopen');

            if (visible) {
                // 显示面板
                container.style.display = 'block';
                reopenBtn.style.display = 'none';
            } else {
                // 隐藏面板
                container.style.display = 'none';
                reopenBtn.style.display = 'flex';

                // 如果正在监控，显示提示
                if (this.isActive) {
                    this.showToast('StreamWatch 已最小化到右下角但仍在监控', 'info');
                }
            }
        }

        /**
         * 开始周期性扫描
         */
        startPeriodicScan() {
            // 先停止现有扫描
            this.stopPeriodicScan();

            // 立即执行一次扫描
            this.scanPage();

            // 开始定时扫描
            this.scanTimer = setInterval(() => {
                this.scanPage();
            }, CONFIG.SCAN_INTERVAL);
        }

        /**
         * 停止周期性扫描
         */
        stopPeriodicScan() {
            if (this.scanTimer) {
                clearInterval(this.scanTimer);
                this.scanTimer = null;
            }
        }

        /**
         * 扫描整个页面
         */
        scanPage() {
            if (!this.isActive) return;

            try {
                // 扫描所有媒体元素
                const mediaElements = document.querySelectorAll('video, audio, source');
                mediaElements.forEach(element => {
                    this.scanMediaElement(element);
                });

                // 扫描所有链接
                const links = document.querySelectorAll('a[href]');
                links.forEach(link => {
                    this.analyzeUrl(link.href);
                });

                // 扫描带有数据属性的元素
                const dataElements = document.querySelectorAll('[data-src], [data-url], [data-hls], [data-m3u8]');
                dataElements.forEach(element => {
                    ['data-src', 'data-url', 'data-hls', 'data-m3u8'].forEach(attr => {
                        if (element.hasAttribute(attr)) {
                            this.analyzeUrl(element.getAttribute(attr));
                        }
                    });
                });

                // 扫描所有iframe
                const iframes = document.querySelectorAll('iframe[src]');
                iframes.forEach(iframe => {
                    this.analyzeUrl(iframe.src);
                });

                // 扫描所有script标签的src属性
                const scripts = document.querySelectorAll('script[src]');
                scripts.forEach(script => {
                    this.analyzeUrl(script.src);
                });

                // 扫描所有视频播放器相关元素
                const playerElements = document.querySelectorAll('[class*="player"], [class*="video"], [class*="media"]');
                playerElements.forEach(element => {
                    // 检查元素的所有属性
                    Array.from(element.attributes).forEach(attr => {
                        if (attr.value && typeof attr.value === 'string' && attr.value.includes('http')) {
                            this.analyzeUrl(attr.value);
                        }
                    });
                });
            } catch (error) {
                console.error('[StreamWatch] 扫描页面失败:', error);
            }
        }

        /**
         * 清空流媒体列表
         */
        clearStreams() {
            // 清空数据
            this.streams.clear();

            // 清空UI
            const streamList = document.getElementById('sw-stream-list');
            if (streamList) {
                streamList.innerHTML = `
                    <div class="sw-empty-state">
                        <div class="sw-empty-icon">🔍</div>
                        <p>等待检测流媒体...</p>
                    </div>
                `;
            }

            // 更新计数
            this.updateCounter();

            // 显示提示
            this.showToast('已清空流媒体列表', 'info');
        }

        /**
         * 导出数据
         */
        exportData() {
            // 检查是否有数据
            if (this.streams.size === 0) {
                this.showToast('没有可导出的数据', 'warning');
                return;
            }

            try {
                // 构建导出数据
                const exportData = {
                    version: CONFIG.VERSION,
                    timestamp: new Date().toISOString(),
                    pageUrl: window.location.href,
                    pageTitle: document.title,
                    streams: Array.from(this.streams.values()).map(stream => ({
                        url: stream.url,
                        type: stream.type,
                        title: stream.title,
                        timestamp: stream.timestamp,
                        ffmpegCommand: this.getFFmpegCommand(stream.url, stream.type)
                    }))
                };

                // 创建JSON文件
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                // 触发下载
                const a = document.createElement('a');
                a.href = url;
                a.download = `streamwatch_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
                a.click();

                // 释放URL
                URL.revokeObjectURL(url);

                // 显示提示
                this.showToast(`已导出${exportData.streams.length}个流媒体数据`, 'success');
            } catch (error) {
                this.showToast('导出失败', 'error');
                console.error('[StreamWatch] 导出数据失败:', error);
            }
        }

        /**
         * 获取FFmpeg命令
         * @param {string} url - 流媒体URL
         * @param {string} type - 流媒体类型
         * @returns {string} - FFmpeg命令
         */
        getFFmpegCommand(url, type) {
            switch (type) {
                case 'm3u8':
                case 'hls':
                    return `ffmpeg -i "${url}" -c copy -bsf:a aac_adtstoasc output.mp4`;

                case 'video':
                    const ext = url.match(/\.([^.?#]+)(?:\?|#|$)/) ? url.match(/\.([^.?#]+)(?:\?|#|$)/)[1] : 'mp4';
                    return `ffmpeg -i "${url}" -c copy output.${ext}`;

                default:
                    return `ffmpeg -i "${url}" -c copy output.mp4`;
            }
        }

        /**
         * 获取监控报告
         * @returns {Object} - 详细的监控报告
         */
        getReport() {
            const streams = Array.from(this.streams.values());
            const report = {
                version: CONFIG.VERSION,
                timestamp: new Date().toISOString(),
                pageUrl: window.location.href,
                pageTitle: document.title,
                isActive: this.isActive,
                statistics: {
                    totalStreams: streams.length,
                    streamTypes: {},
                    detectedFormats: new Set()
                },
                streams: streams.map(stream => ({
                    url: stream.url,
                    type: stream.type,
                    title: stream.title,
                    timestamp: stream.timestamp
                }))
            };

            // 统计流媒体类型
            streams.forEach(stream => {
                report.statistics.streamTypes[stream.type] = (report.statistics.streamTypes[stream.type] || 0) + 1;
                report.statistics.detectedFormats.add(stream.type);
            });

            report.statistics.detectedFormats = Array.from(report.statistics.detectedFormats);
            
            return report;
        }

        /**
         * 简化的切换方法（向后兼容）
         */
        toggle() {
            return this.toggleMonitoring();
        }

        /**
         * 简化的分析方法（向后兼容）
         */
        analyze(url) {
            return this.analyzeUrl(url);
        }

        /**
         * 记录日志
         * @param {string} message - 日志消息
         * @param {string} type - 日志类型
         */
        log(message, type = 'info') {
            const colors = {
                info: CONFIG.THEME.INFO,
                success: CONFIG.THEME.SUCCESS,
                warning: CONFIG.THEME.WARNING,
                error: CONFIG.THEME.ERROR
            };

            console.log(
                `%c[StreamWatch] ${message}`,
                `color: ${colors[type] || colors.info}; font-weight: 500;`
            );
        }

        /**
         * 销毁实例并清理资源
         */
        destroy() {
            // 停止监控
            this.stopPeriodicScan();

            // 移除DOM元素
            const container = document.getElementById('sw-container');
            if (container) container.remove();

            const reopenBtn = document.getElementById('sw-reopen');
            if (reopenBtn) reopenBtn.remove();

            const styles = document.getElementById('sw-styles');
            if (styles) styles.remove();

            // 移除所有toast
            const toast = document.querySelector('.sw-toast');
            if (toast) toast.remove();

            // 移除实例引用
            window.streamWatchPro = null;
            window.streamWatch = null;

            this.log('StreamWatch已完全卸载', 'warning');
        }
    }

    /**
     * 初始化StreamWatchPro - 增强版本，支持多种初始化策略
     */
    function initStreamWatchPro() {
        // 避免重复初始化
        if (window.streamWatchPro) {
            console.log('[StreamWatch] 已经初始化，跳过');
            return;
        }

        try {
            // 创建实例并绑定到全局
            window.streamWatchPro = new StreamWatchPro();
            
            // 提供向后兼容的全局变量
            window.streamWatch = window.streamWatchPro;

            // 设置便捷控制台命令
            window.swToggle = () => window.streamWatchPro.toggleMonitoring();
            window.swClear = () => window.streamWatchPro.clearStreams();
            window.swExport = () => window.streamWatchPro.exportData();
            window.swReport = () => {
                const streams = Array.from(window.streamWatchPro.streams.values());
                console.table(streams.map(s => ({
                    类型: s.type.toUpperCase(),
                    标题: s.title,
                    URL: s.url.substring(0, 50) + '...',
                    时间: s.timestamp
                })));
                return `检测到${streams.length}个流媒体`;
            };
            window.swDestroy = () => window.streamWatchPro.destroy();
            
            // 提供向后兼容的全局函数
            window.streamWatchReport = window.swReport;
            window.streamWatchToggle = window.swToggle;

            // 控制台信息
            console.log(
                `%c📺 StreamWatch Pro v${CONFIG.VERSION}`,
                `color: ${CONFIG.THEME.PRIMARY}; font-size: 14px; font-weight: bold;`
            );
            console.log(
                `%c可用控制台命令:\n`+
                `swToggle() - 切换监控状态\n`+
                `swClear() - 清空列表\n`+
                `swExport() - 导出数据\n`+
                `swReport() - 显示统计\n`+
                `swDestroy() - 卸载工具`,
                `color: #ddd; font-size: 12px;`
            );
            
            return true;
        } catch (error) {
            console.error('[StreamWatch] 初始化失败:', error);
            return false;
        }
    }

    /**
     * 健壮的初始化系统 - 多重策略确保脚本正常运行
     */
    (function robustInitialization() {
        'use strict';
        
        let initializationAttempts = 0;
        const MAX_ATTEMPTS = 15;
        const ATTEMPT_INTERVAL = 200;
        
        /**
         * 检查初始化条件
         * @returns {boolean} 是否可以初始化
         */
        function canInitialize() {
            return !!(document.body && 
                     document.body.children.length > 0 && 
                     document.readyState !== 'loading');
        }
        
        /**
         * 安全初始化函数
         */
        function safeInit() {
            initializationAttempts++;
            
            // 检查是否已经初始化
            if (window.streamWatchPro) {
                console.log('[StreamWatch] 检测到已存在实例，跳过初始化');
                return;
            }
            
            // 检查初始化条件
            if (!canInitialize()) {
                if (initializationAttempts < MAX_ATTEMPTS) {
                    setTimeout(safeInit, ATTEMPT_INTERVAL);
                    return;
                } else {
                    console.warn('[StreamWatch] 超过最大尝试次数，强制初始化');
                }
            }
            
            try {
                const success = initStreamWatchPro();
                if (success) {
                    console.log(`[StreamWatch] 初始化成功 (尝试 ${initializationAttempts}/${MAX_ATTEMPTS})`);
                } else {
                    throw new Error('初始化函数返回失败');
                }
            } catch (error) {
                console.error(`[StreamWatch] 初始化失败 (尝试 ${initializationAttempts}/${MAX_ATTEMPTS}):`, error);
                
                // 如果还有尝试机会，继续重试
                if (initializationAttempts < MAX_ATTEMPTS) {
                    setTimeout(safeInit, ATTEMPT_INTERVAL * 2);
                }
            }
        }
        
        /**
         * 使用MutationObserver监听DOM变化
         */
        function setupDOMObserver() {
            if (!document.documentElement) {
                setTimeout(setupDOMObserver, 10);
                return;
            }
            
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        // 检查是否添加了body元素或其子元素
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1 && 
                                (node.tagName === 'BODY' || node.parentElement === document.body)) {
                                observer.disconnect();
                                setTimeout(safeInit, 100);
                                return;
                            }
                        }
                    }
                }
            });
            
            observer.observe(document.documentElement, { 
                childList: true, 
                subtree: true 
            });
            
            // 10秒后自动断开观察器
            setTimeout(() => {
                observer.disconnect();
            }, 10000);
        }
        
        // 多重初始化策略
        
        // 策略1: 立即检查并初始化
        if (canInitialize()) {
            safeInit();
        } else {
            // 策略2: 使用标准DOM事件
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', safeInit);
            } else {
                setTimeout(safeInit, 100);
            }
            
            // 策略3: 窗口加载完成事件
            if (document.readyState !== 'complete') {
                window.addEventListener('load', safeInit);
            }
            
            // 策略4: 使用MutationObserver监听DOM变化
            setupDOMObserver();
            
            // 策略5: 定时重试 (间隔更长)
            setTimeout(() => {
                if (!window.streamWatchPro) {
                    console.log('[StreamWatch] 定时备用初始化触发');
                    safeInit();
                }
            }, 3000);
            
            // 策略6: 最后的保险措施
            setTimeout(() => {
                if (!window.streamWatchPro) {
                    console.log('[StreamWatch] 最终备用初始化触发');
                    safeInit();
                }
            }, 8000);
        }
    })();
})();
