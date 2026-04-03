// portfolio-photographer.js
window.addEventListener('scroll', () => { document.getElementById('header').style.background = window.scrollY > 60 ? 'rgba(13,13,13,0.98)' : 'rgba(13,13,13,0.9)'; });
// Gallery parallax
const galleryItems = document.querySelectorAll('.g-item');
window.addEventListener('scroll', () => { const sy = window.scrollY; galleryItems.forEach((el, i) => { const speed = i % 2 === 0 ? 0.04 : -0.04; el.style.transform = `translateY(${sy * speed}px)`; }); });
// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.g-item, .aw, .pl').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.7s ${i * 0.06}s ease, transform 0.7s ${i * 0.06}s ease`; obs.observe(el); });
