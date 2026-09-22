// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navUl = document.querySelector('.nav ul');

    if (navToggle && navUl) {
        navToggle.addEventListener('click', () => {
            navUl.classList.toggle('open');
            // Change icon (optional)
            navToggle.textContent = navUl.classList.contains('open') ? '✕' : '☰';
        });
    }

    // Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});