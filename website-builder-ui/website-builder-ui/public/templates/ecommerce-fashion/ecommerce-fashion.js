// AURA Custom Interactions
document.addEventListener("DOMContentLoaded", () => {
    // Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    const hoverTriggers = document.querySelectorAll('.hover-trigger');
    
    if (window.innerWidth > 768 && cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower
        const updateFollower = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(updateFollower);
        };
        updateFollower();
        
        hoverTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', (e) => {
                const text = trigger.getAttribute('data-cursor');
                if (text) {
                    cursor.classList.add('active');
                    cursor.innerText = text;
                    follower.classList.add('hidden');
                } else {
                    cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
                }
            });
            trigger.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                cursor.innerText = '';
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.classList.remove('hidden');
            });
        });
    }

    // Header Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Horizontal Scroll Area Dragging
    const slider = document.querySelector('.lookbook-scroll-wrapper');
    if(slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }
});
