// The Nelson Code — main.js

// ─── NAV: scroll behavior & mobile menu ───────────────────────────────────────
const nav = document.getElementById('nav');
const toggle = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.nav__mobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

toggle?.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});

// Close mobile menu when a link is clicked
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    mobileMenu.setAttribute('aria-hidden', true);
  });
});

// ─── ACTIVE NAV LINK on scroll ────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ─── FADE-UP ANIMATION ────────────────────────────────────────────────────────
const fadeEls = document.querySelectorAll('.keynote, .tenet, .book, .stats__item');
fadeEls.forEach(el => el.classList.add('fade-up'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => fadeObserver.observe(el));

// ─── FOOTER YEAR ──────────────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── FORM: NOTIFY ─────────────────────────────────────────────────────────────
const notifyForm = document.getElementById('notify-form');
const notifySuccess = document.getElementById('notify-success');

notifyForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = notifyForm.querySelector('input[type="email"]').value.trim();
  if (!email) return;

  const btn = notifyForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const formData = new FormData(notifyForm);
    const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(formData).toString() });
    if (res.ok) {
      notifySuccess.textContent = 'You are on the list.';
      notifyForm.reset();
    } else { throw new Error(); }
  } catch {
    notifySuccess.textContent = 'Something went wrong. Please try again.';
  } finally {
    btn.textContent = 'Notify Me';
    btn.disabled = false;
  }
});

// ─── FORM: BOOKING ────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const required = contactForm.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = 'rgba(184,100,100,0.6)';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });
  if (!valid) { contactSuccess.textContent = 'Please fill in all required fields.'; return; }

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  contactSuccess.textContent = '';

  try {
    const formData = new FormData(contactForm);
    const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(formData).toString() });
    if (res.ok) {
      contactSuccess.textContent = 'Received. You will hear back within 48 hours.';
      contactForm.reset();
    } else { throw new Error(); }
  } catch {
    contactSuccess.textContent = 'Something went wrong. Please email directly.';
  } finally {
    btn.textContent = 'Send Inquiry';
    btn.disabled = false;
  }
});
