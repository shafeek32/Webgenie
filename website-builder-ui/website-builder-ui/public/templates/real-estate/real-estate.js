/* Real Estate Template JavaScript */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll-sensitive Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. High-Tech Intersection Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Fire counters if this is the stats section
                if (entry.target.classList.contains('stats-section')) {
                    animateCounters();
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal, .stats-section').forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Smooth Counter Animation
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const duration = 2000;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            const animateStep = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                // EaseOutQuad
                const easedProgress = progress * (2 - progress);
                counter.innerText = Math.floor(easedProgress * target);

                if (progress < 1) {
                    requestAnimationFrame(animateStep);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(animateStep);
        });
    };

    // 4. Smooth Scrolling Logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Card Interactive Feedback
    const interactables = document.querySelectorAll('.feature-card, .btn-solid, .btn-outline, .btn-large');
    interactables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

        item.addEventListener('mousedown', () => {
            item.style.transform = 'scale(0.97)';
        });

        item.addEventListener('mouseup', () => {
            item.style.transform = 'scale(1.03)';
            setTimeout(() => item.style.transform = '', 200);
        });
    });

    // 6. Mobile Side Menu Alert
    const toggle = document.querySelector('.mobile-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            alert('EliteEstates Global Nav: Accessing luxury property database via mobile-optimized interface.');
        });
    }

    console.log('%c ELITE ESTATES: ARCHITECTURE SECURE ', 'color: #1E3A8A; font-weight: bold; font-size: 1.1rem;');
});
