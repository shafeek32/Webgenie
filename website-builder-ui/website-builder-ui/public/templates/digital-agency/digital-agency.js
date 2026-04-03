// digital-agency.js
// Custom cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });
document.querySelectorAll('a, button, .work-item, .svc-row').forEach(el => { el.addEventListener('mouseenter', () => { cursor.style.width = '50px'; cursor.style.height = '50px'; cursor.style.background = 'rgba(229,255,0,0.15)'; }); el.addEventListener('mouseleave', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; cursor.style.background = 'transparent'; }); });

// Counter animation
let count = 0;
const counterEl = document.getElementById('counter');
const counterObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { let c = 0; const t = setInterval(() => { c += 3; if (c >= 248) { c = 248; clearInterval(t); } counterEl.textContent = String(c).padStart(3, '0'); }, 20); counterObs.disconnect(); } }); });
if (counterEl) counterObs.observe(counterEl);

// Typewriter words in hero
const words = ['That Win.', 'That Last.', 'That Grow.', 'That Convert.'];
let wi = 0;
const twWord = document.getElementById('twWord');
if (twWord) setInterval(() => { twWord.style.opacity = '0'; setTimeout(() => { wi = (wi + 1) % words.length; twWord.textContent = words[wi]; twWord.style.opacity = '1'; }, 300); twWord.style.transition = 'opacity 0.3s'; }, 2200);

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.work-item, .svc-row').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`; obs.observe(el); });
