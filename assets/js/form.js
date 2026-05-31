const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwKZeKnp-f09LqMc4zIWvKMs4tS55rA99umKTe4rK2WER4hZhPYQZoUu0eDjrmkwZYN/exec';

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const btnLoading = document.getElementById('btnLoading');
    const statusDiv = document.getElementById('formStatus');

    // Collect form data
    const formData = {
        firstName: document.getElementById('fname').value.trim(),
        lastName: document.getElementById('lname').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim()
    };

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnIcon.style.display = 'none';
    btnLoading.style.display = 'inline';
    statusDiv.style.display = 'none';

    // Send to Google Sheets
    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for Apps Script
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(() => {
            // With no-cors, we can't read the response, but we assume success
            showStatus('success', 'Thank you! Your request has been sent. We will contact you within 24 hours.');
            form.reset();
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showStatus('error', 'Something went wrong. Please try again or call us directly.');
        })
        .finally(() => {
            // Restore button
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnIcon.style.display = 'inline';
            btnLoading.style.display = 'none';
        });
}

// Show status message
function showStatus(type, message) {
    const statusDiv = document.getElementById('formStatus');
    statusDiv.style.display = 'block';

    if (type === 'success') {
        statusDiv.style.background = '#d4edda';
        statusDiv.style.color = '#155724';
        statusDiv.style.border = '1px solid #c3e6cb';
    } else {
        statusDiv.style.background = '#f8d7da';
        statusDiv.style.color = '#721c24';
        statusDiv.style.border = '1px solid #f5c6cb';
    }

    statusDiv.textContent = message;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
