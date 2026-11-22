/* ==========================================================================
   Hitayu Clinic Care - Interactive Functionality
   Mobile Menu Toggle, Active Scroll Spy, Date Guard, & Booking Confirmation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const preferredDateInput = document.getElementById('preferredDate');
  const bookingForm = document.getElementById('bookingForm');
  const bookingConfirmation = document.getElementById('bookingConfirmation');
  const confirmationSummary = document.getElementById('confirmationSummary');
  const confirmWhatsAppLink = document.getElementById('confirmWhatsAppLink');
  const resetBookingBtn = document.getElementById('resetBookingBtn');
  const currentYearSpan = document.getElementById('currentYear');

  // 1. Set current copyright year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. Restrict appointment date picker to today or future dates
  if (preferredDateInput) {
    const today = new Date().toISOString().split('T')[0];
    preferredDateInput.setAttribute('min', today);
    preferredDateInput.value = today;
  }

  // 3. Mobile Navigation Menu Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu when any navigation link or CTA is clicked
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Sticky Header Shadow & Active Section Highlighting on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 5. Interactive Appointment Booking Form Validation & Confirmation
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous errors
      document.getElementById('nameError').textContent = '';
      document.getElementById('phoneError').textContent = '';
      document.getElementById('dateError').textContent = '';
      document.getElementById('concernError').textContent = '';

      const name = document.getElementById('patientName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      const consultationType = document.getElementById('consultationType').value;
      const date = document.getElementById('preferredDate').value;
      const timeSlot = document.getElementById('preferredTime').value;
      const concern = document.getElementById('healthConcern').value.trim();

      let isValid = true;

      if (name.length < 2) {
        document.getElementById('nameError').textContent = 'Please enter your full name.';
        isValid = false;
      }

      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        document.getElementById('phoneError').textContent = 'Please enter a valid 10-digit phone number.';
        isValid = false;
      }

      if (!date) {
        document.getElementById('dateError').textContent = 'Please select a preferred appointment date.';
        isValid = false;
      }

      if (concern.length < 4) {
        document.getElementById('concernError').textContent = 'Please briefly describe your health concern.';
        isValid = false;
      }

      if (!isValid) return;

      // Format readable date
      const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      // Populate confirmation message
      confirmationSummary.innerHTML = `
        Thank you, <strong>${escapeHTML(name)}</strong>! Your <strong>${escapeHTML(consultationType)}</strong> request with 
        <strong>Dr. Shraddha Prajapati (BHMS)</strong> for <strong>${formattedDate}</strong> (${escapeHTML(timeSlot)}) 
        regarding <em>"${escapeHTML(concern)}"</em> has been logged. We will contact you at <strong>${escapeHTML(phone)}</strong> shortly.
      `;

      // Build pre-filled WhatsApp message link
      const clinicWhatsAppNumber = '919876543210';
      const waMessage = encodeURIComponent(
        `Hello Dr. Shraddha Prajapati (Hitayu Clinic Care),\n` +
        `I would like to confirm my appointment:\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Type: ${consultationType}\n` +
        `• Date: ${formattedDate} (${timeSlot})\n` +
        `• Concern: ${concern}`
      );
      confirmWhatsAppLink.href = `https://wa.me/${clinicWhatsAppNumber}?text=${waMessage}`;

      // Toggle form & confirmation views
      bookingForm.hidden = true;
      bookingConfirmation.hidden = false;
    });
  }

  // Reset form for another booking
  if (resetBookingBtn) {
    resetBookingBtn.addEventListener('click', () => {
      bookingForm.reset();
      if (preferredDateInput) {
        preferredDateInput.value = new Date().toISOString().split('T')[0];
      }
      bookingConfirmation.hidden = true;
      bookingForm.hidden = false;
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[tag]));
  }
});
