/* Bakery Template JavaScript */

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

    // 2. Intersection Observer for Scroll Reveal
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If this is the highlight section, start counters
                if (entry.target.classList.contains('highlight')) {
                    startCounters();
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.scroll-reveal, .highlight').forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Counter Animation Logic
    const startCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const duration = 2000; // 2 seconds

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (outQuad)
                const easedProgress = progress * (2 - progress);

                counter.innerText = Math.floor(easedProgress * target);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(animate);
        });
    };

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Button Click Micro-animation
    const buttons = document.querySelectorAll('.btn-primary, .btn-sm, .btn-ghost');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Ripple effect check
            btn.style.transform = 'scale(0.96)';
            setTimeout(() => btn.style.transform = '', 150);
        });
    });

    // 6. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            alert('ArtisanBakes Menu: Expanding mobile navigation with delicious animations.');
        });
    }

    console.log('%c ARTISAN BAKES: STONE OVEN ACTIVATED ', 'color: #E64A19; font-weight: bold; font-size: 1rem;');
});
