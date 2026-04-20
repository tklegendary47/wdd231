// ============================================
// TALENTTRACK - SLIDESHOW MODULE
// WDD 231 Final Project
// ============================================

let slideIndex = 0;
let slideInterval = null;

export function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slideDots');
    if (!slides.length || !dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('slide-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === 0);
        dot.addEventListener('click', () => { slideIndex = i; showSlide(slideIndex); resetInterval(); });
        dotsContainer.appendChild(dot);
    });
    resetInterval();
}

export function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    if (!slides.length) return;
    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
    dots.forEach((dot, i) => { dot.classList.toggle('active', i === slideIndex); dot.setAttribute('aria-selected', i === slideIndex); });
}

export function changeSlide(direction) { slideIndex += direction; showSlide(slideIndex); resetInterval(); }
export function resetInterval() { if (slideInterval) clearInterval(slideInterval); slideInterval = setInterval(() => { slideIndex++; showSlide(slideIndex); }, 6000); }
export function stopSlideshow() { if (slideInterval) { clearInterval(slideInterval); slideInterval = null; } }
if (typeof window !== 'undefined') { window.changeSlide = changeSlide; window.showSlide = showSlide; }