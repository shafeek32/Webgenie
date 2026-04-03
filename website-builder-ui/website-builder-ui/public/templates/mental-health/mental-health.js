// mental-health.js
// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.service-card, .therapist-card').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`; obs.observe(el); });

// Breathing ring interaction
const ring = document.getElementById('breathingRing');
let breathing = false;
if (ring) {
    ring.addEventListener('click', () => {
        breathing = !breathing;
        ring.style.animationPlayState = breathing ? 'paused' : 'running';
        ring.querySelector('span').textContent = breathing ? 'Pause' : 'Breathe';
    });
}

// Smooth header on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) header.style.boxShadow = window.scrollY > 60 ? '0 4px 20px rgba(0,0,0,0.08)' : 'none';
});
