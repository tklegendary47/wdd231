// ============================================
// TALENTTRACK - MAIN APPLICATION MODULE
// WDD 231 Final Project
// Demonstrates Fetch API with async/await and try...catch
// ============================================

import { fetchJobsData, getJobsData, filterJobs, getBookmarks, saveBookmarks, toggleBookmark } from './jobs.js';
import { initSlideshow, changeSlide, resetInterval, stopSlideshow } from './slideshow.js';


if ('loading' in HTMLImageElement.prototype) {
    // Browser supports lazy loading natively
    console.log('✅ Native lazy loading supported');
} else {
    // Fallback for older browsers
    console.log('⚠️ Lazy loading polyfill needed');
}

let currentPage = 'home';
let currentFilters = { type: '', location: '', search: '', showBookmarked: false };
let bookmarkedJobs = getBookmarks();
let jobsData = [];

// ============================================
// URL PARAMETER CHECK
// ============================================
function getPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') || 'home';
}

// ============================================
// FOOTER DYNAMIC CONTENT
// ============================================
function updateFooterInfo() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    const modifiedSpan = document.getElementById('modified');
    if (modifiedSpan) {
        const lastModified = new Date(document.lastModified);
        modifiedSpan.textContent = lastModified.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }
}

// ============================================
// SLIDE CONTENT DATA
// ============================================
const slideContentData = [
    { title: "Find Your Dream Career", text: "Join thousands of professionals who found their perfect match", btn: "Explore Jobs →", nav: "jobs" },
    { title: "AI-Powered Matching", text: "Smart recommendations tailored to your unique skills", btn: "Find Matches →", nav: "jobs" },
    { title: "Remote Opportunities", text: "Work from anywhere with flexible, remote positions", btn: "View Remote Jobs →", nav: "jobs" },
    { title: "Top Companies Hiring", text: "Connect with industry leaders and innovative startups", btn: "See Companies →", nav: "jobs" },
    { title: "Career Growth Resources", text: "Access tools and insights to accelerate your career", btn: "Get Started →", nav: "contact" }
];

function injectSlideContent() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (index < slideContentData.length) {
            const content = slideContentData[index];
            const container = slide.querySelector('.slide-text-container');
            if (container) {
                const div = document.createElement('div');
                div.className = 'slide-text';
                div.innerHTML = `
                    <h2>${content.title}</h2>
                    <p>${content.text}</p>
                    <button class="cta-button" data-nav="${content.nav}">${content.btn}</button>
                `;
                container.appendChild(div);
            }
        }
    });
}

// ============================================
// GLOBAL FUNCTIONS
// ============================================
window.changeSlide = changeSlide;

