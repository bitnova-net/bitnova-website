/* ========================================
   DARK MODE FUNCTIONALITY
========================================= */

/**
 * Initialize dark mode on page load
 * Check localStorage for saved theme preference
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
    } else {
        // If no preference saved, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    }
}

/**
 * Toggle between light and dark mode
 * Save preference to localStorage
 */
function toggleTheme() {
    const body = document.body;
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', initTheme);

/* ========================================
   MOBILE NAVIGATION FUNCTIONS
========================================= */

/**
 * Toggle mobile menu open/close
 */
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const toggle = document.querySelector('.menu-toggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

/**
 * Close mobile menu
 */
function closeMenu() {
    const menu = document.getElementById('navMenu');
    const toggle = document.querySelector('.menu-toggle');
    menu.classList.remove('active');
    toggle.classList.remove('active');
}

/* ========================================
   NAVBAR SCROLL EFFECT
========================================= */

/**
 * Add 'scrolled' class to navbar when page is scrolled down
 */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ========================================
   SMOOTH SCROLLING
========================================= */

/**
 * Enable smooth scroll for all anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========================================
   COUNTER ANIMATION
========================================= */

/**
 * Animate counter from 0 to target value
 * @param {HTMLElement} element - The element to animate
 * @param {string} target - Target value (can include +, %, or /)
 * @param {number} duration - Animation duration in milliseconds (default: 2000)
 */
function animateCounter(element, target, duration = 2000) {
    const startTime = performance.now();
    const startValue = 0;
    
    // Check if target contains special characters
    const hasPlus = target.includes('+');
    const hasPercent = target.includes('%');
    const hasSlash = target.includes('/');
    
    // Extract the numeric value
    let numericTarget;
    if (hasSlash) {
        // For "24/7", just display it directly without animation
        element.textContent = target;
        return;
    } else {
        numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
    }
    
    /**
     * Update counter on each animation frame
     * @param {number} currentTime - Current timestamp
     */
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // LINEAR animation - no easing, constant speed
        const current = Math.floor(progress * numericTarget);
        
        // Format the display value
        let displayValue = current;
        if (hasPercent) {
            displayValue = current + '%';
        } else if (hasPlus) {
            displayValue = current + '+';
        }
        
        element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target; // Ensure final value is exact
        }
    }
    
    requestAnimationFrame(update);
}

/* ========================================
   SCROLL ANIMATIONS
========================================= */

// Flag to track if stats have been animated
let statsAnimated = false;

/**
 * Intersection Observer options
 */
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

/**
 * Observer for general scroll animations
 * Adds 'animate-in' class when elements come into view
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

/**
 * Separate observer for stats section
 * Animates all counters together when section comes into view
 */
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            
            // Animate all stat numbers at once
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(numberElement => {
                const targetValue = numberElement.getAttribute('data-target');
                animateCounter(numberElement, targetValue);
            });
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

/**
 * Observe the stats section for counter animation
 */
const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

/**
 * Observe all elements that should animate on scroll
 */
const animateElements = document.querySelectorAll('.service-card, .stat-item, .process-step, .project-card, .contact-item, .about-text, .about-image');
animateElements.forEach((el) => {
    observer.observe(el);
});

/* ========================================
   SYSTEM THEME CHANGE LISTENER
========================================= */

/**
 * Listen for system theme changes and update if no user preference is saved
 */
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only auto-update if user hasn't manually set a preference
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
}


/* ========================================
   ADDITIONAL INTERACTIONS
========================================= */

// Go to top button
const goToTopBtn = document.getElementById("goToTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        goToTopBtn.style.display = "flex";
    } else {
        goToTopBtn.style.display = "none";
    }
});

// Custom cursor
const cursor = document.querySelector('.cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Mouse events for desktop
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Touch events for mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
});

document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        cursor.style.opacity = '1'; // Show cursor on touch
    }
});

document.addEventListener('touchend', () => {
    // Optional: hide cursor when not touching
    // cursor.style.opacity = '0';
});

