/**
 * OpenClaw - Minimal Memecoin Website
 * JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initCopyButton();
    initSmoothScroll();
    initNavBackground();
    initAnimations();
    initParallax();
    initTextParallax();
    initTextHoverEffects();
    
    // Delayed status typing for effect
    setTimeout(() => {
        initStatusTyping();
    }, 500);
});

/**
 * Copy contract address to clipboard
 */
function initCopyButton() {
    const copyBtn = document.getElementById('copy-btn');
    const contractAddress = document.getElementById('contract-address');
    
    if (!copyBtn || !contractAddress) return;
    
    // Real contract address
    const FULL_CONTRACT_ADDRESS = 'CxoaKHTGYAUkHwzK5dazVYuG3vvEXExrGznMwX1ipump';
    
    copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            await navigator.clipboard.writeText(FULL_CONTRACT_ADDRESS);
            
            // Visual feedback
            copyBtn.classList.add('copied');
            
            // Reset after delay
            setTimeout(() => {
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = FULL_CONTRACT_ADDRESS;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            copyBtn.classList.add('copied');
            setTimeout(() => copyBtn.classList.remove('copied'), 2000);
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Dynamic navigation background on scroll
 */
function initNavBackground() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 11, 13, 0.95)';
            nav.classList.add('scrolled');
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(10, 11, 13, 1), transparent)';
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Intersection Observer for scroll animations
 */
function initAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-up {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        
        .scale-in {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .scale-in.visible {
            opacity: 1;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);
    
    // Elements to animate
    const animateElements = [
        '.status-card',
        '.community-content',
        '.community-links',
        '.token-grid',
        '.section-label',
        '.featured-header',
        '.tweets-grid',
        '.featured-note',
        '.terminal-window'
    ];
    
    // Scale-in elements
    const scaleElements = [
        '.status-grid'
    ];
    
    // Add animation classes
    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('fade-in-up');
            if (index < 3) {
                el.classList.add(`stagger-${index + 1}`);
            }
        });
    });
    
    scaleElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('scale-in');
        });
    });
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements
    document.querySelectorAll('.fade-in-up, .scale-in, .typewriter-line, .reveal-text').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Parallax effect for background
 */
function initParallax() {
    const bgGradient = document.querySelector('.bg-gradient');
    if (!bgGradient) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        bgGradient.style.transform = `translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
}

/**
 * Text parallax effect - moves text based on scroll
 */
function initTextParallax() {
    const parallaxTexts = document.querySelectorAll('.parallax-text');
    if (!parallaxTexts.length) return;
    
    // Store initial positions
    const textData = [];
    parallaxTexts.forEach((el, index) => {
        textData.push({
            element: el,
            speed: parseFloat(el.dataset.speed) || 0.05,
            initialY: 0
        });
    });
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        textData.forEach(data => {
            const rect = data.element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const distanceFromCenter = elementCenter - windowHeight / 2;
            
            // Only apply effect when element is in view
            if (rect.top < windowHeight && rect.bottom > 0) {
                const movement = distanceFromCenter * data.speed;
                data.element.style.transform = `translateY(${movement}px)`;
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // Initial call
    updateParallax();
}

/**
 * Typing effect for status values (subtle)
 */
function initStatusTyping() {
    const statusValues = document.querySelectorAll('.status-value');
    
    statusValues.forEach((el, index) => {
        const text = el.textContent;
        el.textContent = '';
        el.style.opacity = '1';
        
        setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                el.textContent = text.slice(0, i + 1);
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                }
            }, 50);
        }, 1500 + (index * 200));
    });
}

/**
 * Status indicator - simulates "alive" behavior
 * Updates status randomly to feel autonomous
 */
function initStatusUpdates() {
    const statusValue = document.querySelector('.status-card:first-child .status-value');
    if (!statusValue) return;
    
    // Subtle status messages
    const statuses = ['Online', 'Active', 'Running', 'Online'];
    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % statuses.length;
        statusValue.style.opacity = 0;
        
        setTimeout(() => {
            statusValue.textContent = statuses[currentIndex];
            statusValue.style.opacity = 1;
        }, 200);
    }, 30000); // Change every 30 seconds - very subtle
}

/**
 * Text character hover effect
 * Makes text feel more interactive
 */
function initTextHoverEffects() {
    // Apply hover effect to specific text elements
    const textElements = document.querySelectorAll('.hero-title, .featured-text');
    
    textElements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        
        // Split into words and wrap each character
        text.split(' ').forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word-wrapper';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.marginRight = '0.3em';
            
            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char-hover';
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                charSpan.style.transition = 'transform 0.2s ease, color 0.2s ease';
                
                charSpan.addEventListener('mouseenter', () => {
                    charSpan.style.transform = 'translateY(-3px)';
                    charSpan.style.color = '#c94a4a';
                });
                
                charSpan.addEventListener('mouseleave', () => {
                    charSpan.style.transform = 'translateY(0)';
                    charSpan.style.color = '';
                });
                
                wordSpan.appendChild(charSpan);
            });
            
            el.appendChild(wordSpan);
        });
    });
}

// Optional: Console easter egg
console.log('%cOpenClaw', 'color: #c94a4a; font-size: 24px; font-weight: bold;');
console.log('%cStill running.', 'color: #5a5e66; font-size: 14px;');
