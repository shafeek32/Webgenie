// esports-team.js
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.player-card, .match-item').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`; obs.observe(el); });

// Glitch effect on hero h1
const h1 = document.querySelector('.hero-content h1');
if (h1) {
    setInterval(() => {
        h1.style.clipPath = `inset(${Math.random() * 10}% 0 ${Math.random() * 10}% 0)`;
        setTimeout(() => h1.style.clipPath = 'none', 80);
    }, 4000);
}
