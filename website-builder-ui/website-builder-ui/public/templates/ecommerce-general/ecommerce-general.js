document.addEventListener("DOMContentLoaded", () => {
    // Simple Slider implementation
    const leftArrow = document.querySelector('.slide-arrow.left');
    const rightArrow = document.querySelector('.slide-arrow.right');
    const dots = document.querySelectorAll('.slider-nav .dot');
    
    if(leftArrow && rightArrow) {
        let currentSlide = 0;
        
        rightArrow.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % dots.length;
            updateDots();
        });
        
        leftArrow.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + dots.length) % dots.length;
            updateDots();
        });
        
        function updateDots() {
            dots.forEach((dot, index) => {
                if(index === currentSlide) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
    }
});
