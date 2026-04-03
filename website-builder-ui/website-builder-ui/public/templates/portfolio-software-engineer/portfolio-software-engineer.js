// portfolio-software-engineer.js
// Falling code canvas background
const canvas = document.getElementById('codeCanvas');
const ctx = canvas.getContext('2d');
const chars = '01{}[]()=>const let async await function return import export class extends'.split(' ');
let drops = [];
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array(Math.floor(canvas.width / 18)).fill(1);
}
resize(); window.addEventListener('resize', resize);
setInterval(() => {
    ctx.fillStyle = 'rgba(13,17,23,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#39d35340';
    ctx.font = '13px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 18, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.98) drops[i] = 0;
        drops[i]++;
    });
}, 80);

// Typewriter
const phrases = ['scalable web apps', 'clean REST APIs', 'real-time systems', 'cloud architectures', 'open-source tools'];
let pi = 0, ci = 0, del = false;
const twEl = document.getElementById('twText');
function type() {
    const p = phrases[pi % phrases.length];
    if (!del) { twEl.textContent = p.slice(0, ++ci); if (ci >= p.length) { del = true; setTimeout(type, 2000); return; } }
    else { twEl.textContent = p.slice(0, --ci); if (ci <= 0) { del = false; pi++; } }
    setTimeout(type, del ? 40 : 90);
}
type();

// Skill bar animation
const barObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.fill').forEach(f => { f.style.width = f.style.width; }); barObs.disconnect(); } }); }, { threshold: 0.3 });
const skillsSection = document.querySelector('.skills');
if (skillsSection) barObs.observe(skillsSection);

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.project-card, .tl-item, .skill-group').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease, border-color 0.3s`; obs.observe(el); });

// Header scroll
window.addEventListener('scroll', () => { document.getElementById('header').style.borderBottomColor = window.scrollY > 60 ? 'rgba(48,54,61,0.8)' : 'inherit'; });
