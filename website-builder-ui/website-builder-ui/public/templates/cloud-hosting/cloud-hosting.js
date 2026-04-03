// cloud-hosting.js
// Particle field
const container = document.getElementById('particles');
if (container) {
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:absolute;border-radius:50%;background:rgba(37,99,235,${0.1 + Math.random() * 0.2});width:${4 + Math.random() * 6}px;height:${4 + Math.random() * 6}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:float-p ${3 + Math.random() * 6}s ease-in-out infinite;animation-delay:${Math.random() * 4}s`;
        container.appendChild(p);
    }
    const style = document.createElement('style');
    style.textContent = '@keyframes float-p{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-30px) translateX(10px)}}';
    document.head.appendChild(style);
}

// Reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.feat, .price-card').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; el.style.transition = `opacity 0.5s ${i * 0.08}s ease, transform 0.5s ${i * 0.08}s ease`; obs.observe(el); });
