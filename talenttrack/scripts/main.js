// ============================================
// TALENTTRACK - MAIN APPLICATION MODULE
// WDD 231 Final Project
// FIXED: Slideshow Buttons Fully Functional
// ============================================

import { jobsData, filterJobs, getBookmarks, saveBookmarks, toggleBookmark } from './jobs.js';
import { initSlideshow, showSlide, changeSlide, resetInterval, stopSlideshow } from './slideshow.js';

let currentPage = 'home';
let currentFilters = { type: '', location: '', search: '' };
let bookmarkedJobs = getBookmarks();
let slideInterval = null;

// ============================================
// FOOTER DYNAMIC CONTENT FUNCTION
// ============================================
function updateFooterInfo() {
    // Set current year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Set last modified date
    const modifiedSpan = document.getElementById('modified');
    if (modifiedSpan) {
        const lastModified = new Date(document.lastModified);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        modifiedSpan.textContent = lastModified.toLocaleDateString('en-US', options);
    }
}


// ============================================
// EXPOSE SLIDESHOW FUNCTIONS TO GLOBAL SCOPE
// ============================================
window.changeSlide = changeSlide;
window.showSlide = showSlide;
window.resetInterval = resetInterval;
window.stopSlideshow = stopSlideshow;

// ============================================
// FIXED: Mobile Menu Functions
// ============================================
window.toggleMobileMenu = function() {
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

window.closeMobileMenu = function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!hamburger || !mobileMenu) return;
    
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
};

// ============================================
// Bookmark Functions
// ============================================
window.toggleBookmark = function(jobId) {
    bookmarkedJobs = toggleBookmark(jobId, bookmarkedJobs);
    saveBookmarks(bookmarkedJobs);
    renderCurrentPage();
};

// ============================================
// Navigation
// ============================================
window.navigateTo = function(page) {
    currentPage = page;
    
    // Update desktop nav
    document.querySelectorAll('.nav-link').forEach(link => {
        const isActive = link.dataset.page === page;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-current', isActive ? 'page' : null);
    });
    
    // Update mobile nav
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        const isActive = link.dataset.page === page;
        link.classList.toggle('active', isActive);
    });
    
    const mainContent = document.getElementById('mainContent');
    const heroSection = document.getElementById('heroSection');
    
    if (page === 'home') {
        heroSection.style.display = 'block';
        mainContent.innerHTML = renderHome();
        document.title = 'TalentTrack - Smart Job Board for Modern Job Seekers';
        if (typeof resetInterval === 'function') resetInterval();
    } else if (page === 'jobs') {
        heroSection.style.display = 'block';
        mainContent.innerHTML = renderJobsPage();
        document.title = 'Browse Jobs - TalentTrack';
        if (typeof resetInterval === 'function') resetInterval();
    } else if (page === 'contact') {
        heroSection.style.display = 'none';
        mainContent.innerHTML = renderContactPage();
        document.title = 'Apply - TalentTrack';
        if (typeof stopSlideshow === 'function') stopSlideshow();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();
};

// ============================================
// Filter Functions
// ============================================
window.updateFilter = function(type, value) {
    currentFilters[type] = value;
    renderCurrentPage();
};

window.resetFilters = function() {
    currentFilters = { type: '', location: '', search: '' };
    renderCurrentPage();
};

