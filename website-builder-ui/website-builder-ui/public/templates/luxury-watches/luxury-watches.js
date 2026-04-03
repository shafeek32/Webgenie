// luxury-watches.js
// Watch hands animation
function setWatchTime() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const hourDeg = (hours * 30) + (minutes * 0.5);
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;
    document.querySelectorAll('.hour-hand').forEach(h => h.style.transform = `rotate(${hourDeg}deg)`);
    document.querySelectorAll('.min-hand').forEach(m => m.style.transform = `rotate(${minuteDeg}deg)`);
    document.querySelectorAll('.sec-hand').forEach(s => { s.style.transition = seconds === 0 ? 'none' : 'transform 0.3s cubic-bezier(0.4,2.3,0.3,1)'; s.style.transform = `rotate(${secondDeg}deg)`; });
}
setWatchTime();
setInterval(setWatchTime, 1000);

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.watch-card, .craft-stat').forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity 0.8s ease, transform 0.8s ease, border-color 0.4s'; obs.observe(el); });

// Parallax hero
window.addEventListener('scroll', () => { const y = window.scrollY; const bg = document.querySelector('.hero-bg'); if (bg) bg.style.transform = `translateY(${y * 0.3}px)`; });
