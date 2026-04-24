// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.init());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.1;
                particle.vy -= (dy / distance) * force * 0.1;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx = -particle.vx;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy = -particle.vy;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(30, 144, 255, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach(other => {
                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150 && distance > 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(30, 144, 255, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        this.cursorX = 0;
        this.cursorY = 0;
        this.followerX = 0;
        this.followerY = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        });
        
        document.addEventListener('mousedown', () => {
            this.cursor.style.transform = 'scale(0.8)';
            this.cursorFollower.style.transform = 'scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.style.transform = 'scale(1)';
            this.cursorFollower.style.transform = 'scale(1)';
        });
        
        this.animate();
    }
    
    animate() {
        // Smooth cursor movement
        this.cursor.style.left = this.cursorX - 10 + 'px';
        this.cursor.style.top = this.cursorY - 10 + 'px';
        
        // Smooth follower movement with lag
        this.followerX += (this.cursorX - this.followerX) * 0.1;
        this.followerY += (this.cursorY - this.followerY) * 0.1;
        
        this.cursorFollower.style.left = this.followerX - 20 + 'px';
        this.cursorFollower.style.top = this.followerY - 20 + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
}

// Smooth Scroll and Parallax
class SmoothScroll {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.navItems = document.querySelectorAll('.nav-item');
        this.lastScrollY = window.scrollY;
        this.scrollDirection = 'down';
        this.init();
    }
    
    init() {
        // Navigation active state with scroll direction detection
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
            this.lastScrollY = currentScrollY;
            
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navItems.forEach(item => {
                item.classList.remove('active');
                if (item.textContent.toLowerCase() === current) {
                    item.classList.add('active');
                }
            });
            
            // Add scroll direction animations
            this.updateScrollAnimations();
        });
        
        // Smooth scroll for navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.textContent.toLowerCase();
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Reveal animations
        this.setupReveal();
        
        // Parallax effects
        this.setupParallax();
        
        // Scroll direction animations
        this.setupScrollDirectionAnimations();
    }
    
    setupReveal() {
        const reveals = document.querySelectorAll('.member-card, .stat-item, .about-text p');
        
        reveals.forEach(element => {
            element.classList.add('reveal');
        });
        
        const revealOnScroll = () => {
            reveals.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    }
    
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.hero-visual, .about-visual');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.classList.contains('hero-visual') ? 0.5 : 0.3;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    setupScrollDirectionAnimations() {
        // Add scroll direction classes to body
        document.body.classList.add('scroll-down');
        
        this.updateScrollAnimations = () => {
            const scrollSpeed = Math.abs(this.scrollDirection === 'down' ? 1 : -1);
            const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            
            // Update body class for scroll direction
            document.body.classList.remove('scroll-down', 'scroll-up');
            document.body.classList.add(this.scrollDirection === 'down' ? 'scroll-down' : 'scroll-up');
            
            // Animate elements based on scroll direction
            this.animateScrollElements(scrollProgress, scrollSpeed);
        };
    }
    
    animateScrollElements(progress, speed) {
        // Animate navigation bar
        const navbar = document.querySelector('.navbar');
        if (this.scrollDirection === 'down' && window.scrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                navbar.style.transform = 'translateY(0)';
            }, 300);
        }
        
        // Animate hero elements on scroll down
        if (this.scrollDirection === 'down') {
            const heroTitle = document.querySelector('.hero-title');
            const heroLines = document.querySelectorAll('.hero-line');
            
            if (heroTitle) {
                heroTitle.style.transform = `scale(${1 - progress * 0.2}) translateY(${-progress * 50}px)`;
                heroTitle.style.opacity = 1 - progress * 0.5;
            }
            
            heroLines.forEach((line, index) => {
                line.style.transform = `translateX(${-progress * 100 * (index + 1)}px)`;
                line.style.opacity = 1 - progress * 0.7;
            });
        }
        
        // Animate elements on scroll up
        if (this.scrollDirection === 'up') {
            const memberCards = document.querySelectorAll('.member-card');
            const aboutSection = document.querySelector('.about-section');
            
            memberCards.forEach((card, index) => {
                const cardProgress = Math.max(0, 1 - progress);
                card.style.transform = `translateY(${cardProgress * 30 * index}px) scale(${0.9 + cardProgress * 0.1})`;
            });
            
            if (aboutSection) {
                aboutSection.style.transform = `translateY(${progress * 50}px)`;
            }
        }
        
        // Animate floating elements based on scroll direction
        const floatElements = document.querySelectorAll('.float-element');
        floatElements.forEach((element, index) => {
            const direction = this.scrollDirection === 'down' ? 1 : -1;
            element.style.transform = `translateY(${direction * progress * 100 * (index + 1)}px) rotate(${direction * progress * 360}deg)`;
        });
    }
}

