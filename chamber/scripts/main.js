/***** main.js – Harare Chamber *****/

// Dark Mode
(function() {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;
  const saved = localStorage.getItem('harare-dark-mode');
  if (saved === 'enabled') document.body.classList.add('dark');
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('harare-dark-mode', document.body.classList.contains('dark') ? 'enabled' : 'disabled');
  });
})();

// Navigation
(function() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (!navbar || !hamburger || !navMenu) return;
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 10));
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }));
})();

// Back to Top
(function() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.style.display = window.scrollY > 500 ? 'flex' : 'none');
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Footer Year / Last Modified
(function() {
  const yearEl = document.getElementById('year');
  const modEl = document.getElementById('modified');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) modEl.textContent = document.lastModified;
})();

// Newsletter / Subscribe (with email validation)
(function() {
  const emailInput = document.getElementById('newsletterEmail');
  const subscribeBtn = document.getElementById('subscribeBtn');
  const errorSpan = document.getElementById('signupError');
  if (!emailInput || !subscribeBtn) return;
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errorSpan) { errorSpan.textContent = 'Please enter a valid email.'; errorSpan.classList.add('show'); }
        return;
      }
      alert('Thank you for subscribing!');
      form.reset();
      if (errorSpan) errorSpan.classList.remove('show');
    });
  } else {
    subscribeBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!email) {
        if (errorSpan) { errorSpan.textContent = 'Please enter your email.'; errorSpan.classList.add('show'); }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errorSpan) { errorSpan.textContent = 'Please enter a valid email address.'; errorSpan.classList.add('show'); }
        return;
      }
      alert('Thank you for subscribing!');
      emailInput.value = '';
      if (errorSpan) errorSpan.classList.remove('show');
    });
  }
  emailInput.addEventListener('input', () => {
    if (errorSpan) errorSpan.classList.remove('show');
  });
})();

// Contact Form
(function() {
  const contactForm = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!contactForm) return;
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.style.display = 'none';
    if (successMsg) successMsg.style.display = 'block';
  });
})();

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(q => q.addEventListener('click', () => {
  const answer = q.nextElementSibling;
  answer.classList.toggle('open');
  const icon = q.querySelector('i');
  if (icon) icon.classList.toggle('fa-chevron-up');
}));

// Reveal Animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animated Counters
function animateCounter(el) {
  const target = +(el.getAttribute('data-target') || el.getAttribute('data-count') || 0);
  if (!target) return;
  let current = 0;
  const duration = 2000;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.floor(target * eased);
    el.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(update);
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.counter').forEach(counter => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    });
    observer.observe(counter);
  });
});

// Load Events (only if container exists)
async function loadEvents() {
  const grid = document.getElementById('eventsGrid') || document.getElementById('eventsFullGrid');
  if (!grid) return;
  try {
    const res = await fetch('data/events.json');
    const events = await res.json();
    grid.innerHTML = events.map(e => `
      <div class="event-card reveal">
        <img src="${e.image}" alt="${e.title}" width="320" height="200" loading="lazy">
        <div class="event-details">
          <p class="date"><i class="far fa-calendar-alt"></i> ${e.date}</p>
          <h3>${e.title}</h3>
          <p>${e.description}</p>
        </div>
      </div>
    `).join('');
    document.querySelectorAll('#eventsGrid .reveal, #eventsFullGrid .reveal').forEach(el => revealObserver.observe(el));
  } catch { grid.innerHTML = '<p>Unable to load events.</p>'; }
}
document.addEventListener('DOMContentLoaded', loadEvents);

