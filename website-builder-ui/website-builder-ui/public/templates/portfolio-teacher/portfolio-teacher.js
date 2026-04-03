// portfolio-teacher.js
// Staggered chalk writing animation
document.querySelectorAll('.chalk-line').forEach((el, i) => {
    el.style.animationDelay = (i * 0.4) + 's';
    el.style.animationFillMode = 'forwards';
});

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.course-card, .ach-item, .sm-stat').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease`; obs.observe(el); });
