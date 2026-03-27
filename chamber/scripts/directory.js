const url = "data/members.json";
const cards = document.querySelector("#members");


getMembers();
function getMembership(level) {
    if (level === 3) return "gold";
    if (level === 2) return "silver";
    return "member";
    
}

function displayMembers(members) {

    cards.innerHTML = ""; // clear before rendering

    members.forEach((member) => {

      const card = document.createElement("section");
card.classList.add("card-hidden");

        const membershipClass = getMembership(member.membership);

        card.innerHTML = `
            <div class="card-top">
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
                
                <div>
                    <h3>${member.name}</h3>
                    <span class="badge ${membershipClass}">
                        ${membershipClass}
                    </span>
                </div>
            </div>

            <p class="address">${member.address}</p>
            <p class="phone">${member.phone}</p>

            <a href="${member.website}" target="_blank">Visit Website →</a>
        `;

        cards.appendChild(card);
        // trigger animation
setTimeout(() => {
    card.classList.add("card-show");
}, 100);
    });

}

/* GRID LIST TOGGLE */

const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");

gridButton.addEventListener("click", () => {

cards.classList.add("grid");
cards.classList.remove("list");

});

listButton.addEventListener("click", () => {

cards.classList.add("list");
cards.classList.remove("grid");

});


/* NAV MENU */

const menuButton = document.querySelector("#menuButton");
const navMenu = document.querySelector("#navMenu");

menuButton.addEventListener("click", () => {

    navMenu.classList.toggle("open");

    // flip button
    menuButton.classList.toggle("open");

});

const searchInput = document.querySelector("#search");
const filterSelect = document.querySelector("#filterLevel");

let allMembers = [];

async function getMembers() {
    const response = await fetch(url);
    const data = await response.json();

    data.sort((a, b) => b.membership - a.membership);

    allMembers = data;

    displayMembers(data);

    const goldMember = data.find(m => m.membership === 3);
    displayFeatured(goldMember);
}

function displayFeatured(member) {
    const featured = document.querySelector("#featured");

    if (!member) return;

    featured.innerHTML = `
        <div class="featured-card">
            <img src="images/${member.image}" alt="${member.name}">
            <div>
                <h2>🌟 Featured Member</h2>
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <a href="${member.website}" target="_blank">Visit Website →</a>
            </div>
        </div>
    `;
}



gridButton.addEventListener("click", () => {
    cards.classList.add("grid");
    cards.classList.remove("list");

    gridButton.classList.add("active");
    listButton.classList.remove("active");
});

listButton.addEventListener("click", () => {
    cards.classList.add("list");
    cards.classList.remove("grid");

    listButton.classList.add("active");
    gridButton.classList.remove("active");
});


searchInput.addEventListener("input", applyFilters);
filterSelect.addEventListener("change", applyFilters);

function applyFilters() {

    let filtered = allMembers;

    const searchTerm = searchInput.value.toLowerCase();
    const level = filterSelect.value;

    if (searchTerm) {
        filtered = filtered.filter(member =>
            member.name.toLowerCase().includes(searchTerm)
        );
    }

    if (level !== "all") {
        filtered = filtered.filter(member =>
            member.membership == level
        );
    }

    displayMembers(filtered);
}

/* FOOTER */

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#modified").textContent = document.lastModified;