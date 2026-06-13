// ============================================
// TALENTTRACK – CONTACT FORM HANDLER
// Used by: contact.html
// ============================================

(function () {
    'use strict';

    var form = document.getElementById('contactForm');
    var successMessage = document.getElementById('contactSuccess');

    if (!form || !successMessage) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Collect form data
        var formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value,
            submittedAt: new Date().toISOString()
        };

        // Store in localStorage
        var submissions = JSON.parse(localStorage.getItem('talenttrack_contacts') || '[]');
        submissions.push(formData);
        localStorage.setItem('talenttrack_contacts', JSON.stringify(submissions));

        // Show success message
        successMessage.classList.add('show');
        form.reset();

        // Hide after 5 seconds
        setTimeout(function () {
            successMessage.classList.remove('show');
        }, 5000);
    });
})();