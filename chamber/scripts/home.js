const apiKey = "cca19e4e09b8c7a33e195bdb4c634832";
const lat = -17.8252; // Harare
const lon = 31.0335;

const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

async function getWeather() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data); // 👈 ADD THIS

    if (!data.list) {
      console.error("Weather data failed:", data);
      return;
    }

    displayCurrent(data);
    displayForecast(data);

  } catch (error) {
    console.error("Fetch error:", error);
  }
}

const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

if (menuButton && navMenu) {
  menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("open");
    navMenu.classList.toggle("open");
  });
}

function displayCurrent(data) {
  const current = data.list[0];
document.querySelector("#current-weather").innerHTML = `
  <p><strong>🌡 ${current.main.temp}°C</strong></p>
  <p>☁ ${current.weather[0].description}</p>
`;
}

function displayForecast(data) {
  const forecastDiv = document.querySelector("#forecast");
  forecastDiv.innerHTML = "";

  const days = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  days.slice(0, 3).forEach(day => {
forecastDiv.innerHTML += `
  <p>📅 ${new Date(day.dt_txt).toDateString()} — ${day.main.temp}°C</p>
`;
  });
}

getWeather();

const spotlightContainer = document.querySelector("#spotlight-container");

async function loadSpotlights() {
  const response = await fetch("data/members.json");
  const members = await response.json();

  // 1. Filter gold + silver
  const filtered = members.filter(member => member.membership >= 2);

  // 2. Shuffle randomly
  const shuffled = filtered.sort(() => 0.5 - Math.random());

  // 3. Pick 2 or 3 members randomly
  const count = Math.random() > 0.5 ? 3 : 2;
  const selected = shuffled.slice(0, count);

  displaySpotlights(selected);
}

function displaySpotlights(members) {
  spotlightContainer.innerHTML = "";

  members.forEach(member => {

    let level = "";
    if (member.membership === 3) level = "Gold Member";
    else if (member.membership === 2) level = "Silver Member";

    spotlightContainer.innerHTML += `
      <div class="spotlight-card">
        <img src="images/${member.image}" alt="${member.name} logo">
        
        <h3>${member.name}</h3>
        <p>${level}</p>
        
        <p>${member.address}</p>
        <p>${member.phone}</p>
        
        <a href="${member.website}" target="_blank">Visit Website</a>
      </div>
    `;
  });
}

loadSpotlights();


document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#modified").textContent = document.lastModified;


