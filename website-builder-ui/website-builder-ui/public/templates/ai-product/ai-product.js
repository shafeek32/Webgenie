// ai-product.js
// Neural network canvas animation
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
let nodes = [], w, h;
function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
function createNodes(n) { nodes = []; for (let i = 0; i < n; i++) { nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 }); } }
createNodes(60);
function draw() {
    ctx.clearRect(0, 0, w, h);
    nodes.forEach(n => { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1; });
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (d < 150) {
                ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - d / 150)})`; ctx.lineWidth = 1; ctx.stroke();
            }
        }
        ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.5)'; ctx.fill();
    }
    requestAnimationFrame(draw);
}
draw();

// Typewriter
const phrases = ['Understands You', 'Never Forgets', 'Works For You', 'Grows With You'];
let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');
function type() {
    const phrase = phrases[pi % phrases.length];
    if (!deleting) { tw.textContent = phrase.slice(0, ++ci); if (ci >= phrase.length) { deleting = true; setTimeout(type, 1800); return; } }
    else { tw.textContent = phrase.slice(0, --ci); if (ci <= 0) { deleting = false; pi++; } }
    setTimeout(type, deleting ? 50 : 100);
}
type();

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.feat-card, .price-card').forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s'; obs.observe(el); });
