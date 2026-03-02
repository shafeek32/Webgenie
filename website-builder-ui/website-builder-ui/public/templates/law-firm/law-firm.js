/* Law Firm Template JavaScript */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Authority Navbar Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Sophisticated Intersection Observer for Reveals
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's the stats section, fire counters
                if (entry.target.id === 'stats') {
                    animateCounters();
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.scroll-reveal, #stats').forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Mathematical Counter Logic
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const duration = 2500; // 2.5 seconds for gravitas

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            const animateStep = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const value = Math.floor(progress * target);

                counter.innerText = value;

                if (progress < 1) {
                    requestAnimationFrame(animateStep);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(animateStep);
        });
    };

    // 4. Smooth Scrolling with Offset for Sticky Header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = 84;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Button Press Feel
    const actionBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, .btn-large');
    actionBtns.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(-2px) scale(0.98)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-5px) scale(1)';
        });
    });

    // 6. Mobile Side Menu Alert (Mock)
    const mobileBtn = document.querySelector('.mobile-nav-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            alert('Sterling Law Mobile: Accessing legal resources via authoritative navigation drawer.');
        });
    }

    console.log('%c STERLING & ASSOCIATES: STANDARDS ACTIVE ', 'color: #A88B4A; font-weight: bold; font-size: 1.1rem;');
});
