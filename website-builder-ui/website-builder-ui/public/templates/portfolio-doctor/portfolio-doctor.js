// portfolio-doctor.js
window.addEventListener('scroll', () => { document.getElementById('header').classList.toggle('scrolled', window.scrollY > 60); });
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.spec-card, .trust-item, .res-item, .cred-item, .appt-option').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`; obs.observe(el); });
// Pulse heartbeat animation on avatar icon
const icon = document.querySelector('.avatar-icon');
if (icon) setInterval(() => { icon.style.transform = 'scale(1.15)'; setTimeout(() => icon.style.transform = 'scale(1)', 200); icon.style.transition = 'transform 0.2s'; }, 1500);