// Interactive Effects
class InteractiveEffects {
    constructor() {
        this.memberCards = document.querySelectorAll('.member-card');
        this.heroTitle = document.querySelector('.hero-title');
        this.init();
    }
    
    init() {
        // Member card hover effects
        this.memberCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRipple(e, card);
            });
            
            card.addEventListener('mousemove', (e) => {
                this.cardTilt(e, card);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.querySelector('.card-glow').style.transform = '';
            });
        });
        
        // Hero title interactive effect
        this.setupHeroTitleEffect();
        
        // Navigation scroll effect
        this.setupNavScroll();
    }
    
    createRipple(e, card) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(30, 144, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: ripple-expand 0.6s ease-out;
        `;
        
        const rect = card.getBoundingClientRect();
        ripple.style.left = e.clientX - rect.left + 'px';
        ripple.style.top = e.clientY - rect.top + 'px';
        
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    cardTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const tiltX = (y / rect.height) * 10;
        const tiltY = -(x / rect.width) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
        
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        }
    }
    
    setupHeroTitleEffect() {
        const letters = document.querySelectorAll('.title-letter');
        
        letters.forEach((letter, index) => {
            letter.addEventListener('mouseenter', () => {
                letter.style.animation = 'letter-glow 0.5s ease';
            });
            
            letter.addEventListener('mouseleave', () => {
                letter.style.animation = '';
            });
        });
    }
    
    setupNavScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                navbar.style.backdropFilter = 'blur(30px)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.8)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
            
            lastScroll = currentScroll;
        });
    }
}

// Loading Animation
class LoadingAnimation {
    constructor() {
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.className = 'loading-overlay';
        this.loadingOverlay.innerHTML = '<div class="loading-text">BELLARI</div>';
        document.body.appendChild(this.loadingOverlay);
        
        this.init();
    }
    
    init() {
        // Hide loading screen after content loads - reduced duration
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadingOverlay.classList.add('hidden');
                setTimeout(() => this.loadingOverlay.remove(), 500);
            }, 800);
        });
    }
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-expand {
        to {
            width: 400px;
            height: 400px;
            opacity: 0;
        }
    }
    
    @keyframes letter-glow {
        0%, 100% {
            text-shadow: 0 0 30px rgba(30, 144, 255, 0.5);
        }
        50% {
            text-shadow: 0 0 60px rgba(30, 144, 255, 1);
        }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
    new CustomCursor();
    new SmoothScroll();
    new InteractiveEffects();
    new LoadingAnimation();
    
    // Add some extra interactive elements
    setupExtraEffects();
});

function setupExtraEffects() {
    // Add dynamic gradient animation
    const gradientWaves = document.querySelectorAll('.gradient-wave');
    gradientWaves.forEach((wave, index) => {
        wave.style.animationDelay = `${index * 2}s`;
    });
    
    // Add floating animation to hero lines
    const heroLines = document.querySelectorAll('.hero-line');
    heroLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add cyber grid animation
    const cyberGrid = document.querySelector('.cyber-grid');
    if (cyberGrid) {
        cyberGrid.style.animationDuration = '25s';
    }
    
    // Add energy ring random animation
    const energyRings = document.querySelectorAll('.energy-ring');
    energyRings.forEach((ring, index) => {
        ring.style.animationDuration = `${10 + index * 5}s`;
    });
}

// Performance optimization
let ticking = false;
function updateAnimations() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Update any performance-critical animations here
            ticking = false;
        });
        ticking = true;
    }
}

// Add resize handler for responsive design
window.addEventListener('resize', () => {
    updateAnimations();
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Add any escape key functionality
    }
    
    // Arrow key navigation
    const sections = ['hero', 'members', 'about'];
    const currentSection = sections.findIndex(section => {
        const element = document.getElementById(section);
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
    });
    
    if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        document.getElementById(sections[currentSection + 1]).scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' && currentSection > 0) {
        document.getElementById(sections[currentSection - 1]).scrollIntoView({ behavior: 'smooth' });
    }
});