// ============================================
// Modal Functions
// ============================================
window.showJobDetails = function(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;
    
    const isBookmarked = bookmarkedJobs.includes(jobId);
    
    const modalHtml = `
        <div class="modal active" id="jobModal" onclick="closeModalOnBackground(event)" role="dialog" aria-modal="true" aria-label="Job details for ${job.title}">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()" aria-label="Close modal">&times;</button>
                <h2 style="margin-bottom: 0.5rem; font-size: 1.75rem;">${job.title}</h2>
                <p style="color: var(--primary-color); font-weight: 600; margin-bottom: 1rem; font-size: 1.2rem;">${job.company}</p>
                <div class="job-meta" style="margin-bottom: 1.5rem;">
                    <span class="badge">${job.type}</span>
                    <span class="badge">📍 ${job.location}</span>
                    <span class="badge">💰 ${job.salary}</span>
                </div>
                <h3 style="margin-bottom: 0.75rem;">Job Description</h3>
                <p style="margin-bottom: 1.5rem; line-height: 1.7;">${job.description}</p>
                <h3 style="margin-bottom: 0.75rem;">Requirements</h3>
                <ul style="margin: 0 0 2rem 1.5rem; line-height: 1.8;">
                    <li>Relevant experience in ${job.title}</li>
                    <li>Strong communication and teamwork skills</li>
                    <li>Bachelor's degree or equivalent experience</li>
                    <li>Passion for innovation and continuous learning</li>
                </ul>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button class="cta-button" onclick="navigateTo('contact'); closeModal();" style="font-size: 1rem; padding: 0.75rem 2rem;">Apply Now</button>
                    <button class="btn-reset" style="background: transparent; color: var(--primary-color); border: 2px solid var(--primary-color); margin: 0;" 
                            onclick="toggleBookmark(${job.id}); closeModal();">
                        ${isBookmarked ? '★ Bookmarked' : '☆ Save Job'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
    const modal = document.getElementById('jobModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
};

window.closeModalOnBackground = function(event) {
    if (event.target.id === 'jobModal') closeModal();
};

// ============================================
// Render Functions
// ============================================
function renderJobCard(job) {
    const isBookmarked = bookmarkedJobs.includes(job.id);
    return `
        <article class="job-card" onclick="showJobDetails(${job.id})">
            <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                    onclick="event.stopPropagation(); toggleBookmark(${job.id})"
                    aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark job'}">
                ${isBookmarked ? '★' : '☆'}
            </button>
            <h3 class="job-title">${job.title}</h3>
            <div class="company-name">${job.company}</div>
            <div class="job-meta">
                <span class="badge">${job.type}</span>
                <span class="badge">📍 ${job.location}</span>
                <span class="badge">💰 ${job.salary}</span>
            </div>
            <p class="job-description">${job.description.substring(0, 120)}...</p>
        </article>
    `;
}

function renderHome() {
    const featuredJobs = jobsData.slice(0, 6);
    return `
        <section style="text-align: center; margin-bottom: 3rem;">
            <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: 700;">Welcome to TalentTrack</h1>
            <p style="color: var(--text-muted); font-size: 1.2rem; max-width: 700px; margin: 0 auto;">Your intelligent job matching platform connecting top talent with exceptional opportunities</p>
        </section>
        <section>
            <div class="jobs-header">
                <h2 style="font-size: 1.75rem; font-weight: 600;">Featured Opportunities</h2>
            </div>
            <div class="jobs-grid">
                ${featuredJobs.map(job => renderJobCard(job)).join('')}
            </div>
            <div style="text-align: center; margin-top: 3rem;">
                <button class="cta-button" onclick="navigateTo('jobs')" style="font-size: 1rem;">View All ${jobsData.length} Jobs →</button>
            </div>
        </section>
    `;
}

function renderJobsPage() {
    const filtered = filterJobs(jobsData, currentFilters);
    const showBookmarkedOnly = document.getElementById('showBookmarkedOnly')?.checked || false;
    const displayJobs = showBookmarkedOnly ? filtered.filter(job => bookmarkedJobs.includes(job.id)) : filtered;
    
    setTimeout(() => {
        const filterType = document.getElementById('filterType');
        const filterLocation = document.getElementById('filterLocation');
        const filterSearch = document.getElementById('filterSearch');
        
        if (filterType) filterType.value = currentFilters.type;
        if (filterLocation) filterLocation.value = currentFilters.location;
        if (filterSearch) filterSearch.value = currentFilters.search;
    }, 0);
    
    return `
        <section class="filters-section" aria-label="Job filters">
            <h2 class="filters-title">🔍 Filter Opportunities</h2>
            <div class="filters-grid">
                <div class="filter-group">
                    <label for="filterType">Job Type</label>
                    <select id="filterType" onchange="updateFilter('type', this.value)" aria-label="Filter by job type">
                        <option value="">All Types</option>
                        <option value="Full-time" ${currentFilters.type === 'Full-time' ? 'selected' : ''}>Full-time</option>
                        <option value="Part-time" ${currentFilters.type === 'Part-time' ? 'selected' : ''}>Part-time</option>
                        <option value="Contract" ${currentFilters.type === 'Contract' ? 'selected' : ''}>Contract</option>
                        <option value="Hybrid" ${currentFilters.type === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
                        <option value="Remote" ${currentFilters.type === 'Remote' ? 'selected' : ''}>Remote</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="filterLocation">Location</label>
                    <input type="text" id="filterLocation" placeholder="City or 'Remote'" value="${currentFilters.location}" onkeyup="updateFilter('location', this.value)" aria-label="Filter by location">
                </div>
                <div class="filter-group">
                    <label for="filterSearch">Search</label>
                    <input type="text" id="filterSearch" placeholder="Job title or company" value="${currentFilters.search}" onkeyup="updateFilter('search', this.value)" aria-label="Search jobs">
                </div>
            </div>
            <button class="btn-reset" onclick="resetFilters()" aria-label="Reset all filters">Reset Filters</button>
        </section>
        
        <section>
            <div class="jobs-header">
                <div class="jobs-count" role="status" aria-live="polite">Found ${displayJobs.length} position${displayJobs.length !== 1 ? 's' : ''}</div>
                <div class="bookmark-filter">
                    <input type="checkbox" id="showBookmarkedOnly" onchange="renderCurrentPage()" ${showBookmarkedOnly ? 'checked' : ''} aria-label="Show bookmarked jobs only">
                    <label for="showBookmarkedOnly">Show bookmarked only</label>
                </div>
            </div>
            
            <div class="jobs-grid">
                ${displayJobs.length > 0 ? displayJobs.map(job => renderJobCard(job)).join('') : 
                  '<p style="text-align: center; grid-column: 1/-1; padding: 3rem;">No jobs match your criteria. Try adjusting your filters.</p>'}
            </div>
        </section>
    `;
}

function renderContactPage() {
    return `
        <section class="contact-section">
            <h2 style="margin-bottom: 2rem; font-size: 2rem; font-weight: 600;">Apply for a Position</h2>
            <form id="applicationForm" method="GET" action="application-success.html">
                <div class="form-group">
                    <label for="fullName">Full Name *</label>
                    <input type="text" id="fullName" name="fullName" required aria-required="true">
                </div>
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" required aria-required="true">
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone">
                </div>
                <div class="form-group">
                    <label for="jobPosition">Select Position *</label>
                    <select id="jobPosition" name="jobPosition" required aria-required="true">
                        <option value="">Choose a position...</option>
                        ${jobsData.map(job => `<option value="${job.title} at ${job.company}">${job.title} - ${job.company}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="experience">Years of Experience</label>
                    <select id="experience" name="experience">
                        <option value="0-1">0-1 years</option>
                        <option value="2-4">2-4 years</option>
                        <option value="5-7">5-7 years</option>
                        <option value="8+">8+ years</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="message">Cover Letter / Message</label>
                    <textarea id="message" name="message" rows="5" placeholder="Tell us why you're a great fit..."></textarea>
                </div>
                <button type="submit" class="btn-submit">Submit Application</button>
            </form>
        </section>
    `;
}

function renderCurrentPage() {
    navigateTo(currentPage);
}

// ============================================
// FIXED: Event Listeners Setup with Direct Slideshow Button Binding
// ============================================
function setupEventListeners() {
    // Hamburger menu click
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            window.toggleMobileMenu();
        });
    }
    
    // Desktop navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.target.dataset.page;
            if (page) window.navigateTo(page);
        });
    });
    
    // Mobile navigation
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.target.dataset.page;
            if (page) window.navigateTo(page);
        });
    });
    
    // CTA buttons
    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.dataset.nav;
            if (page) window.navigateTo(page);
        });
    });
    
    // ============================================
    // FIXED: Direct Slideshow Button Event Binding
    // ============================================
    const prevButton = document.querySelector('.slide-nav.prev');
    const nextButton = document.querySelector('.slide-nav.next');
    
    if (prevButton) {
        // Remove any existing listeners by cloning
        const newPrev = prevButton.cloneNode(true);
        prevButton.parentNode.replaceChild(newPrev, prevButton);
        
        // Add fresh click handler
        newPrev.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.changeSlide === 'function') {
                window.changeSlide(-1);
            }
        });
    }
    
    if (nextButton) {
        // Remove any existing listeners by cloning
        const newNext = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newNext, nextButton);
        
        // Add fresh click handler
        newNext.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.changeSlide === 'function') {
                window.changeSlide(1);
            }
        });
    }
    
    // Also ensure the HTML onclick attributes work as fallback
    // The buttons in HTML have: onclick="changeSlide(-1)" and onclick="changeSlide(1)"
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.querySelector('.hamburger');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            const isClickInside = mobileMenu.contains(e.target) || (hamburger && hamburger.contains(e.target));
            if (!isClickInside) {
                window.closeMobileMenu();
            }
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeModal();
            window.closeMobileMenu();
        }
        
        // Keyboard navigation for slideshow
        if (e.key === 'ArrowLeft') {
            if (typeof window.changeSlide === 'function') {
                window.changeSlide(-1);
            }
        }
        if (e.key === 'ArrowRight') {
            if (typeof window.changeSlide === 'function') {
                window.changeSlide(1);
            }
        }
    });
}

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    setupEventListeners();
    window.navigateTo('home');
     updateFooterInfo();

    
    // Extra safety: Re-bind slideshow buttons after a short delay
    // This ensures they work even if DOM isn't fully ready
    setTimeout(() => {
        const prevBtn = document.querySelector('.slide-nav.prev');
        const nextBtn = document.querySelector('.slide-nav.next');
        
        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                window.changeSlide(-1);
            };
        }
        
        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.preventDefault();
                window.changeSlide(1);
            };
        }
    }, 100);
    
});

export { renderCurrentPage };