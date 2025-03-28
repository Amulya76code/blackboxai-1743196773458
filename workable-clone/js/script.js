import JobDescriptionService from '../src/services/jobDescriptionService.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load saved descriptions on page load
    const savedDescriptionsEl = document.getElementById('savedDescriptions');
    if (savedDescriptionsEl) {
        try {
            const descriptions = await JobDescriptionService.getSavedDescriptions();
            savedDescriptionsEl.innerHTML = descriptions.length ? 
                descriptions.map(desc => `
                    <div class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-medium text-gray-800">${desc.title}</h3>
                        <p class="text-gray-600 mt-1">${desc.content.substring(0, 100)}...</p>
                        <div class="mt-2 text-sm text-gray-500">
                            ${new Date(desc.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                `).join('') :
                '<p class="text-gray-500">No saved descriptions yet</p>';
        } catch (error) {
            console.error('Failed to load saved descriptions:', error);
            savedDescriptionsEl.innerHTML = `
                <p class="text-red-500">Error loading saved descriptions: ${error.message}</p>
            `;
        }
    }
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Job Description Form Handling
    const jobForm = document.getElementById('jobDescriptionForm');
    const resultSection = document.getElementById('generatedResult');
    const resultContent = resultSection.querySelector('div');
    const saveBtn = document.getElementById('saveDescriptionBtn');

    if (jobForm) {
        jobForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                title: document.getElementById('jobTitle').value,
                company: document.getElementById('companyName').value,
                location: document.getElementById('jobLocation').value,
                type: document.getElementById('jobType').value,
                salary: document.getElementById('salaryRange').value,
                experience: document.getElementById('experienceLevel').value,
                responsibilities: document.getElementById('jobResponsibilities').value,
                requirements: document.getElementById('jobRequirements').value,
                benefits: document.getElementById('jobBenefits').value
            };

            try {
                // Show loading state
                const submitBtn = jobForm.querySelector('button');
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                `;
                
                const { description, suggestions } = await JobDescriptionService.generateJobDescription(formData);
                
                const editableDesc = document.getElementById('editableDescription');
                editableDesc.innerHTML = description;
                
                // Set up edit/preview toggle
                const editBtn = document.getElementById('editModeBtn');
                const previewBtn = document.getElementById('previewModeBtn');
                
                editBtn.addEventListener('click', () => {
                    editableDesc.contentEditable = true;
                    editableDesc.classList.add('focus:ring-2', 'focus:ring-blue-500');
                    editBtn.classList.replace('bg-gray-200', 'bg-blue-600');
                    editBtn.classList.replace('text-gray-700', 'text-white');
                    previewBtn.classList.replace('bg-blue-600', 'bg-gray-200');
                    previewBtn.classList.replace('text-white', 'text-gray-700');
                });
                
                previewBtn.addEventListener('click', () => {
                    editableDesc.contentEditable = false;
                    editableDesc.classList.remove('focus:ring-2', 'focus:ring-blue-500');
                    previewBtn.classList.replace('bg-gray-200', 'bg-blue-600');
                    previewBtn.classList.replace('text-gray-700', 'text-white');
                    editBtn.classList.replace('bg-blue-600', 'bg-gray-200');
                    editBtn.classList.replace('text-white', 'text-gray-700');
                });
                
                // Set default to edit mode
                editBtn.click();
                
                // Set up regenerate button
                document.getElementById('regenerateBtn').addEventListener('click', () => {
                    jobForm.dispatchEvent(new Event('submit'));
                });
                
                // Set up copy button
                document.getElementById('copyDescriptionBtn').addEventListener('click', () => {
                    navigator.clipboard.writeText(editableDesc.textContent)
                        .then(() => showNotification('Description copied to clipboard!', 'success'))
                        .catch(err => showNotification('Failed to copy: ' + err.message, 'error'));
                });
                resultSection.classList.remove('hidden');
            } catch (error) {
                console.error('Error:', error);
                showNotification(error.message, 'error');
            } finally {
                jobForm.querySelector('button').disabled = false;
                jobForm.querySelector('button').textContent = 'Generate Description';
            }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async function() {
            const description = resultContent.textContent;
            try {
                saveBtn.disabled = true;
                saveBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                `;
                
                await JobDescriptionService.saveJobDescription({
                    content: description
                });
                
                showNotification('Description saved successfully!', 'success');
            } catch (error) {
                console.error('Save error:', error);
                showNotification(error.message, 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Description';
            }
        });
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg transform transition-all duration-300 ${
            type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-y-4');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});
