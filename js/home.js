// ===== HOME.JS — Hero slider, featured listings, buyer requirements =====

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  renderFeaturedListings();
  renderBuyerTicker();
  renderBuyerCards();
});

// --- Hero Slider ---
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroDots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(n) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  const interval = setInterval(() => goToSlide(current + 1), 5500);

  // Pause on hover
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(interval));
  }
}

// --- Featured Listings ---
function renderFeaturedListings() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  const listings = DB.getListings({ featured: true });
  if (!listings.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1">No featured listings at the moment.</p>';
    return;
  }

  grid.innerHTML = listings.map(l => buildPropertyCard(l)).join('');
}

// --- Buyer Requirements Ticker ---
function renderBuyerTicker() {
  const ticker = document.getElementById('buyerTicker');
  if (!ticker) return;

  const reqs = DB.getBuyerRequirements();
  const items = [...reqs, ...reqs]; // duplicate for seamless loop

  ticker.innerHTML = items.map(r => `
    <div class="ticker-item">
      <div class="ticker-dot"></div>
      <span>${r.title} — Budget: PKR ${r.budget_label || r.budget_max.toLocaleString()}</span>
    </div>
  `).join('');
}

// --- Buyer Cards ---
function renderBuyerCards() {
  const grid = document.getElementById('buyerGrid');
  if (!grid) return;

  const reqs = DB.getBuyerRequirements().slice(0, 4);
  grid.innerHTML = reqs.map(r => buildBuyerCard(r)).join('');
}
