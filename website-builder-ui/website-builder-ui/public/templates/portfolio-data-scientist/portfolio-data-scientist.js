// portfolio-data-scientist.js
// Animated chart canvas
const canvas = document.getElementById('chartCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const data = [72, 88, 65, 94, 79, 85, 91, 70, 96, 82, 88, 95];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const W = canvas.width, H = canvas.height;
        const pad = { left: 50, right: 20, top: 30, bottom: 50 };
        const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
        const maxV = 100;
        // Grid lines
        ctx.strokeStyle = 'rgba(99,102,241,0.1)'; ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = pad.top + (ch / 5) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
            ctx.fillStyle = 'rgba(100,116,139,0.6)'; ctx.font = '11px Space Mono, monospace'; ctx.textAlign = 'right';
            ctx.fillText(((5 - i) * 20) + '%', pad.left - 8, y + 4);
        }
        // Data bars
        const bw = Math.min(cw / data.length - 8, 30);
        const animPct = Math.min(frame / 60, 1);
        data.forEach((v, i) => {
            const x = pad.left + (cw / data.length) * i + (cw / data.length - bw) / 2;
            const barH = (v / maxV) * ch * animPct;
            const y = pad.top + ch - barH;
            const grd = ctx.createLinearGradient(0, y, 0, y + barH);
            grd.addColorStop(0, 'rgba(99,102,241,0.9)'); grd.addColorStop(1, 'rgba(6,182,212,0.4)');
            ctx.fillStyle = grd;
            ctx.beginPath(); ctx.roundRect(x, y, bw, barH, [4, 4, 0, 0]); ctx.fill();
            ctx.fillStyle = 'rgba(100,116,139,0.7)'; ctx.font = '10px Space Mono'; ctx.textAlign = 'center';
            ctx.fillText(labels[i], x + bw / 2, pad.top + ch + 20);
        });
        // Line overlay
        if (animPct === 1) {
            ctx.beginPath(); ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 2; ctx.shadowBlur = 8; ctx.shadowColor = '#06b6d4';
            data.forEach((v, i) => {
                const x = pad.left + (cw / data.length) * i + cw / data.length / 2;
                const y = pad.top + ch - (v / maxV) * ch;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.stroke(); ctx.shadowBlur = 0;
        }
        frame++;
        if (frame <= 70) requestAnimationFrame(draw);
    }
    const chartObs = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { frame = 0; draw(); chartObs.disconnect(); } }, { threshold: 0.3 });
    chartObs.observe(canvas);
}

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.proj-card, .pub-item, .tag').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; el.style.transition = `opacity 0.5s ${i * 0.04}s ease, transform 0.5s ${i * 0.04}s ease`; obs.observe(el); });
