// Animation Boilerplate
document.addEventListener("DOMContentLoaded", () => {
    const stateElements = document.querySelectorAll('[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                let current = 0;
                const increment = Math.max(1, Math.floor(target / 40));
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.innerText = target;
                        clearInterval(timer);
                    } else {
                        el.innerText = current;
                    }
                }, 40);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    stateElements.forEach(el => observer.observe(el));
});
