// kids-education.js
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'scale(1)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.subj-card, .step-k').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'scale(0.9)'; el.style.transition = `opacity 0.5s ${i * 0.07}s ease, transform 0.5s ${i * 0.07}s ease`; obs.observe(el); });

// Confetti on badge click
document.querySelector('.hero-badge')?.addEventListener('click', () => {
    for (let i = 0; i < 30; i++) {
        const c = document.createElement('div');
        c.style.cssText = `position:fixed;top:50%;left:50%;width:8px;height:8px;border-radius:50%;background:hsl(${Math.random() * 360},90%,60%);pointer-events:none;z-index:9999`;
        document.body.appendChild(c);
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 200;
        c.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px),calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`, opacity: 0 }], { duration: 800, easing: 'ease-out' }).onfinish = () => c.remove();
    }
});
