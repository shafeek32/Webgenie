// film-studio.js
// Scroll reveal
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.film-card').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease`; obs.observe(el); });

// Filter tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        document.querySelectorAll('.film-card').forEach(card => {
            const show = filter === 'all' || card.dataset.type === filter;
            card.style.opacity = show ? '1' : '0.2';
            card.style.pointerEvents = show ? 'auto' : 'none';
        });
    });
});

// Awards scroll duplication
const awardsBar = document.querySelector('.awards-bar');
if (awardsBar) awardsBar.innerHTML += awardsBar.innerHTML;
