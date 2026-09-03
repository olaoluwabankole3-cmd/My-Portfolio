/**
 * COS 106 - Contact Form Validation Script
 * Attaches to form submit event, performs regex checks, and displays custom logs in the error block.
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const errorContainer = document.getElementById('error-container');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Prevent default submission to validate first
            e.preventDefault();

            // Fetch input values
            const nameVal = document.getElementById('contact-name').value.trim();
            const emailVal = document.getElementById('contact-email').value.trim();
            const phoneVal = document.getElementById('contact-phone').value.trim();
            const messageVal = document.getElementById('contact-message').value.trim();

            const errorMessages = [];

            // 1. Check: No field is left empty
            if (!nameVal) {
                errorMessages.push("Full Name field cannot be empty.");
            }
            if (!emailVal) {
                errorMessages.push("Email Address field cannot be empty.");
            }
            if (!phoneVal) {
                errorMessages.push("Phone Number field cannot be empty.");
            }
            if (!messageVal) {
                errorMessages.push("Message details cannot be empty.");
            }

            // 2. Check: Email format matches standard patterns
            if (emailVal) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailVal)) {
                    errorMessages.push("Email Address does not match standard valid format (e.g., user@domain.com).");
                }
            }

            // 3. Check: Phone number contains strictly digits
            if (phoneVal) {
                const digitsRegex = /^\d+$/;
                if (!digitsRegex.test(phoneVal)) {
                    errorMessages.push("Phone Number must contain strictly digits (no letters, spaces, or formatting characters).");
                }
            }

            // --- Handlers ---
            if (errorMessages.length > 0) {
                // If checks fail, display custom messages in the error block
                showErrors(errorMessages);
            } else {
                // If successful, fire an alert, clear the form, and clear errors
                hideErrors();
                alert("SUCCESS! All compliance handshakes passed.\n\nName: " + nameVal + "\nEmail: " + emailVal + "\n\nYour message has been dispatched successfully over secure network channels!");
                contactForm.reset();
            }
        });
    }

    // Displays custom error logs inside the container
    function showErrors(messages) {
        if (!errorContainer) return;

        // Populate error log HTML structure
        errorContainer.className = "error-container-visible";
        errorContainer.innerHTML = `
            <div class="error-title">
                <span>⚠️ Validations Failed:</span>
            </div>
            <ul class="error-list">
                ${messages.map(msg => `<li>${escapeHTML(msg)}</li>`).join('')}
            </ul>
        `;

        // Smooth scroll to top of form to view errors
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Clears error container
    function hideErrors() {
        if (!errorContainer) return;
        errorContainer.className = "error-container-hidden";
        errorContainer.innerHTML = "";
    }

    // Helper function to escape HTML strings to prevent injection
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
