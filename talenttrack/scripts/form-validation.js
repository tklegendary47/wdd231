// ============================================
// TALENTTRACK – APPLY FORM VALIDATION
// Used by: Apply form inside index.html
// ============================================

(function () {
    'use strict';

    // Use MutationObserver to detect when the apply form is added to DOM
    function initApplyFormValidation() {
        var form = document.getElementById('applicationForm');
        if (!form) {
            // Form not yet in DOM, try again later
            setTimeout(initApplyFormValidation, 200);
            return;
        }
        
        // Remove any existing listeners by cloning
        var newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        attachValidation(newForm);
    }

    function attachValidation(form) {
        form.addEventListener('submit', function (event) {
            var isValid = true;
            
            // Clear all previous errors
            clearErrors(form);
            
            // Validate Full Name
            var fullName = document.getElementById('fullName');
            if (!fullName || !fullName.value.trim()) {
                showError(fullName, 'fullNameError', 'Please enter your full name.');
                isValid = false;
            } else if (fullName.value.trim().length < 2) {
                showError(fullName, 'fullNameError', 'Name must be at least 2 characters.');
                isValid = false;
            }
            
            // Validate Email
            var email = document.getElementById('email');
            if (!email || !email.value.trim()) {
                showError(email, 'emailError', 'Please enter your email address.');
                isValid = false;
            } else {
                var emailVal = email.value.trim();
                if (!emailVal.includes('@')) {
                    showError(email, 'emailError', 'Email must contain an "@" symbol.');
                    isValid = false;
                } else if (!emailVal.includes('.')) {
                    showError(email, 'emailError', 'Email must contain a domain (e.g., .com).');
                    isValid = false;
                } else if (emailVal.indexOf('@') < 1) {
                    showError(email, 'emailError', 'Email must have a username before "@".');
                    isValid = false;
                }
            }
            
            // Validate Phone (optional but must be valid if provided)
            var phone = document.getElementById('phone');
            if (phone && phone.value.trim()) {
                var phoneRegex = /^\+?[\d\s\-\(\)]{7,15}$/;
                if (!phoneRegex.test(phone.value.trim())) {
                    showError(phone, 'phoneError', 'Please enter a valid phone number.');
                    isValid = false;
                }
            }
            
            // Validate Job Position
            var jobPosition = document.getElementById('jobPosition');
            if (!jobPosition || !jobPosition.value) {
                showError(jobPosition, 'jobPositionError', 'Please select a position.');
                isValid = false;
            }
            
            if (!isValid) {
                event.preventDefault();
                var firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return false;
            }
            // If valid, form submits normally to application-success.html
        });
    }

    function showError(inputElement, errorSpanId, message) {
        if (inputElement) {
            inputElement.classList.add('error');
        }
        var errorSpan = document.getElementById(errorSpanId);
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
    }

    function clearErrors(form) {
        form.querySelectorAll('.error').forEach(function(el) {
            el.classList.remove('error');
        });
        form.querySelectorAll('.error-message').forEach(function(el) {
            el.classList.remove('show');
            el.textContent = '';
        });
    }

    // Start checking for the form
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initApplyFormValidation, 500);
        });
    } else {
        setTimeout(initApplyFormValidation, 500);
    }
})();