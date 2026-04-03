// resume.js
// Print button
document.getElementById('printBtn')?.addEventListener('click', () => window.print());

// Dark mode toggle
const darkBtn = document.getElementById('darkBtn');
darkBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    darkBtn.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Download as HTML
document.getElementById('downloadBtn')?.addEventListener('click', () => {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'resume.html'; a.click(); URL.revokeObjectURL(a.href);
});

// Animate skill bars on load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.s-fill').forEach(el => { el.style.width = el.style.width; });
    }, 300);
});

// Scroll reveal for main sections
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.exp-item, .edu-item, .proj-row').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; el.style.transition = `opacity 0.5s ${i * 0.06}s ease, transform 0.5s ${i * 0.06}s ease`; obs.observe(el); });
