/* Developer Portfolio Interaction Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Console log easter egg
    console.log("%c INIT_SEQUENCE_SUCCESS ", "background: #10b981; color: #000; font-weight: bold; font-family: monospace; padding: 4px;");
    console.log("%c PORTFOLIO BYPASS: ENABLED ", "color: #3b82f6; font-family: monospace; font-size: 14px;");

    // Interactive button sounds/effects (simulation)
    const buttons = document.querySelectorAll('.btn, .project-row');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Ripple effect logic or terminal noise could go here
            const el = e.currentTarget;
            el.style.transform = 'scale(0.98)';
            setTimeout(() => {
                el.style.transform = '';
            }, 100);
        });
    });

    // Typing effect logic
    const typedText = document.querySelector('.typing-effect');
    if (typedText) {
        const text = typedText.textContent;
        typedText.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typedText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, Math.random() * 100 + 50);
            }
        }

        // Start typing after a delay to simulate reading
        setTimeout(typeWriter, 1500);
    }

    // Hover glow effect following mouse
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
