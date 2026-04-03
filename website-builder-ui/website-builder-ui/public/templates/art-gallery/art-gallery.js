// art-gallery.js
window.addEventListener('scroll', () => { document.getElementById('header').classList.toggle('scrolled', window.scrollY > 80); });
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.ex-card, .artist-item').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.7s ${i * 0.07}s ease, transform 0.7s ${i * 0.07}s ease`; obs.observe(el); });

// Parallax hero artwork
window.addEventListener('scroll', () => { const art = document.querySelector('.artwork-main'); if (art) art.style.transform = `scale(1) translateY(${window.scrollY * 0.1}px)`; });