// Discover Page
async function loadDiscover() {
  const grid = document.getElementById('discoverGrid');
  if (!grid) return;
  try {
    const res = await fetch('data/discover.json');
    const items = await res.json();
    grid.innerHTML = items.map(item => `
      <div class="discover-card reveal">
        <img src="${item.image}" alt="${item.name}" width="300" height="200" loading="lazy">
        <div class="card-content">
          <span class="tag">${item.category}</span>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <a href="#" class="explore-btn">Explore</a>
        </div>
      </div>
    `).join('');
    document.querySelectorAll('#discoverGrid .reveal').forEach(el => revealObserver.observe(el));
  } catch { grid.innerHTML = '<p>Could not load discover items.</p>'; }

  const msg = document.getElementById('visit-message');
  if (msg) {
    const lastVisit = localStorage.getItem('last-visit');
    const now = Date.now();
    if (!lastVisit) msg.innerHTML = '<p>Welcome! Let us show you around Harare.</p>';
    else {
      const days = Math.floor((now - lastVisit) / 86400000);
      msg.innerHTML = days < 1 ? '<p>Back so soon? Awesome!</p>' : `<p>You last visited ${days} day${days>1?'s':''} ago.</p>`;
    }
    localStorage.setItem('last-visit', now);
  }
}
document.addEventListener('DOMContentLoaded', loadDiscover);

// Directory
let members = [];
let gridView = true;
async function initDirectory() {
  const container = document.getElementById('directoryContainer');
  if (!container) return;
  container.innerHTML = '<div class="skeleton-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:2rem;">' +
    Array(6).fill('<div class="skeleton" style="height:250px;"></div>').join('') + '</div>';
  try {
    const res = await fetch('data/members.json');
    members = await res.json();
    renderDirectory(members);
  } catch { container.innerHTML = '<p>Failed to load directory.</p>'; }
}

function renderDirectory(list) {
  const container = document.getElementById('directoryContainer');
  if (!container) return;
  container.className = gridView ? 'grid-view' : 'list-view';
  container.innerHTML = list.map(m => `
    <div class="member-card ${gridView ? 'grid' : 'list'} fade-in-up">
      <img src="images/${m.image}" alt="${m.name}" width="${m.width}" height="${m.height}" loading="lazy">
      <div class="member-info">
        <h3>${m.name}</h3>
        <span class="membership-badge ${getMembershipClass(m.membership)}">${getMembershipClass(m.membership)}</span>
        <p><i class="fas fa-map-marker-alt"></i> ${m.address}</p>
        <p><i class="fas fa-phone"></i> ${m.phone}</p>
        <a href="${m.website}" target="_blank" rel="noopener noreferrer"><i class="fas fa-globe"></i> Website</a>
        <p>${m.description}</p>
      </div>
    </div>
  `).join('');
}

function getMembershipClass(level) {
  if (level === 3) return 'gold';
  if (level === 2) return 'silver';
  if (level === 1) return 'bronze';
  return 'np';
}

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');

if (searchInput) searchInput.addEventListener('input', e => {
  const t = e.target.value.toLowerCase();
  renderDirectory(members.filter(m => m.name.toLowerCase().includes(t) || (m.category && m.category.toLowerCase().includes(t))));
});
if (categoryFilter) categoryFilter.addEventListener('change', e => {
  const cat = e.target.value;
  renderDirectory(cat === 'all' ? members : members.filter(m => m.category === cat));
});
if (gridViewBtn) gridViewBtn.addEventListener('click', () => {
  gridView = true;
  gridViewBtn.classList.add('active');
  listViewBtn.classList.remove('active');
  renderDirectory(members);
});
if (listViewBtn) listViewBtn.addEventListener('click', () => {
  gridView = false;
  listViewBtn.classList.add('active');
  gridViewBtn.classList.remove('active');
  renderDirectory(members);
});
document.addEventListener('DOMContentLoaded', initDirectory);

// Modals
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.open-modal').forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) modal.showModal();
    });
  });
  document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', () => {
      button.closest('dialog').close();
    });
  });

  const timestampField = document.getElementById('timestamp');
  if (timestampField) {
    timestampField.value = new Date().toISOString();
  }
});

