// portfolio-finance.js
// Sparkline chart
const canvas = document.getElementById('sparkline');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const pad = { l: 50, r: 20, t: 20, b: 30 };
    // Strategy vs S&P data points (2013–2025)
    const strategy = [100, 128, 162, 198, 240, 310, 390, 460, 335, 520, 680, 755, 847];
    const sp500 = [100, 130, 145, 165, 185, 210, 240, 260, 215, 270, 310, 330, 212 + 100];
    const maxV = Math.max(...strategy, ...sp500);
    const yPos = v => pad.t + (H - pad.t - pad.b) * (1 - v / maxV);
    const xPos = i => pad.l + ((W - pad.l - pad.r) / (strategy.length - 1)) * i;
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        const t = Math.min(frame / 80, 1);
        const pts = Math.floor(t * (strategy.length - 1));
        // S&P
        ctx.beginPath(); ctx.strokeStyle = 'rgba(148,163,184,0.4)'; ctx.lineWidth = 1.5;
        strategy.forEach((_, i) => { if (i > pts) return; i === 0 ? ctx.moveTo(xPos(i), yPos(sp500[i])) : ctx.lineTo(xPos(i), yPos(sp500[i])); });
        ctx.stroke();
        // Strategy
        const grd = ctx.createLinearGradient(0, 0, W, 0);
        grd.addColorStop(0, '#22c55e'); grd.addColorStop(1, '#86efac');
        ctx.beginPath(); ctx.strokeStyle = grd; ctx.lineWidth = 2; ctx.shadowBlur = 8; ctx.shadowColor = '#22c55e';
        strategy.forEach((_, i) => { if (i > pts) return; i === 0 ? ctx.moveTo(xPos(i), yPos(strategy[i])) : ctx.lineTo(xPos(i), yPos(strategy[i])); });
        ctx.stroke(); ctx.shadowBlur = 0;
        // Labels
        ctx.fillStyle = 'rgba(34,197,94,0.85)'; ctx.font = '10px IBM Plex Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText('Strategy', xPos(pts) - 10, yPos(strategy[Math.min(pts, strategy.length - 1)]) - 8);
        frame++; if (frame <= 90) requestAnimationFrame(draw);
    }
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { frame = 0; draw(); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(canvas);
}

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.exp-card, .tt-row, .res-card').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; el.style.transition = `opacity 0.5s ${i * 0.07}s ease, transform 0.5s ${i * 0.07}s ease`; obs.observe(el); });
