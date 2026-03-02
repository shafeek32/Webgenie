/* Wedding Template JavaScript */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animation
    const sections = document.querySelectorAll('.section-reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 3. Mobile Menu Toggle (Simplified for demo)
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Visual feedback for click
            menuToggle.style.transform = 'scale(0.9)';
            setTimeout(() => menuToggle.style.transform = 'scale(1)', 100);

            // In a real scenario, this would toggle a mobile overlay menu
            alert('Mobile Menu Clicked! In a full implementation, a slide-out menu would appear here.');
        });
    }

    // 4. Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Button Hover Micro-animation
    const ctaBtn = document.querySelector('.btn-primary');
    if (ctaBtn) {
        ctaBtn.addEventListener('mouseenter', () => {
            console.log('Premium interaction: Button hovered');
        });
    }
});
