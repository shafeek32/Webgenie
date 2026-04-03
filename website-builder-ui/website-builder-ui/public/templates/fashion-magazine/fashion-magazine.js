/* fashion-magazine.js */
// Custom cursor
const dot = document.getElementById('cursorDot');
const outline = document.getElementById('cursorOutline');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; });
function animateOutline() { outlineX += (mouseX - outlineX) * 0.12; outlineY += (mouseY - outlineY) * 0.12; outline.style.left = outlineX + 'px'; outline.style.top = outlineY + 'px'; requestAnimationFrame(animateOutline); }
animateOutline();
document.querySelectorAll('a, button').forEach(el => { el.addEventListener('mouseenter', () => outline.style.transform = 'translate(-50%,-50%) scale(2)'); el.addEventListener('mouseleave', () => outline.style.transform = 'translate(-50%,-50%) scale(1)'); });

// Scroll header
window.addEventListener('scroll', () => { document.getElementById('header').classList.toggle('scrolled', window.scrollY > 80); });

// Scroll reveal
const reveals = document.querySelectorAll('.ed-card, .feat-item, .sub-inner');
const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
reveals.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity 0.7s ease, transform 0.7s ease'; obs.observe(el); });

// Ticker duplication
const ticker = document.querySelector('.hero-ticker span');
ticker.innerHTML += ticker.innerHTML;
