/**
 * Portfolio - Main JavaScript
 * Funcionalidades: Navbar, Mobile Menu, Scroll Animations, Skill Bars
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const skillBars = document.querySelectorAll('.skill-progress');
    const sections = document.querySelectorAll('.section');

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // Smooth Scroll for Nav Links
    // ============================================
    let isScrolling = false;

    function handleNavLinkClick(e) {
        const href = this.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                closeMobileMenu();

                // Marcar como activo inmediatamente al hacer click
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                // Activar flag para ignorar scroll durante la animación
                isScrolling = true;

                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Desactivar flag después de que termine el scroll suave
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }
    }

    // ============================================
    // Active Nav Link on Scroll
    // ============================================
    function updateActiveNavLink() {
        // Ignorar si está haciendo scroll suave por click
        if (isScrolling) return;

        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        // Si esta al inicio (hero), no marcar ningún link
        if (window.scrollY < 200) {
            navLinks.forEach(link => link.classList.remove('active'));
            return;
        }

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============================================
    // Skill Bars Animation
    // ============================================
    function animateSkillBars() {
        const skillsSection = document.getElementById('skills');

        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = `${progress}%`;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(skillsSection);
    }

    // ============================================
    // Fade In Sections on Scroll
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.timeline-item, .education-card, .project-card, .hobby-card, .contact-card, .stat-card, .skills-category'
        );

        let visibleCount = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Añadir delay escalonado para efecto cascada
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, visibleCount * 30);
                    visibleCount++;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.classList.add('fade-in-section');
            observer.observe(el);
        });
    }

    // ============================================
    // Typing Effect (Optional Enhancement)
    // ============================================
    function initTypingEffect() {
        const typingElement = document.querySelector('.typing-text');

        if (!typingElement) return;

        const texts = [
            'Software Engineer - Backend & Data',
            'Backend Developer',
            'Data Engineer',
            'Especialista en Python & Django'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                // Pausa al final del texto
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        // Iniciar después de la animación inicial
        setTimeout(type, 2000);
    }

    // ============================================
    // Close Menu on Outside Click
    // ============================================
    function handleOutsideClick(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    }

    // ============================================
    // Close Menu on Escape Key
    // ============================================
    function handleEscapeKey(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    // ============================================
    // Throttle Function for Performance
    // ============================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        // Event Listeners
        window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
        window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscapeKey);

        // Initialize Animations
        animateSkillBars();
        initScrollAnimations();
        initTypingEffect();

        // Initial state
        handleNavbarScroll();
        updateActiveNavLink();
    }

    // ============================================
    // Run on DOM Ready
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