// Weather Widget
(async function() {
  const widget = document.getElementById('weatherWidget');
  if (!widget) return;
  const apiKey = "cca19e4e09b8c7a33e195bdb4c634832";
  const city = "Harare";
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error();
    const d = await res.json();
    document.getElementById('weatherTemp').textContent = Math.round(d.main.temp);
    document.getElementById('weatherDesc').textContent = d.weather[0].description;
    document.getElementById('weatherHumidity').textContent = d.main.humidity;
    document.getElementById('weatherWind').textContent = d.wind.speed;
  } catch {
    const tempEl = document.getElementById('weatherTemp');
    const descEl = document.getElementById('weatherDesc');
    const humEl = document.getElementById('weatherHumidity');
    const windEl = document.getElementById('weatherWind');
    if (tempEl) tempEl.textContent = '26';
    if (descEl) descEl.textContent = 'Partly cloudy';
    if (humEl) humEl.textContent = '52';
    if (windEl) windEl.textContent = '3.6';
  }

  const forecastContainer = document.getElementById('weatherForecast');
  if (!forecastContainer) return;
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
    forecastContainer.innerHTML = daily.map(day => `
      <div class="forecast-day">
        <p class="forecast-date">${new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        <p class="forecast-temp">${Math.round(day.main.temp)}°C</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" width="40" height="40" loading="lazy">
        <p class="forecast-desc">${day.weather[0].description}</p>
      </div>
    `).join('');
  } catch {
    forecastContainer.innerHTML = `
      <div class="forecast-day"><p>Mon</p><p>28°C</p></div>
      <div class="forecast-day"><p>Tue</p><p>30°C</p></div>
      <div class="forecast-day"><p>Wed</p><p>27°C</p></div>
    `;
  }
})();

// Member Spotlights
const spotlights = [
  { name: 'TechWave Zimbabwe', blurb: 'Leading software development', img: 'images/tech.png' },
  { name: 'EcoFarm Solutions', blurb: 'Sustainable agriculture', img: 'images/cafe.png' },
  { name: 'FinServe Capital', blurb: 'Innovative financial services', img: 'images/bank.png' }
];
let current = 0;
function renderSpotlight() {
  const carousel = document.getElementById('spotlightCarousel');
  if (!carousel) return;
  const s = spotlights[current];
  carousel.innerHTML = `<div class="spotlight-slide fade-in-up">
    <img src="${s.img}" alt="${s.name}" width="100" height="100" loading="lazy">
    <h3>${s.name}</h3>
    <p>${s.blurb}</p>
  </div>`;
}
if (document.getElementById('spotlightCarousel')) {
  renderSpotlight();
  setInterval(() => { current = (current + 1) % spotlights.length; renderSpotlight(); }, 4000);
}

// Featured Businesses
async function loadFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  try {
    const res = await fetch('data/members.json');
    const data = await res.json();
    const featured = data.filter(m => m.membership >= 3).slice(0, 4);
    grid.innerHTML = featured.map(m => `
      <div class="business-card reveal">
        <img src="images/${m.image}" alt="${m.name}" width="80" height="80" loading="lazy" style="object-fit:contain; margin-bottom:1rem;">
        <h3>${m.name}</h3>
        <p>${m.address}</p>
        <a href="${m.website}" target="_blank" rel="noopener noreferrer">Visit Website →</a>
      </div>
    `).join('');
    document.querySelectorAll('#featuredGrid .reveal').forEach(el => revealObserver.observe(el));
  } catch {}
}
document.addEventListener('DOMContentLoaded', loadFeatured);

// Thank-You Page Data
(function() {
  const container = document.getElementById('results');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const getVal = (key) => params.get(key) || 'Not provided';
  const timestamp = params.get('timestamp');
  const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : 'Not provided';
  container.innerHTML = `
    <div class="result-item"><span>First Name</span><strong>${getVal('firstName')}</strong></div>
    <div class="result-item"><span>Last Name</span><strong>${getVal('lastName')}</strong></div>
    <div class="result-item"><span>Email</span><strong>${getVal('email')}</strong></div>
    <div class="result-item"><span>Phone</span><strong>${getVal('phone')}</strong></div>
    <div class="result-item"><span>Business</span><strong>${getVal('business')}</strong></div>
    <div class="result-item"><span>Submitted</span><strong>${formattedDate}</strong></div>
  `;
})();