window.toggleMobileMenu = function () {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;
    const isActive = hamburger.classList.contains('active');
    if (!isActive) {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    } else {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
};

window.closeMobileMenu = function () {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
};

// ============================================
// BOOKMARK TOGGLE — No page scroll
// ============================================
window.toggleBookmark = function (jobId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    bookmarkedJobs = toggleBookmark(jobId, bookmarkedJobs);
    saveBookmarks(bookmarkedJobs);
    updateBookmarkButton(jobId);
};

function updateBookmarkButton(jobId) {
    const isBookmarked = bookmarkedJobs.includes(jobId);
    document.querySelectorAll(`.bookmark-btn[data-job-id="${jobId}"]`).forEach(btn => {
        if (isBookmarked) {
            btn.classList.add('bookmarked');
            btn.innerHTML = '★';
            btn.setAttribute('aria-label', 'Remove bookmark');
        } else {
            btn.classList.remove('bookmarked');
            btn.innerHTML = '☆';
            btn.setAttribute('aria-label', 'Bookmark job');
        }
    });
}

// ============================================
// NAVIGATION — With proper active state
// ============================================
window.navigateTo = function (page) {
    currentPage = page;
    updateNavActiveState(page);

    const heroSection = document.getElementById('heroSection');
    const dynamicContent = document.getElementById('dynamicContent');

    if (page === 'home') {
        heroSection.style.display = 'block';
        if (dynamicContent) dynamicContent.innerHTML = renderHome();
        document.title = 'TalentTrack - Smart Job Board';
        resetInterval();
    } else if (page === 'jobs') {
        heroSection.style.display = 'block';
        if (dynamicContent) dynamicContent.innerHTML = renderJobsPage();
        document.title = 'Browse Jobs - TalentTrack';
        resetInterval();
    } else if (page === 'contact') {
        heroSection.style.display = 'none';
        if (dynamicContent) dynamicContent.innerHTML = renderContactPage();
        document.title = 'Apply - TalentTrack';
        stopSlideshow();
    }

    // Update URL without page reload
    if (page === 'home') {
        history.replaceState(null, '', 'index.html');
    } else {
        history.replaceState(null, '', `index.html?page=${page}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();
};

// ============================================
// REFRESH CONTENT — No scroll (for filters/bookmarks)
// ============================================
function refreshContent() {
    const dynamicContent = document.getElementById('dynamicContent');
    if (!dynamicContent) return;

    if (currentPage === 'home') {
        dynamicContent.innerHTML = renderHome();
    } else if (currentPage === 'jobs') {
        dynamicContent.innerHTML = renderJobsPage();
    } else if (currentPage === 'contact') {
        dynamicContent.innerHTML = renderContactPage();
    }
}

// ============================================
// UPDATE ACTIVE STATE — All nav links
// ============================================
function updateNavActiveState(page) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('data-page');
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (linkPage && linkPage === page) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    document.querySelectorAll('.mobile-menu-content a').forEach(link => {
        const linkPage = link.getAttribute('data-page');
        link.classList.remove('active');
        if (linkPage && linkPage === page) {
            link.classList.add('active');
        }
    });
}

// ============================================
// FILTER FUNCTIONS — No scroll
// ============================================
window.updateFilter = function (type, value) {
    currentFilters[type] = value;
    refreshContent();
};

window.resetFilters = function () {
    currentFilters = { type: '', location: '', search: '', showBookmarked: false };
    refreshContent();
};

// ============================================
// MODAL FUNCTIONS
// ============================================
window.showJobDetails = function (jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;
    const isBookmarked = bookmarkedJobs.includes(jobId);
    const modalHtml = `<div class="modal active" id="jobModal" onclick="closeModalOnBackground(event)" role="dialog" aria-modal="true"><div class="modal-content"><button class="modal-close" onclick="closeModal()" aria-label="Close modal">&times;</button><h2 style="margin-bottom:0.5rem;font-size:1.75rem">${job.title}</h2><p style="color:var(--primary-color);font-weight:600;margin-bottom:1rem;font-size:1.2rem">${job.company}</p><div class="job-meta" style="margin-bottom:1.5rem"><span class="badge">${job.type}</span><span class="badge">📍 ${job.location}</span><span class="badge">💰 ${job.salary}</span></div><h3>Job Description</h3><p style="margin-bottom:1.5rem;line-height:1.7">${job.description}</p><h3>Requirements</h3><ul style="margin:0 0 2rem 1.5rem;line-height:1.8"><li>Relevant experience in ${job.title}</li><li>Strong communication skills</li><li>Bachelor's degree or equivalent</li></ul><div style="display:flex;gap:1rem;flex-wrap:wrap"><button class="cta-button" onclick="navigateTo('contact');closeModal()">Apply Now</button><button class="btn-reset" style="background:transparent;color:var(--primary-color);border:2px solid var(--primary-color);margin:0" onclick="toggleBookmark(${job.id});closeModal()">${isBookmarked ? '★ Bookmarked' : '☆ Save Job'}</button></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
};

window.closeModal = function () {
    const modal = document.getElementById('jobModal');
    if (modal) { modal.remove(); document.body.style.overflow = ''; }
};

window.closeModalOnBackground = function (event) {
    if (event.target.id === 'jobModal') closeModal();
};

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderJobCard(job) {
    const isBookmarked = bookmarkedJobs.includes(job.id);
    return `<article class="job-card" onclick="showJobDetails(${job.id})"><button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-job-id="${job.id}" onclick="toggleBookmark(${job.id}, event)" aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark job'}">${isBookmarked ? '★' : '☆'}</button><h3 class="job-title">${job.title}</h3><div class="company-name">${job.company}</div><div class="job-meta"><span class="badge">${job.type}</span><span class="badge">📍 ${job.location}</span><span class="badge">💰 ${job.salary}</span></div><p class="job-description">${job.description.substring(0, 120)}...</p></article>`;
}

function renderHome() {
    const featuredJobs = jobsData.slice(0, 6);
    return `
        <section>
            <div class="jobs-header">
                <h2 style="font-size: 1.75rem; font-weight: 600;">Featured Opportunities</h2>
            </div>
            <div class="jobs-grid">
                ${featuredJobs.map(job => renderJobCard(job)).join('')}
            </div>
            <div style="text-align: center; margin-top: 3rem;">
                <button class="cta-button" onclick="navigateTo('jobs')">View All ${jobsData.length} Jobs →</button>
            </div>
        </section>
    `;
}

function renderJobsPage() {
    const filtered = filterJobs(jobsData, currentFilters);
    const showBookmarkedOnly = currentFilters.showBookmarked || false;
    const displayJobs = showBookmarkedOnly ? filtered.filter(job => bookmarkedJobs.includes(job.id)) : filtered;

    setTimeout(() => {
        const ft = document.getElementById('filterType');
        const fl = document.getElementById('filterLocation');
        const fs = document.getElementById('filterSearch');
        const cb = document.getElementById('showBookmarkedOnly');

        if (ft) ft.value = currentFilters.type || '';
        if (fl) fl.value = currentFilters.location || '';
        if (fs) fs.value = currentFilters.search || '';
        if (cb) {
            cb.checked = currentFilters.showBookmarked || false;
            cb.onchange = function (e) {
                e.preventDefault();
                currentFilters.showBookmarked = this.checked;
                refreshContent();
            };
        }
    }, 0);

    return `<section class="filters-section" aria-label="Job filters"><h2 class="filters-title">🔍 Filter Opportunities</h2><div class="filters-grid"><div class="filter-group"><label for="filterType">Job Type</label><select id="filterType" onchange="updateFilter('type',this.value)"><option value="">All Types</option><option value="Full-time" ${currentFilters.type === 'Full-time' ? 'selected' : ''}>Full-time</option><option value="Part-time" ${currentFilters.type === 'Part-time' ? 'selected' : ''}>Part-time</option><option value="Contract" ${currentFilters.type === 'Contract' ? 'selected' : ''}>Contract</option><option value="Hybrid" ${currentFilters.type === 'Hybrid' ? 'selected' : ''}>Hybrid</option><option value="Remote" ${currentFilters.type === 'Remote' ? 'selected' : ''}>Remote</option></select></div><div class="filter-group"><label for="filterLocation">Location</label><input type="text" id="filterLocation" placeholder="City or 'Remote'" value="${currentFilters.location || ''}" onkeyup="updateFilter('location',this.value)"></div><div class="filter-group"><label for="filterSearch">Search</label><input type="text" id="filterSearch" placeholder="Job title or company" value="${currentFilters.search || ''}" onkeyup="updateFilter('search',this.value)"></div></div><button class="btn-reset" onclick="resetFilters()">Reset Filters</button></section><section><div class="jobs-header"><div class="jobs-count" role="status" aria-live="polite">Found ${displayJobs.length} position${displayJobs.length !== 1 ? 's' : ''}</div><div class="bookmark-filter"><input type="checkbox" id="showBookmarkedOnly" ${currentFilters.showBookmarked ? 'checked' : ''}><label for="showBookmarkedOnly">Show bookmarked only</label></div></div><div class="jobs-grid">${displayJobs.length > 0 ? displayJobs.map(job => renderJobCard(job)).join('') : '<p style="text-align:center;grid-column:1/-1;padding:3rem">No jobs match your criteria. Try adjusting your filters.</p>'}</div></section>`;
}

function renderContactPage() {
    return `<section class="contact-section"><h2 style="margin-bottom:2rem;font-size:2rem;font-weight:600">Apply for a Position</h2><form method="GET" action="application-success.html"><div class="form-group"><label for="fullName">Full Name *</label><input type="text" id="fullName" name="fullName" required></div><div class="form-group"><label for="email">Email Address *</label><input type="email" id="email" name="email" required></div><div class="form-group"><label for="phone">Phone Number</label><input type="tel" id="phone" name="phone"></div><div class="form-group"><label for="jobPosition">Select Position *</label><select id="jobPosition" name="jobPosition" required><option value="">Choose a position...</option>${jobsData.map(job => `<option value="${job.title} at ${job.company}">${job.title} - ${job.company}</option>`).join('')}</select></div><div class="form-group"><label for="experience">Years of Experience</label><select id="experience" name="experience"><option value="0-1">0-1 years</option><option value="2-4">2-4 years</option><option value="5-7">5-7 years</option><option value="8+">8+ years</option></select></div><div class="form-group"><label for="message">Cover Letter</label><textarea id="message" name="message" rows="5" placeholder="Tell us why you're a great fit..."></textarea></div><button type="submit" class="btn-submit">Submit Application</button></form></section>`;
}

function renderCurrentPage() {
    refreshContent();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    document.querySelector('.hamburger')?.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleMobileMenu();
    });

    document.querySelectorAll('.nav-links a').forEach(l => {
        l.addEventListener('click', (e) => {
            const p = e.currentTarget.getAttribute('data-page');
            if (p) {
                e.preventDefault();
                navigateTo(p);
            }
        });
    });

    document.querySelectorAll('.mobile-menu-content a').forEach(l => {
        l.addEventListener('click', (e) => {
            const p = e.currentTarget.getAttribute('data-page');
            if (p) {
                e.preventDefault();
                navigateTo(p);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('cta-button')) {
            const p = e.target.dataset.nav;
            if (p) navigateTo(p);
        }
    });

    document.querySelector('.slide-nav.prev')?.addEventListener('click', (e) => {
        e.preventDefault();
        changeSlide(-1);
    });

    document.querySelector('.slide-nav.next')?.addEventListener('click', (e) => {
        e.preventDefault();
        changeSlide(1);
    });

    document.addEventListener('click', (e) => {
        const mm = document.getElementById('mobileMenu');
        const hb = document.querySelector('.hamburger');
        if (mm?.classList.contains('active') && !mm.contains(e.target) && !hb?.contains(e.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeMobileMenu();
        }
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function initializeApp() {
    try {
        console.log('Fetching jobs...');
        jobsData = await fetchJobsData();
        console.log(`Loaded ${jobsData.length} jobs`);
    } catch (error) {
        console.error('Init error:', error.message);
        jobsData = getJobsData();
    }

    injectSlideContent();
    initSlideshow();
    setupEventListeners();

    const pageFromURL = getPageFromURL();
    navigateTo(pageFromURL);

    updateFooterInfo();
}

document.addEventListener('DOMContentLoaded', initializeApp);

export { renderCurrentPage };