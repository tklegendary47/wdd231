// ============================================
// TALENTTRACK – SHARED NAVIGATION
// Used by: about.html, contact.html, application-success.html, attributions.html
// ============================================

(function () {
    'use strict';

    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!hamburger || !mobileMenu) return;

    // Toggle mobile menu
    hamburger.addEventListener('click', function () {
        const isOpen = mobileMenu.classList.contains('active');

        if (isOpen) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        } else {
            hamburger.classList.add('active');
            mobileMenu.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
    });

    // Close menu when any link inside is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Footer dynamic content
    const yearSpan = document.getElementById('year');
    const modifiedSpan = document.getElementById('modified');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (modifiedSpan) {
        const lastModified = new Date(document.lastModified);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        modifiedSpan.textContent = lastModified.toLocaleDateString('en-US', options);
    }
})();