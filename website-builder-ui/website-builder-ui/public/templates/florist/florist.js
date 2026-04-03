// florist.js
// Header scroll effect
window.addEventListener('scroll', () => { document.getElementById('header').classList.toggle('scrolled', window.scrollY > 60); });

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.col-card, .occ-item').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`; obs.observe(el); });

// Petal mouse parallax
document.addEventListener('mousemove', (e) => {
    const petals = document.querySelectorAll('.petal');
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    petals.forEach((p, i) => { const speed = (i + 1) * 5; p.style.transform = `translateY(${dy * speed}px) rotate(${dx * 10}deg)`; });
});
