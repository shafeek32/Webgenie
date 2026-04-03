// portfolio-marketer.js
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.1 });
document.querySelectorAll('.result-card, .svc-item, .metric-sm').forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = `opacity 0.5s ${i * 0.08}s ease, transform 0.5s ${i * 0.08}s ease`; obs.observe(el); });

// Counter animation for metric-big
const mbig = document.querySelector('.mbig');
const metObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { let n = 0; const target = 120; const t = setInterval(() => { n = Math.min(n + 3, target); mbig.textContent = '$' + n + 'M+'; if (n >= target) clearInterval(t); }, 25); metObs.disconnect(); } }); }, { threshold: 0.5 });
if (mbig) metObs.observe(mbig);
