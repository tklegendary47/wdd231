        document.addEventListener('DOMContentLoaded', function() {
            const params = new URLSearchParams(window.location.search);
            const container = document.getElementById('detailsContainer');
            
            let html = '';
            
            const fields = [
                { key: 'fullName', label: 'Full Name' },
                { key: 'email', label: 'Email Address' },
                { key: 'phone', label: 'Phone Number' },
                { key: 'jobPosition', label: 'Position Applied For' },
                { key: 'experience', label: 'Years of Experience' },
                { key: 'message', label: 'Cover Letter / Message' }
            ];
            
            fields.forEach(field => {
                const value = params.get(field.key);
                if (value) {
                    html += `
                        <div class="detail-group">
                            <div class="detail-label">${field.label}</div>
                            <div class="detail-value">${value}</div>
                        </div>
                    `;
                }
            });
            
            const now = new Date();
            const timestamp = now.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
            
            container.innerHTML = html || '<p>No application data found.</p>';
            document.getElementById('submissionTime').textContent = `Submitted on ${timestamp}`;
            
            const applicationData = {};
            fields.forEach(field => {
                applicationData[field.key] = params.get(field.key) || '';
            });
            applicationData.submittedAt = timestamp;
            
            const applications = JSON.parse(localStorage.getItem('talenttrack_applications') || '[]');
            applications.push(applicationData);
            localStorage.setItem('talenttrack_applications', JSON.stringify(applications));
        });