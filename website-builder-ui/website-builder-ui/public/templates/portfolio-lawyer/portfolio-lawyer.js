// portfolio-lawyer.js
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.pa-card, .case-item, .cl').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`; obs.observe(el); });
window.addEventListener('scroll', () => { document.getElementById('header').classList.toggle('compact', window.scrollY > 80); });
