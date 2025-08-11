// project-page.js

document.addEventListener('DOMContentLoaded', function() {
    
    // 自定義游標
    initCustomCursor();
    
    // Hover 效果
    initHoverEffects();
    
    // 平滑滾動
    initSmoothScrolling();
    
    // 滾動動畫
    initScrollAnimations();
    
    // 媒體項目互動
    initMediaInteractions();
    
    // 鍵盤導航
    initKeyboardNavigation();
    
});

/**
 * 初始化自定義游標
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    if (!cursor) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // 隱藏游標當滑鼠離開視窗
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

/**
 * 初始化 Hover 效果
 */
function initHoverEffects() {
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll(
        '.back-btn, .project-link, .media-item, .tech-category, .detail-item, .logo'
    );
    
    if (!cursor) return;
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            el.style.transform = getHoverTransform(el);
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            el.style.transform = '';
        });
    });
}

/**
 * 根據元素類型取得對應的 hover 變換
 */
function getHoverTransform(element) {
    if (element.classList.contains('media-item')) {
        return 'translateY(-10px)';
    }
    if (element.classList.contains('tech-category')) {
        return 'translateY(-5px)';
    }
    if (element.classList.contains('project-link')) {
        return 'translateY(-3px)';
    }
    if (element.classList.contains('back-btn')) {
        return 'translateX(-5px)';
    }
    return 'translateY(-2px)';
}

/**
 * 初始化平滑滾動
 */
function initSmoothScrolling() {
    // 處理錨點連結
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 初始化滾動動畫
 */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.content-section, .hero-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSection(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        // 設定初始狀態
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        
        observer.observe(section);
    });
}

/**
 * 動畫化區塊進入效果
 */
function animateSection(section) {
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
    
    // 為區塊內的子元素添加階段性動畫
    const children = section.querySelectorAll('.media-item, .tech-category, .detail-item');
    children.forEach((child, index) => {
        setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * 初始化媒體項目互動
 */
function initMediaInteractions() {
    const mediaItems = document.querySelectorAll('.media-item');
    
    mediaItems.forEach(item => {
        // 為媒體項目添加點擊放大功能
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const video = this.querySelector('video');
            
            if (img || video) {
                createMediaModal(img || video);
            }
        });
        
        // 為影片添加 hover 播放功能
        const video = item.querySelector('video');
        if (video) {
            item.addEventListener('mouseenter', () => {
                video.play().catch(() => {
                    // 自動播放失敗時忽略
                });
            });
            
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
}

/**
 * 創建媒體彈窗
 */
function createMediaModal(mediaElement) {
    // 創建彈窗容器
    const modal = document.createElement('div');
    modal.className = 'media-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // 創建媒體元素副本
    const mediaClone = mediaElement.cloneNode(true);
    mediaClone.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(255, 255, 255, 0.2);
    `;
    
    // 創建關閉按鈕
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: none;
        border: none;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        z-index: 10001;
        transition: opacity 0.3s ease;
    `;
    
    // 組裝彈窗
    modal.appendChild(mediaClone);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
    
    // 顯示彈窗
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // 關閉功能
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // ESC 鍵關閉
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleKeyDown);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
}

/**
 * 初始化鍵盤導航
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // 上箭頭 - 滾動到頂部
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // 下箭頭 - 滾動到底部
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ 
                top: document.body.scrollHeight, 
                behavior: 'smooth' 
            });
        }
        
        // Enter 鍵 - 觸發焦點元素
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('media-item')) {
                focusedElement.click();
            }
        }
    });
    
    // 為媒體項目添加鍵盤焦點支持
    const mediaItems = document.querySelectorAll('.media-item');
    mediaItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('focus', function() {
            this.style.outline = '2px solid rgba(255, 255, 255, 0.5)';
            this.style.outlineOffset = '2px';
        });
        item.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

/**
 * 工具函數：檢測是否為移動設備
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 工具函數：節流函數
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * 工具函數：防抖函數
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// 導出函數供其他腳本使用（如果需要）
window.ProjectPage = {
    initCustomCursor,
    initHoverEffects,
    initSmoothScrolling,
    initScrollAnimations,
    initMediaInteractions,
    initKeyboardNavigation,
    createMediaModal,
    isMobileDevice,
    throttle,
    debounce
};