// solar-energy.js
// Animated sun canvas
const canvas = document.getElementById('sunCanvas');
const ctx = canvas.getContext('2d');
let t = 0;
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
function drawSun() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width * 0.75, cy = canvas.height * 0.4;
    const r = 120 + Math.sin(t / 30) * 8;
    // glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4);
    grd.addColorStop(0, 'rgba(251,191,36,0.25)');
    grd.addColorStop(1, 'rgba(251,191,36,0)');
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, r * 4, 0, Math.PI * 2); ctx.fill();
    // sun
    const sunGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    sunGrd.addColorStop(0, 'rgba(255,220,60,0.6)');
    sunGrd.addColorStop(1, 'rgba(251,146,60,0.2)');
    ctx.fillStyle = sunGrd; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    // rays
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t / 60;
        const rx = cx + Math.cos(angle) * (r + 20);
        const ry = cy + Math.sin(angle) * (r + 20);
        const rx2 = cx + Math.cos(angle) * (r + 60 + Math.sin(t / 20 + i) * 10);
        const ry2 = cy + Math.sin(angle) * (r + 60 + Math.sin(t / 20 + i) * 10);
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx2, ry2);
        ctx.strokeStyle = 'rgba(251,191,36,0.3)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke();
    }
    t++; requestAnimationFrame(drawSun);
}
drawSun();

// Savings calculator
const slider = document.getElementById('billSlider');
const billVal = document.getElementById('billVal');
const savingsVal = document.getElementById('savingsVal');
if (slider) {
    slider.addEventListener('input', () => {
        const bill = parseInt(slider.value);
        ballVal.textContent = bill;
        savingsVal.textContent = '$' + Math.round(bill * 0.9 * 12).toLocaleString();
    });
}
// fix typo
const ballVal = document.getElementById('billVal');

// Scroll reveals
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.sol-card, .metric').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`; obs.observe(el); });
