// wine-cellar.js
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.wine-card, .perk').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = `opacity 0.7s ${i * 0.1}s ease, transform 0.7s ${i * 0.1}s ease`; obs.observe(el); });
