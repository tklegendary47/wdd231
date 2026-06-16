// ============================================
// TALENTTRACK – PROFESSIONAL CONTACT FORM
// Used by: contact.html
// Features: Full validation, real-time feedback,
//           localStorage storage, success state,
//           accessibility, keyboard support
// ============================================

(function () {
    'use strict';

    // ────────────────────────────────────────
    // DOM ELEMENTS
    // ────────────────────────────────────────
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('contactSuccess');

    if (!form) return;

    const nameField = document.getElementById('contactName');
    const emailField = document.getElementById('contactEmail');
    const subjectField = document.getElementById('contactSubject');
    const messageField = document.getElementById('contactMessage');

    // ────────────────────────────────────────
    // VALIDATION RULES
    // ────────────────────────────────────────
    const VALIDATION_RULES = {
        contactName: {
            required: true,
            minLength: 2,
            maxLength: 100,
            messages: {
                required: 'Please enter your full name.',
                minLength: 'Name must be at least 2 characters.',
                maxLength: 'Name must be under 100 characters.',
                pattern: 'Name contains invalid characters.'
            },
            pattern: /^[a-zA-ZÀ-ÿ\s'\-\.]+$/,
            patternMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes.'
        },
        contactEmail: {
            required: true,
            messages: {
                required: 'Please enter your email address.',
                invalid: 'Please enter a valid email (e.g., name@domain.com).',
                noAt: 'Email must contain an "@" symbol.',
                noDomain: 'Email must contain a domain (e.g., .com, .co.zw).',
                noUsername: 'Email must have a username before "@".',
                invalidFormat: 'Email format is invalid.'
            },
            validate: function (value) {
                if (!value) return 'required';
                if (!value.includes('@')) return 'noAt';
                if (!value.includes('.')) return 'noDomain';

                const atIndex = value.indexOf('@');
                const lastDotIndex = value.lastIndexOf('.');

                if (atIndex < 1) return 'noUsername';
                if (atIndex > lastDotIndex) return 'invalidFormat';
                if (lastDotIndex >= value.length - 1) return 'noDomain';

                // Basic email regex as final check
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'invalid';

                return null; // Valid
            }
        },
        contactSubject: {
            required: true,
            messages: {
                required: 'Please select a topic.'
            }
        },
        contactMessage: {
            required: true,
            minLength: 10,
            maxLength: 2000,
            messages: {
                required: 'Please enter your message.',
                minLength: 'Message must be at least 10 characters.',
                maxLength: 'Message must be under 2000 characters.'
            }
        }
    };

    // ────────────────────────────────────────
    // ERROR MANAGEMENT
    // ────────────────────────────────────────
    function getErrorElement(inputElement) {
        let errorEl = inputElement.parentElement.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.setAttribute('role', 'alert');
            errorEl.setAttribute('aria-live', 'polite');
            inputElement.parentElement.appendChild(errorEl);
        }
        return errorEl;
    }

    function showFieldError(inputElement, message) {
        if (!inputElement) return;

        inputElement.classList.add('error');
        inputElement.setAttribute('aria-invalid', 'true');

        const errorEl = getErrorElement(inputElement);
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }

    function clearFieldError(inputElement) {
        if (!inputElement) return;

        inputElement.classList.remove('error');
        inputElement.removeAttribute('aria-invalid');

        const errorEl = inputElement.parentElement.querySelector('.error-message');
        if (errorEl) {
            errorEl.classList.remove('show');
            errorEl.textContent = '';
        }
    }

    function clearAllErrors() {
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
        form.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
    }

    // ────────────────────────────────────────
    // FIELD VALIDATION
    // ────────────────────────────────────────
    function validateName() {
        const value = nameField ? nameField.value.trim() : '';
        const rules = VALIDATION_RULES.contactName;

        if (!value) {
            showFieldError(nameField, rules.messages.required);
            return false;
        }
        if (value.length < rules.minLength) {
            showFieldError(nameField, rules.messages.minLength);
            return false;
        }
        if (value.length > rules.maxLength) {
            showFieldError(nameField, rules.messages.maxLength);
            return false;
        }
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(nameField, rules.patternMessage);
            return false;
        }

        clearFieldError(nameField);
        return true;
    }

    function validateEmail() {
        const value = emailField ? emailField.value.trim() : '';
        const rules = VALIDATION_RULES.contactEmail;

        const errorKey = rules.validate(value);
        if (errorKey) {
            showFieldError(emailField, rules.messages[errorKey]);
            return false;
        }

        clearFieldError(emailField);
        return true;
    }

    function validateSubject() {
        const rules = VALIDATION_RULES.contactSubject;

        if (!subjectField || !subjectField.value) {
            showFieldError(subjectField, rules.messages.required);
            return false;
        }

        clearFieldError(subjectField);
        return true;
    }

    function validateMessage() {
        const value = messageField ? messageField.value.trim() : '';
        const rules = VALIDATION_RULES.contactMessage;

        if (!value) {
            showFieldError(messageField, rules.messages.required);
            return false;
        }
        if (value.length < rules.minLength) {
            showFieldError(messageField, rules.messages.minLength);
            return false;
        }
        if (value.length > rules.maxLength) {
            showFieldError(messageField, rules.messages.maxLength);
            return false;
        }

        clearFieldError(messageField);
        return true;
    }

    function validateAllFields() {
        const nameValid = validateName();
        const emailValid = validateEmail();
        const subjectValid = validateSubject();
        const messageValid = validateMessage();

        return nameValid && emailValid && subjectValid && messageValid;
    }

    // ────────────────────────────────────────
    // FORM SUBMISSION
    // ────────────────────────────────────────
    function handleSubmit(event) {
        event.preventDefault();

        // Clear all previous errors
        clearAllErrors();

        // Validate all fields
        const isValid = validateAllFields();

        if (!isValid) {
            // Focus the first field with an error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }

        // All valid — save to localStorage
        const formData = {
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            subject: subjectField.value,
            message: messageField.value.trim(),
            submittedAt: new Date().toISOString()
        };

        try {
            const submissions = JSON.parse(localStorage.getItem('talenttrack_contacts') || '[]');
            submissions.push(formData);
            localStorage.setItem('talenttrack_contacts', JSON.stringify(submissions));
        } catch (e) {
            console.warn('Could not save contact submission:', e.message);
        }

        // Show success
        if (successMessage) {
            successMessage.classList.add('show');
            successMessage.setAttribute('role', 'status');
            successMessage.setAttribute('aria-live', 'polite');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset the form
        form.reset();
        clearAllErrors();

        // Hide success after 6 seconds
        setTimeout(() => {
            if (successMessage) {
                successMessage.classList.remove('show');
            }
        }, 6000);

        return true;
    }

    // ────────────────────────────────────────
    // REAL-TIME VALIDATION ON BLUR
    // ────────────────────────────────────────
    function setupRealTimeValidation() {
        if (nameField) {
            nameField.addEventListener('blur', function () {
                if (this.value.trim()) validateName();
            });
            nameField.addEventListener('input', function () {
                if (this.classList.contains('error')) validateName();
            });
        }

        if (emailField) {
            emailField.addEventListener('blur', function () {
                if (this.value.trim()) validateEmail();
            });
            emailField.addEventListener('input', function () {
                if (this.classList.contains('error')) validateEmail();
            });
        }

        if (subjectField) {
            subjectField.addEventListener('change', function () {
                if (this.classList.contains('error')) validateSubject();
            });
        }

        if (messageField) {
            messageField.addEventListener('blur', function () {
                if (this.value.trim()) validateMessage();
            });
            messageField.addEventListener('input', function () {
                if (this.classList.contains('error')) validateMessage();
            });
        }
    }

    // ────────────────────────────────────────
    // CHARACTER COUNTER FOR MESSAGE
    // ────────────────────────────────────────
    function setupCharacterCounter() {
        if (!messageField) return;

        const counter = document.createElement('span');
        counter.className = 'char-counter';
        counter.setAttribute('aria-live', 'polite');
        counter.setAttribute('aria-atomic', 'true');
        messageField.parentElement.appendChild(counter);

        function updateCounter() {
            const length = messageField.value.length;
            const maxLength = VALIDATION_RULES.contactMessage.maxLength;
            const remaining = maxLength - length;

            counter.textContent = `${length} / ${maxLength} characters`;

            if (remaining < 50) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }

            if (remaining < 0) {
                counter.classList.add('error-text');
            } else {
                counter.classList.remove('error-text');
            }
        }

        messageField.addEventListener('input', updateCounter);
        updateCounter();
    }

    // ────────────────────────────────────────
    // INITIALIZATION
    // ────────────────────────────────────────
    function init() {
        // Attach submit handler
        form.addEventListener('submit', handleSubmit);

        // Setup real-time validation
        setupRealTimeValidation();

        // Setup character counter
        setupCharacterCounter();

        // Prevent form submission on Enter key in textarea (allow Shift+Enter)
        if (messageField) {
            messageField.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    // Don't prevent — let the form handle it naturally
                    // But many users expect Enter to submit, so we keep default behavior
                }
            });
        }

        console.log('✅ TalentTrack contact form initialized with full validation');
    }

    // ────────────────────────────────────────
    // START
    // ────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();