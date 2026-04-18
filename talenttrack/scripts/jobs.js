// ============================================
// TALENTTRACK - JOBS DATA MODULE
// WDD 231 Final Project
// ============================================

export const jobsData = [
    { 
        id: 1, 
        title: "Senior Frontend Developer", 
        company: "TechCorp Solutions", 
        location: "Remote", 
        type: "Full-time", 
        salary: "$120k - $160k",
        posted: "2 days ago",
        description: "Lead frontend development with React and TypeScript. Build scalable applications used by millions of users worldwide. Collaborate with design and backend teams to create seamless user experiences." 
    },
    { 
        id: 2, 
        title: "UX/UI Designer", 
        company: "Creative Studio", 
        location: "New York, NY", 
        type: "Full-time", 
        salary: "$90k - $130k",
        posted: "1 week ago",
        description: "Design beautiful, intuitive interfaces for top-tier clients. Strong portfolio required. Experience with Figma and design systems essential." 
    },
    { 
        id: 3, 
        title: "Data Scientist", 
        company: "DataWorks Inc", 
        location: "Austin, TX", 
        type: "Remote", 
        salary: "$130k - $170k",
        posted: "3 days ago",
        description: "Analyze complex datasets and build ML models. Python and SQL expertise required. Work on cutting-edge AI projects." 
    },
    { 
        id: 4, 
        title: "Backend Engineer", 
        company: "CloudScale", 
        location: "San Francisco, CA", 
        type: "Full-time", 
        salary: "$140k - $180k",
        posted: "5 days ago",
        description: "Build scalable microservices with Node.js and PostgreSQL. AWS experience preferred. Design and implement RESTful APIs." 
    },
    { 
        id: 5, 
        title: "Product Manager", 
        company: "InnovateLabs", 
        location: "Seattle, WA", 
        type: "Hybrid", 
        salary: "$110k - $150k",
        posted: "1 day ago",
        description: "Lead product strategy and execution. Strong analytical and communication skills. Drive product roadmap and feature prioritization." 
    },
    { 
        id: 6, 
        title: "DevOps Engineer", 
        company: "InfraCore", 
        location: "Remote", 
        type: "Contract", 
        salary: "$100 - $150/hr",
        posted: "4 days ago",
        description: "Manage cloud infrastructure and CI/CD pipelines. Kubernetes expertise required. Implement infrastructure as code using Terraform." 
    },
    { 
        id: 7, 
        title: "iOS Developer", 
        company: "AppCraft", 
        location: "Los Angeles, CA", 
        type: "Full-time", 
        salary: "$130k - $170k",
        posted: "6 days ago",
        description: "Build cutting-edge iOS apps with Swift and SwiftUI. App Store experience required. Create innovative mobile experiences." 
    },
    { 
        id: 8, 
        title: "QA Automation Engineer", 
        company: "QualityFirst", 
        location: "Chicago, IL", 
        type: "Full-time", 
        salary: "$85k - $115k",
        posted: "1 week ago",
        description: "Develop automated test suites. Selenium and Cypress experience preferred. Ensure software quality through comprehensive testing." 
    },
    { 
        id: 9, 
        title: "Technical Writer", 
        company: "DocuPro", 
        location: "Remote", 
        type: "Part-time", 
        salary: "$40 - $60/hr",
        posted: "3 days ago",
        description: "Create clear documentation for APIs and developer tools. Strong writing skills. Translate complex technical concepts for diverse audiences." 
    },
    { 
        id: 10, 
        title: "Machine Learning Engineer", 
        company: "AI Innovations", 
        location: "Boston, MA", 
        type: "Full-time", 
        salary: "$150k - $200k",
        posted: "2 days ago",
        description: "Deploy ML models to production. TensorFlow and PyTorch experience required. Work on state-of-the-art AI solutions." 
    },
    { 
        id: 11, 
        title: "Sales Executive", 
        company: "GrowthHive", 
        location: "Remote", 
        type: "Full-time", 
        salary: "$80k - $120k + Commission",
        posted: "5 days ago",
        description: "Drive enterprise sales and build client relationships. B2B SaaS experience. Uncapped commission potential." 
    },
    { 
        id: 12, 
        title: "Customer Success Manager", 
        company: "SupportHero", 
        location: "Denver, CO", 
        type: "Hybrid", 
        salary: "$75k - $95k",
        posted: "4 days ago",
        description: "Ensure customer satisfaction and retention. Experience in SaaS required. Build lasting relationships with enterprise clients." 
    },
    { 
        id: 13, 
        title: "Cybersecurity Analyst", 
        company: "SecureNet", 
        location: "Washington, DC", 
        type: "Full-time", 
        salary: "$110k - $150k",
        posted: "1 week ago",
        description: "Protect systems from cyber threats. CISSP certification preferred. Monitor and respond to security incidents." 
    },
    { 
        id: 14, 
        title: "Digital Marketing Manager", 
        company: "BrandBoost", 
        location: "Remote", 
        type: "Contract", 
        salary: "$70 - $100/hr",
        posted: "3 days ago",
        description: "Execute multi-channel marketing campaigns. SEO and PPC expertise. Drive growth through data-driven strategies." 
    },
    { 
        id: 15, 
        title: "HR Business Partner", 
        company: "PeopleFirst", 
        location: "Portland, OR", 
        type: "Full-time", 
        salary: "$90k - $120k",
        posted: "2 days ago",
        description: "Support employee relations and talent development. SHRM certification a plus. Foster positive workplace culture." 
    }
];

export function filterJobs(jobs, filters) {
    return jobs.filter(job => {
        if (filters.type && job.type !== filters.type) return false;
        if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            if (!job.title.toLowerCase().includes(searchTerm) && 
                !job.company.toLowerCase().includes(searchTerm)) return false;
        }
        return true;
    });
}

export function getBookmarks() {
    return JSON.parse(localStorage.getItem('talenttrack_bookmarks') || '[]');
}

export function saveBookmarks(bookmarks) {
    localStorage.setItem('talenttrack_bookmarks', JSON.stringify(bookmarks));
}

export function toggleBookmark(jobId, bookmarks) {
    const index = bookmarks.indexOf(jobId);
    if (index > -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push(jobId);
    }
    return bookmarks;
}