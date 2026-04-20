// ============================================
// TALENTTRACK - JOBS DATA MODULE
// WDD 231 Final Project
// Uses Fetch API with try...catch for async data loading
// ============================================

let jobsData = [];

export async function fetchJobsData() {
    try {
        const response = await fetch('data/jobs.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        jobsData = data.jobs;
        return jobsData;
    } catch (error) {
        console.error('Error fetching jobs data:', error.message);
        jobsData = getFallbackJobs();
        return jobsData;
    }
}

function getFallbackJobs() {
    return [
        { id: 1, title: "Frontend Developer", company: "TechCorp", location: "Remote", type: "Full-time", salary: "$100k - $140k", posted: "2 days ago", description: "Build modern web applications with React." },
        { id: 2, title: "Backend Developer", company: "ServerPro", location: "New York", type: "Full-time", salary: "$110k - $150k", posted: "3 days ago", description: "Develop scalable backend systems." },
        { id: 3, title: "Full Stack Engineer", company: "WebWorks", location: "Remote", type: "Full-time", salary: "$120k - $160k", posted: "1 day ago", description: "Work across the entire stack." }
    ];
}

export function getJobsData() { return jobsData; }

export function filterJobs(jobs, filters) {
    return jobs.filter(job => {
        if (filters.type && job.type !== filters.type) return false;
        if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            if (!job.title.toLowerCase().includes(searchTerm) && !job.company.toLowerCase().includes(searchTerm)) return false;
        }
        return true;
    });
}

export function getBookmarks() { return JSON.parse(localStorage.getItem('talenttrack_bookmarks') || '[]'); }
export function saveBookmarks(bookmarks) { localStorage.setItem('talenttrack_bookmarks', JSON.stringify(bookmarks)); }
export function toggleBookmark(jobId, bookmarks) {
    const index = bookmarks.indexOf(jobId);
    index > -1 ? bookmarks.splice(index, 1) : bookmarks.push(jobId);
    return bookmarks;
}