// nft-marketplace.js
// Scroll animations
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = e.target.dataset.transform || 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.collection-card, .creator').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s';
    obs.observe(el);
});

// Counter animation
function animateValue(el, target, duration) {
    let start = 0;
    const step = timestamp => {
        if (!step.startTime) step.startTime = timestamp;
        const progress = Math.min((timestamp - step.startTime) / duration, 1);
        el.textContent = Math.floor(progress * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            document.querySelectorAll('.stat span').forEach(el => {
                const text = el.textContent;
                const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                if (text.includes('K')) {
                    animateValue(el, num * 1000, 1500);
                    setTimeout(() => el.textContent = text, 1600);
                } else if (text.includes('B')) {
                    el.textContent = text;
                }
            });
            statsObs.disconnect();
        }
    });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

// Card stack mouse parallax
const cardStack = document.querySelector('.hero-card-stack');
if (cardStack) {
    document.addEventListener('mousemove', e => {
        const { clientX, clientY } = e;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (clientX - cx) / cx;
        const dy = (clientY - cy) / cy;
        const c2 = cardStack.querySelector('.card-2');
        const c3 = cardStack.querySelector('.card-3');
        if (c2) c2.style.transform = `rotate(-8deg) translate(${dx * -12}px, ${dy * -8}px)`;
        if (c3) c3.style.transform = `rotate(8deg) translate(${dx * 12}px, ${dy * -8}px)`;
    });
}
