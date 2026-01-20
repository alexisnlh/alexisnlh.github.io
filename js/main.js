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
    const themeToggle = document.getElementById('themeToggle');

    // ============================================
    // Theme Toggle
    // ============================================
    function initTheme() {
        // Obtener tema guardado o usar preferencia del sistema
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', theme);

        // Guardar el tema inicial si no estaba guardado
        if (!savedTheme) {
            localStorage.setItem('theme', theme);
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Aplicar nuevo tema
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Forzar repaint para asegurar que los estilos se apliquen
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }

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
        const isActive = navMenu.classList.contains('active');
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = !isActive ? 'hidden' : '';
        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', !isActive);
        navToggle.setAttribute('aria-label', !isActive ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
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
            'Data Analyst - Backend & Data',
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
    // Project View Toggle
    // ============================================
    function initViewToggle() {
        const viewButtons = document.querySelectorAll('.view-toggle-btn');
        const projectsGrid = document.querySelector('.projects-grid');

        // Obtener vista guardada o usar grid por defecto
        const savedView = localStorage.getItem('projectsView') || 'grid';
        if (savedView === 'list') {
            projectsGrid.classList.add('list-view');
            viewButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-view') === 'list');
            });
        }

        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.getAttribute('data-view');

                // Remove active class and update aria-pressed for all buttons
                viewButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });

                // Add active class and aria-pressed to clicked button
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');

                // Toggle view
                if (view === 'list') {
                    projectsGrid.classList.add('list-view');
                } else {
                    projectsGrid.classList.remove('list-view');
                }

                // Save preference
                localStorage.setItem('projectsView', view);
            });
        });
    }

    // ============================================
    // Project Filters
    // ============================================
    function initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class and update aria-selected for all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });

                // Add active class and aria-selected to clicked button
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                // Get filter value
                const filterValue = button.getAttribute('data-filter');

                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        // Mostrar proyecto
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeIn 0.4s ease-out';
                    } else {
                        // Ocultar proyecto
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ============================================
    // Project Modals
    // ============================================
    function initModals() {
        const modalTriggers = document.querySelectorAll('.project-details-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const modals = document.querySelectorAll('.modal-overlay');
        const modalCloses = document.querySelectorAll('.modal-close');

        // Función para abrir modal
        function openModal(projectId) {
            const modal = document.getElementById(`modal-${projectId}`);
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';

                setTimeout(() => {
                    modal.scrollTop = 0;
                    const modalContent = modal.querySelector('.modal');
                    if (modalContent) {
                        modalContent.scrollTop = 0;
                    }
                    const closeBtn = modal.querySelector('.modal-close');
                    if (closeBtn) {
                        closeBtn.focus();
                    }
                }, 0);
            }
        }

        // Abrir modal al hacer click en toda la tarjeta de proyecto
        projectCards.forEach((card, index) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                // No abrir modal si se hizo clic en un enlace externo
                if (e.target.closest('.project-link') || e.target.closest('a')) {
                    return;
                }
                e.preventDefault();
                const projectId = `project-${index + 1}`;
                openModal(projectId);
            });
        });

        // Abrir modal al hacer click en "Ver detalles"
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const projectId = this.getAttribute('data-project');
                openModal(projectId);
            });
        });

        // Cerrar modal al hacer click en el botón de cerrar
        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                const modal = this.closest('.modal-overlay');
                closeModal(modal);
            });
        });

        // Helper function to close modal
        function closeModal(modal) {
            if (modal) {
                // Resetear scroll antes de cerrar
                modal.scrollTop = 0;
                const modalContent = modal.querySelector('.modal');
                if (modalContent) {
                    modalContent.scrollTop = 0;
                }

                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';

                // Return focus to trigger button
                const projectId = modal.id.replace('modal-', '');
                const triggerBtn = document.querySelector(`[data-project="${projectId}"]`);
                if (triggerBtn) {
                    triggerBtn.focus();
                }
            }
        }

        // Cerrar modal al hacer click fuera del contenido
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });

        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains('active')) {
                        closeModal(modal);
                    }
                });
            }
        });
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        // Initialize Theme
        initTheme();

        // Event Listeners
        window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
        window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
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

        // Initialize Modals
        initModals();

        // Initialize Project Filters
        initProjectFilters();

        // Initialize View Toggle
        initViewToggle();

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
