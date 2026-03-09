/* MENU TOGGLE */

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


/* FOOTER INFO */

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;


/* COURSE DATA (Rubric Requirement) */

const courses = [

{code:"WDD130", subject:"wdd", credits:2, completed:true},
{code:"WDD131", subject:"wdd", credits:2, completed:true},
{code:"WDD231", subject:"wdd", credits:2, completed:false},
{code:"CSE110", subject:"cse", credits:2, completed:true},
{code:"CSE111", subject:"cse", credits:2, completed:false},
{code:"CSE210", subject:"cse", credits:2, completed:false}

];


/* DISPLAY COURSES */

const courseContainer = document.querySelector(".course-list");
const creditDisplay = document.querySelector("#creditTotal");

function displayCourses(courseList){

courseContainer.innerHTML = "";

courseList.forEach(course => {

const courseCard = document.createElement("a");

courseCard.classList.add("course", course.subject);

if(course.completed){
courseCard.classList.add("completed");
}

courseCard.innerHTML = `
<span class="course-icon">📚</span>
<span class="course-title">${course.code}</span>
`;

courseContainer.appendChild(courseCard);

});

/* CREDIT CALCULATION (reduce requirement) */

const totalCredits = courseList.reduce((total, course) => {
return total + course.credits;
},0);

creditDisplay.textContent = totalCredits;

}


/* FILTERING */

const filterButtons = document.querySelectorAll(".filters button");

filterButtons.forEach(button => {

button.addEventListener("click", () => {

filterButtons.forEach(btn => btn.classList.remove("active"));
button.classList.add("active");

const filter = button.dataset.filter;

if(filter === "all"){
displayCourses(courses);
}
else{
const filteredCourses = courses.filter(course => course.subject === filter);
displayCourses(filteredCourses);
}

});

});


/* INITIAL LOAD */

displayCourses(courses);


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