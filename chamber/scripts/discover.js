import { places } from "../data/discover.mjs";

const grid = document.getElementById("discoverGrid");

// CREATE CARDS
places.forEach(place => {
  const card = document.createElement("div");
  card.classList.add("card", "discover-card");

  card.innerHTML = `
    <h2>${place.name}</h2>
    <figure>
      <img src="${place.image}" alt="${place.name}" loading="lazy">
    </figure>
    <address>${place.address}</address>
    <p>${place.description}</p>
    <button>Learn More</button>
  `;

  grid.appendChild(card);
});


// ===== VISIT MESSAGE (localStorage) =====
const message = document.getElementById("visitMessage");

const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

if (!lastVisit) {
  message.textContent = "Welcome! Let us know if you have any questions.";
} else {
  const days = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));

  if (days < 1) {
    message.textContent = "Back so soon! Awesome!";
  } else if (days === 1) {
    message.textContent = "You last visited 1 day ago.";
  } else {
    message.textContent = `You last visited ${days} days ago.`;
  }
}

localStorage.setItem("lastVisit", now);


// ===== INTERSECTION ANIMATION =====
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));

document.addEventListener("click", function(e) {
  if (e.target.tagName === "BUTTON") {
    const circle = document.createElement("span");
    const diameter = Math.max(e.target.clientWidth, e.target.clientHeight);

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.offsetX - diameter / 2}px`;
    circle.style.top = `${e.offsetY - diameter / 2}px`;

    e.target.appendChild(circle);

    setTimeout(() => circle.remove(), 600);
  }
});