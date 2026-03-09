const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");

    if(navMenu.classList.contains("open")){
        menuBtn.textContent = "✖";
    } else {
        menuBtn.textContent = "☰";
    }
});


document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;


/* COURSE FILTERING */

const filterButtons = document.querySelectorAll(".filters button");
const courses = document.querySelectorAll(".course");

filterButtons.forEach(button => {

button.addEventListener("click", () => {

filterButtons.forEach(btn => btn.classList.remove("active"));
button.classList.add("active");

const filter = button.dataset.filter;

courses.forEach(course => {

if(filter === "all" || course.classList.contains(filter)){
course.classList.remove("hidden");
}
else{
course.classList.add("hidden");
}

});

});

});

/* SCROLL REVEAL */

const revealElements = document.querySelectorAll("section, .card");

const observer = new IntersectionObserver((entries) => {

entries.forEach(entry => {

if(entry.isIntersecting){
entry.target.classList.add("show");
}

});

},{
threshold:0.15
});

revealElements.forEach(el => {
el.classList.add("hidden-section");
observer.observe(el);
});

/* TYPING EFFECT */

const words = [
"HTML",
"CSS",
"JavaScript",
"Frontend Development"
];

let wordIndex = 0;
let charIndex = 0;
let currentWord = "";
let isDeleting = false;

const typingElement = document.getElementById("typing-text");

function type(){

currentWord = words[wordIndex];

if(isDeleting){
charIndex--;
}else{
charIndex++;
}

typingElement.textContent = currentWord.substring(0,charIndex);

if(!isDeleting && charIndex === currentWord.length){
isDeleting = true;
setTimeout(type,1000);
return;
}

if(isDeleting && charIndex === 0){
isDeleting = false;
wordIndex++;

if(wordIndex === words.length){
wordIndex = 0;
}
}

setTimeout(type, isDeleting ? 60 : 120);

}

type();