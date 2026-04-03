// portfolio-designer.js
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
    fx += (e.clientX - fx) * 0.1; fy += (e.clientY - fy) * 0.1;
    follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
});
function animFollower() { fx += (parseFloat(cursor.style.left || 0) - fx) * 0.1; fy += (parseFloat(cursor.style.top || 0) - fy) * 0.1; follower.style.left = fx + 'px'; follower.style.top = fy + 'px'; requestAnimationFrame(animFollower); }
animFollower();
document.querySelectorAll('a, button, .work-card, .ps-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(3)'; cursor.style.background = 'rgba(124,58,237,0.2)'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = 'var(--purple)'; });
});

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.work-card, .ps-item, .award-item').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease`; obs.observe(el); });
