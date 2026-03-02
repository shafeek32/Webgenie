/* Travel Template JavaScript */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll-triggered Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Smooth Section Reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Magnetic Hover Effect for Destination Cards (Simplified)
    const cards = document.querySelectorAll('.dest-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Subtle tilt
            card.style.transform = `translateY(-15px) perspective(1000px) rotateX(${y / 20}deg) rotateY(${-x / 20}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });

    // 4. Parallax Hero Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-image-layer');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // 5. Mobile Menu Toggle
    const burger = id('burger');
    if (burger) {
        burger.addEventListener('click', () => {
            // Visualize burger animation toggle
            burger.classList.toggle('toggle');
            alert('Wanderlust Navigation: Mobile Menu opened with slide-in animation.');
        });
    }

    // Utility
    function id(selector) {
        return document.getElementById(selector);
    }

    // 6. Smooth Scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('%c WANDERLUST ENGAGED ', 'color: #DD2476; font-weight: bold; font-size: 1.2rem;');
});
