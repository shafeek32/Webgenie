// portfolio-architect.js
// Blueprint canvas animation
const canvas = document.getElementById('blueprintCanvas');
if (canvas) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(45,45,255,0.12)'; ctx.lineWidth = 0.8;
    // Grid
    for (let x = 0; x <= canvas.width; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y <= canvas.height; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    // Building outline
    const shapes = [
        [60, 320, 180, 320, 180, 80, 60, 80],   // left tower
        [180, 320, 340, 320, 340, 160, 180, 160], // middle
        [340, 320, 440, 320, 440, 40, 340, 40],   // right tower
    ];
    ctx.strokeStyle = 'rgba(45,45,255,0.35)'; ctx.lineWidth = 1.5;
    let frame = 0, total = 200;
    function draw() {
        if (frame > total) return;
        const t = frame / total;
        shapes.forEach((pts, si) => {
            if (t < si * 0.3) return;
            const lt = Math.min((t - si * 0.3) / 0.7, 1);
            const numPts = Math.floor(lt * (pts.length / 2 - 1));
            ctx.beginPath();
            for (let i = 0; i <= numPts && i < pts.length / 2 - 1; i++) {
                i === 0 ? ctx.moveTo(pts[0], pts[1]) : ctx.lineTo(pts[i * 2], pts[i * 2 + 1]);
            }
            ctx.stroke();
        });
        // dimension lines
        if (t > 0.9) {
            ctx.strokeStyle = 'rgba(45,45,255,0.2)'; ctx.lineWidth = 0.5; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(60, 340); ctx.lineTo(440, 340); ctx.stroke();
            ctx.fillStyle = 'rgba(45,45,255,0.5)'; ctx.font = '10px Barlow, sans-serif';
            ctx.fillText('38.0m', 220, 355);
            ctx.setLineDash([]);
        }
        frame++; requestAnimationFrame(draw);
    }
    const bObs = new IntersectionObserver(e => { if (e[0].isIntersecting) { draw(); bObs.disconnect(); } }, { threshold: 0.3 });
    bObs.observe(canvas);
}

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.proj-item, .phi-item, .award-row').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.7s ${i * 0.1}s ease, transform 0.7s ${i * 0.1}s ease`; obs.observe(el); });
