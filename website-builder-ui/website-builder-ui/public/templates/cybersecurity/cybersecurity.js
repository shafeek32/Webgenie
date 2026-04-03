// cybersecurity.js
// Matrix rain
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
let w, h, cols, drops;
function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; cols = Math.floor(w / 20); drops = Array(cols).fill(1); }
resize(); window.addEventListener('resize', resize);
function matrix() {
    ctx.fillStyle = 'rgba(2,11,6,0.04)'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#00ff88'; ctx.font = '14px Share Tech Mono';
    drops.forEach((y, i) => {
        ctx.fillStyle = i % 5 === 0 ? '#00ff88' : 'rgba(0,204,102,0.5)';
        ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), i * 20, y * 20);
        if (y * 20 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(matrix, 60);

// Terminal typer
const lines = ['> scanning network... COMPLETE', '> 0 active threats detected', '> firewall: ACTIVE [v3.2.1]', '> endpoint agents: 2,143 ONLINE', '> last incident: 847 days ago', '> cloud integrity: 100% VERIFIED', '> running deep packet inspection...', '> anomaly detection: OPERATIONAL', '> all systems nominal ✓'];
const terminal = document.getElementById('terminalBody');
let li = 0;
function typeLine() {
    if (!terminal || li >= lines.length) return;
    const div = document.createElement('div');
    div.style.color = lines[li].includes('✓') || lines[li].includes('COMPLETE') ? '#00ff88' : lines[li].includes('0 active') ? '#00cc66' : 'rgba(0,255,136,0.7)';
    div.textContent = lines[li]; terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
    li++; setTimeout(typeLine, 800);
}
setTimeout(typeLine, 500);

// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.product-card').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; el.style.transition = `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`; obs.observe(el); });
