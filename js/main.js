// ===== MAIN.JS — Shared functionality across all pages =====

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initModal();
  initInquiryForm();
  setActiveNav();
});

// --- Navbar scroll behavior ---
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Only apply hero-top glass effect on the homepage (where a .hero section exists)
  const hasHero = !!document.querySelector('.hero');

  function updateNavState() {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);
    if (hasHero) {
      navbar.classList.toggle('hero-top', !scrolled);
    }
  }

  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState(); // Trigger on load

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
      }
    });
  }
}

// --- Set active nav link ---
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// --- Modal handling ---
function initModal() {
  const overlay = document.getElementById('inquiryModal');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay) return;

  closeBtn?.addEventListener('click', closeInquiry);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeInquiry();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInquiry();
  });
}

// --- Inquiry form submission ---
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const modal = document.getElementById('inquiryModal');
    const name = document.getElementById('inqName').value.trim();
    const phone = document.getElementById('inqPhone').value.trim();
    const email = document.getElementById('inqEmail').value.trim();
    const message = document.getElementById('inqMessage').value.trim();

    if (!name || !phone) {
      showToast('Please fill in your name and phone number.', 'error');
      return;
    }

    DB.saveInquiry({
      inquirer_name: name,
      inquirer_phone: phone,
      inquirer_email: email,
      message,
      listing_id: modal?.dataset.listingId || null,
      requirement_id: modal?.dataset.reqId || null,
    });

    closeInquiry();
    form.reset();
    showToast('✓ Inquiry submitted! ASK Realtors will contact you shortly.');
  });
}

// --- Counter animation ---
function animateCounters() {
  const numbers = document.querySelectorAll('.stat-number[data-target]');
  numbers.forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  });
}

// Intersection observer for counters
const statsSection = document.querySelector('.stats-strip');
if (statsSection) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        entry.target._ob?.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 }).observe(statsSection);
}

// --- Search redirect ---
function doSearch() {
  const city = document.getElementById('searchCity')?.value || '';
  const society = document.getElementById('searchSociety')?.value || '';
  const size = document.getElementById('searchSize')?.value || '';
  const budget = document.getElementById('searchBudget')?.value || '';

  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (society) params.set('society', society);
  if (size) params.set('size', size);
  if (budget) params.set('budget', budget);

  window.location.href = 'listings.html' + (params.toString() ? '?' + params.toString() : '');
}

// Allow Enter key on search bar
document.querySelectorAll('.search-field select').forEach(el => {
  el.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
});
