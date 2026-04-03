// food-delivery.js
// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.cat-card, .step, .stat').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.5s ${i * 0.05}s ease, transform 0.5s ${i * 0.05}s ease`; obs.observe(el); });

// Phone animation: cycling delivery statuses
const statuses = ['On the way!', 'Nearby 🏃', 'Almost there!', '1 min away!'];
const statusEl = document.querySelector('.order-status');
let si = 0;
if (statusEl) setInterval(() => { si = (si + 1) % statuses.length; statusEl.textContent = statuses[si]; }, 2000);

// Map animation
const map = document.querySelector('.phone-map');
const pins = ['🏍️', '🛵', '🚴', '🛵'];
let pi = 0;
if (map) { map.textContent = pins[pi]; setInterval(() => { pi = (pi + 1) % pins.length; map.textContent = pins[pi]; }, 1000); }