function animateCursor() {
    const diffX = mouseX - cursorX;
    const diffY = mouseY - cursorY;
    
    cursorX += diffX * 0.1;
    cursorY += diffY * 0.1;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();


/* ========================================
   GSAP ANIMATIONS
========================================= */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    
    /* ========================================
       HERO SECTION ANIMATIONS
    ========================================= */
    
    // Hero content animation
    gsap.from('.hero-content .hero-label', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-content h1', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-content p', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-buttons', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out'
    });
    
    // Hero card animation
    gsap.from('.hero-card', {
        opacity: 0,
        x: 100,
        duration: 1,
        delay: 0.8,
        ease: 'power3.out'
    });
    
    
    /* ========================================
       STATS SECTION ANIMATIONS
    ========================================= */
    
    gsap.from('.stat-item', {
        scrollTrigger: {
            trigger: '.stats',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });
    
    /* ========================================
       SERVICES SECTION ANIMATIONS
    ========================================= */
    
    gsap.from('.services .section-header', {
        scrollTrigger: {
            trigger: '.services',
            start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%'
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
    });
    
    /* ========================================
       ABOUT SECTION ANIMATIONS
    ========================================= */
    
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%'
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power2.out'
    });
    
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%'
        },
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power2.out'
    });
    
    gsap.from('.about-features li', {
        scrollTrigger: {
            trigger: '.about-features',
            start: 'top 90%'
        },
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    });
    
    /* ========================================
       PROJECT SECTION ANIMATIONS
    ========================================= */
    
    gsap.from('.project .section-header', {
        scrollTrigger: {
            trigger: '.project',
            start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.project-card',
            start: 'top 85%'
        },
        opacity: 0,
        y: 80,
        duration: 1,
        ease: 'power2.out'
    });
    
    /* ========================================
       PROCESS SECTION ANIMATIONS
    ========================================= */
    
    gsap.from('.process .section-header', {
        scrollTrigger: {
            trigger: '.process',
            start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    gsap.from('.process-step', {
        scrollTrigger: {
            trigger: '.process-grid',
            start: 'top 80%'
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out'
    });

    // Animate each process number individually with rotation
    document.querySelectorAll('.process-step').forEach((step, index) => {
        gsap.from(step.querySelector('.process-number'), {
            scrollTrigger: {
                trigger: step,
                start: 'top 85%'
            },
            opacity: 0,
            rotation: 360,
            scale: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'back.out(1.7)'
        });
    });
    
    /* ========================================
       CTA SECTION ANIMATIONS
    ========================================= */
    
    gsap.from('.cta h2', {
        scrollTrigger: {
            trigger: '.cta',
            start: 'top 80%'
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });
    
    gsap.from('.cta p', {
        scrollTrigger: {
            trigger: '.cta',
            start: 'top 80%'
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out'
    });
    
    gsap.from('.cta .btn-white', {
        scrollTrigger: {
            trigger: '.cta',
            start: 'top 80%'
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out'
    });
    
    /* ========================================
       CONTACT SECTION ANIMATIONS
    ========================================= */
    
    gsap.from('.contact .section-header', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 85%'
        },
        opacity: 0,
        x: -40,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out'
    });
    
    gsap.from('.contact-grid > div:last-child', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 85%'
        },
        opacity: 0,
        x: 40,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    /* ========================================
       NAVBAR SCROLL ANIMATION
    ========================================= */
    
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    /* ========================================
       PARALLAX EFFECT ON HERO GRADIENT
    ========================================= */
    
    gsap.to('.hero-gradient', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        opacity: 0.3,
        ease: 'none'
    });
    
    /* ========================================
       HOVER ANIMATIONS FOR CARDS
    ========================================= */
    
    // Service cards hover effect
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('.service-icon'), {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('.service-icon'), {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Process step hover animation
    document.querySelectorAll('.process-step').forEach(step => {
        step.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('.process-number'), {
                scale: 1.15,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
        
        step.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('.process-number'), {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    /* ========================================
       SMOOTH SCROLL WITH GSAP
    ========================================= */
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power2.inOut'
                });
            }
        });
    });
    
    /* ========================================
       GO TO TOP BUTTON ANIMATION
    ========================================= */
    
    const goToTopBtn = document.getElementById('goToTopBtn');
    
    gsap.set(goToTopBtn, { scale: 0, opacity: 0 });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            gsap.to(goToTopBtn, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(1.7)',
                display: 'flex'
            });
        } else {
            gsap.to(goToTopBtn, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    goToTopBtn.style.display = 'none';
                }
            });
        }
    });
    
});

/* ========================================
   REFRESH SCROLL TRIGGER ON RESIZE
========================================= */

window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});