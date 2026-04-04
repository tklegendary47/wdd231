// Footer info
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("modified").textContent = document.lastModified;

// Get form data from URL
const params = new URLSearchParams(window.location.search);

// Helper to avoid null values
function getValue(key) {
  return params.get(key) || "Not provided";
}

// Format timestamp nicely
const rawDate = params.get("timestamp");
let formattedDate = "N/A";

if (rawDate) {
  formattedDate = new Date(rawDate).toLocaleString();
}

// Inject into page
document.getElementById("results").innerHTML = `
  <div class="result-item">
    <span>First Name</span>
    <strong>${getValue("fname")}</strong>
  </div>

  <div class="result-item">
    <span>Last Name</span>
    <strong>${getValue("lname")}</strong>
  </div>

  <div class="result-item">
    <span>Email</span>
    <strong>${getValue("email")}</strong>
  </div>

  <div class="result-item">
    <span>Phone</span>
    <strong>${getValue("phone")}</strong>
  </div>

  <div class="result-item">
    <span>Business</span>
    <strong>${getValue("business")}</strong>
  </div>

  <div class="result-item">
    <span>Membership</span>
    <strong>${getValue("membership")}</strong>
  </div>

  <div class="result-item">
    <span>Submitted</span>
    <strong>${formattedDate}</strong>
  </div>
`;