// API Base URL - for local testing
//const API_BASE_URL = 'http://localhost:3000/api';

// Replace the first line in script.js:
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : window.location.origin + '/api';
    
// Tab switching for login/register
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('type') === 'register') {
        registerTab.click();
    }
}

// Login Function
async function login() {
    const role = document.getElementById('loginRole').value;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageElement = document.getElementById('loginMessage');

    if (!email || !password) {
        messageElement.textContent = 'Please fill in all fields';
        messageElement.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', data.email);
            
            if (role === 'teacher') {
                window.location.href = 'teacher-dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            messageElement.textContent = data.error || 'Login failed';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        messageElement.textContent = 'Network error. Please try again.';
        messageElement.style.color = 'red';
        console.error('Login error:', error);
    }
}

// Register Function
async function register() {
    const role = document.getElementById('registerRole').value;
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const messageElement = document.getElementById('registerMessage');

    if (!name || !email || !password) {
        messageElement.textContent = 'Please fill in all fields';
        messageElement.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = 'Registration successful! You can now login.';
            messageElement.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            messageElement.textContent = data.error || 'Registration failed';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        messageElement.textContent = 'Network error. Please try again.';
        messageElement.style.color = 'red';
        console.error('Registration error:', error);
    }
}

// Dashboard Navigation
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(sectionId + 'Section').classList.remove('hidden');
    loadDashboardData(sectionId);
}

function showTeacherSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(sectionId + 'Section').classList.remove('hidden');
    loadTeacherDashboardData(sectionId);
}

// Load Student Dashboard Data
async function loadDashboardData(section) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const studentName = localStorage.getItem('userName');
    if (studentName) {
        document.getElementById('studentName').textContent = `Welcome, ${studentName}`;
    }

    try {
        switch(section) {
            case 'assignments':
                await loadAssignments();
                break;
            case 'announcements':
                await loadAnnouncements();
                break;
            case 'grades':
                await loadGrades();
                break;
            case 'messages':
                await loadTeachers();
                break;
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showError(section + 'Section', 'Error loading data');
    }
}

// Load Teacher Dashboard Data
async function loadTeacherDashboardData(section) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const teacherName = localStorage.getItem('userName');
    if (teacherName) {
        document.getElementById('teacherName').textContent = `Welcome, ${teacherName}`;
    }

    try {
        switch(section) {
            case 'postAssignment':
                await loadPostedAssignments();
                break;
            case 'viewSubmissions':
                await loadSubmissions();
                break;
            case 'postAnnouncement':
                await loadAnnouncementsHistory();
                break;
            case 'gradeAssignments':
                await loadUngradedSubmissions();
                break;
            case 'teacherMessages':
                await loadStudents();
                break;
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showError(section + 'Section', 'Error loading data');
    }
}

// Show error in container
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<p class="error">${message}</p>`;
    }
}

// ============ STUDENT FUNCTIONS ============

// Load Assignments for Student
async function loadAssignments() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/assignments`, {
            headers: { 
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const assignments = await response.json();
        const container = document.getElementById('assignmentsList');
        const select = document.getElementById('assignmentSelect');
        
        container.innerHTML = '';
        select.innerHTML = '<option value="">Select an assignment</option>';
        
        if (!assignments || assignments.length === 0) {
            container.innerHTML = '<p>No assignments available.</p>';
            return;
        }
        
        assignments.forEach(assignment => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${assignment.title}</h4>
                <p>${assignment.description || 'No description'}</p>
                <p><strong>Due:</strong> ${new Date(assignment.dueDate).toLocaleDateString()}</p>
                <p><strong>Teacher:</strong> ${assignment.teacher || 'Unknown'}</p>
                <p><strong>Status:</strong> <span class="status ${assignment.status}">${assignment.status}</span></p>
                ${assignment.grade ? `<p><strong>Grade:</strong> ${assignment.grade}/${assignment.maxMarks}</p>` : ''}
            `;
            container.appendChild(card);
            
            if (assignment.status === 'pending') {
                const option = document.createElement('option');
                option.value = assignment._id;
                option.textContent = assignment.title;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading assignments:', error);
        showError('assignmentsList', 'Error loading assignments');
    }
}

// File handling functions
let selectedFile = null;

function handleFileSelect() {
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];
    
    if (file) {
        // Check if it's a PDF
        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file only.');
            fileInput.value = '';
            return;
        }
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB.');
            fileInput.value = '';
            return;
        }
        
        selectedFile = file;
        
        // Show file info
        document.getElementById('fileNameDisplay').textContent = file.name;
        document.getElementById('fileSize').textContent = formatFileSize(file.size);
        document.getElementById('fileInfo').style.display = 'flex';
        
        // Show PDF preview
        const fileURL = URL.createObjectURL(file);
        document.getElementById('pdfPreview').src = fileURL;
        document.getElementById('filePreviewContainer').style.display = 'block';
        
        // Enable submit button
        document.getElementById('assignmentSelect').disabled = false;
    }
}

function removeSelectedFile() {
    selectedFile = null;
    document.getElementById('pdfFile').value = '';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('filePreviewContainer').style.display = 'none';
    document.getElementById('pdfPreview').src = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Updated submit function with file upload
// Updated submit function with file upload - FIXED VERSION
async function submitAssignmentWithFile() {
    const assignmentId = document.getElementById('assignmentSelect').value;
    
    if (!assignmentId) {
        alert('Please select an assignment');
        return;
    }
    
    if (!selectedFile) {
        alert('Please upload a PDF file');
        return;
    }
    
    try {
        // Create FormData object
        const formData = new FormData();
        formData.append('assignmentId', assignmentId);
        
        // Check if there's any text in the textarea (if it exists)
        const submissionTextElement = document.getElementById('submissionText');
        if (submissionTextElement) {
            const submissionText = submissionTextElement.value.trim();
            if (submissionText) {
                formData.append('submission', submissionText);
            }
        }
        
        // Add file if selected
        if (selectedFile) {
            formData.append('pdfFile', selectedFile);
        }
        
        // Show progress bar
        document.getElementById('uploadProgress').style.display = 'block';
        
        const token = localStorage.getItem('token');
        
        console.log('Submitting assignment...', {
            assignmentId,
            hasFile: !!selectedFile,
            fileName: selectedFile?.name
        });
        
        // Submit with FormData
        const response = await fetch(`${API_BASE_URL}/submit-assignment`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        });
        
        const data = await response.json();
        
        // Hide progress bar
        document.getElementById('uploadProgress').style.display = 'none';
        
        console.log('Submission response:', data);
        
        if (response.ok) {
            alert('✅ Assignment submitted successfully!');
            
            // Clear form
            if (submissionTextElement) {
                submissionTextElement.value = '';
            }
            removeSelectedFile();
            document.getElementById('assignmentSelect').selectedIndex = 0;
            
            // Reload assignments
            await loadAssignments();
        } else {
            alert('❌ Failed to submit assignment: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Submission error:', error);
        document.getElementById('uploadProgress').style.display = 'none';
        alert('⚠️ Network error. Please try again. Check console for details.');
    }
}

// Progress bar simulation (you can implement real progress with XMLHttpRequest if needed)
function updateProgressBar(percentage) {
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `Uploading... ${percentage}%`;
}

// Add drag and drop functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.querySelector('.file-upload-box');
    
    if (dropArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('highlight');
        }
        
        function unhighlight() {
            dropArea.classList.remove('highlight');
        }
        
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                const file = files[0];
                
                // Check if it's a PDF
                if (file.type === 'application/pdf') {
                    // Create a mock FileList object
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    document.getElementById('pdfFile').files = dataTransfer.files;
                    handleFileSelect();
                } else {
                    alert('Please drop a PDF file only.');
                }
            }
        }
    }
});

// Submit Assignment
async function submitAssignment() {
    const assignmentId = document.getElementById('assignmentSelect').value;
    const submissionText = document.getElementById('submissionText').value;
    
    if (!assignmentId || !submissionText) {
        alert('Please select an assignment and enter submission text');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/submit-assignment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ assignmentId, submission: submissionText })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Assignment submitted successfully!');
            document.getElementById('submissionText').value = '';
            loadAssignments();
        } else {
            alert('Failed to submit assignment: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert('Network error. Please try again.');
    }
}

// Load Announcements
async function loadAnnouncements() {
    try {
        const response = await fetch(`${API_BASE_URL}/announcements`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const announcements = await response.json();
        const container = document.getElementById('announcementsList');
        
        container.innerHTML = '';
        
        if (!announcements || announcements.length === 0) {
            container.innerHTML = '<p>No announcements available.</p>';
            return;
        }
        
        announcements.forEach(announcement => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${announcement.title}</h4>
                <p>${announcement.message}</p>
                <p><strong>By:</strong> ${announcement.teacherId?.name || 'Teacher'}</p>
                <p><small>Posted on: ${new Date(announcement.createdAt).toLocaleDateString()}</small></p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading announcements:', error);
        showError('announcementsList', 'Error loading announcements');
    }
}

// Load Grades
async function loadGrades() {
    try {
        const response = await fetch(`${API_BASE_URL}/grades`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const grades = await response.json();
        const container = document.getElementById('gradesList');
        
        container.innerHTML = '';
        
        if (!grades || grades.length === 0) {
            container.innerHTML = '<p>No grades available yet.</p>';
            return;
        }
        
        grades.forEach(grade => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${grade.assignment}</h4>
                <p><strong>Grade:</strong> ${grade.grade}/${grade.maxMarks}</p>
                <p><strong>Percentage:</strong> ${grade.percentage}%</p>
                <p><strong>Graded on:</strong> ${new Date(grade.gradedAt).toLocaleDateString()}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading grades:', error);
        showError('gradesList', 'Error loading grades');
    }
}

// Load Teachers for Messaging
async function loadTeachers() {
    try {
        const response = await fetch(`${API_BASE_URL}/teachers`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const teachers = await response.json();
        const container = document.getElementById('teacherList');
        
        container.innerHTML = '';
        
        if (!teachers || teachers.length === 0) {
            container.innerHTML = '<p>No teachers available.</p>';
            return;
        }
        
        teachers.forEach(teacher => {
            const teacherDiv = document.createElement('div');
            teacherDiv.className = 'message-contact';
            teacherDiv.innerHTML = `
                <strong>${teacher.name}</strong>
                <br>
                <small>${teacher.email}</small>
                <br>
                <button class="btn-small" onclick="openChat('${teacher._id}', '${teacher.name}')">Message</button>
            `;
            container.appendChild(teacherDiv);
        });
    } catch (error) {
        console.error('Error loading teachers:', error);
        showError('teacherList', 'Error loading teachers');
    }
}

// ============ TEACHER FUNCTIONS ============

// Load Posted Assignments
async function loadPostedAssignments() {
    try {
        const response = await fetch(`${API_BASE_URL}/teacher/assignments`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const assignments = await response.json();
        const container = document.getElementById('postedAssignments');
        
        container.innerHTML = '';
        
        if (!assignments || assignments.length === 0) {
            container.innerHTML = '<p>No assignments posted yet.</p>';
            return;
        }
        
        assignments.forEach(assignment => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${assignment.title}</h4>
                <p>${assignment.description || 'No description'}</p>
                <p><strong>Due:</strong> ${new Date(assignment.dueDate).toLocaleDateString()}</p>
                <p><strong>Max Marks:</strong> ${assignment.maxMarks}</p>
                <p><strong>Submissions:</strong> ${assignment.submissions || 0}</p>
                <p><strong>Graded:</strong> ${assignment.graded || 0}</p>
                <p><strong>Pending:</strong> ${assignment.pending || 0}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading posted assignments:', error);
        showError('postedAssignments', 'Error loading assignments');
    }
}

// Post Assignment
async function postAssignment() {
    const title = document.getElementById('assignmentTitle').value;
    const description = document.getElementById('assignmentDescription').value;
    const dueDate = document.getElementById('assignmentDueDate').value;
    const maxMarks = document.getElementById('assignmentMaxMarks').value;
    
    if (!title || !description || !dueDate || !maxMarks) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/create-assignment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, dueDate, maxMarks })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Assignment posted successfully!');
            
            // Clear form
            document.getElementById('assignmentTitle').value = '';
            document.getElementById('assignmentDescription').value = '';
            document.getElementById('assignmentDueDate').value = '';
            document.getElementById('assignmentMaxMarks').value = '';
            
            // Reload assignments
            loadPostedAssignments();
        } else {
            alert('Failed to post assignment: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Post assignment error:', error);
        alert('Network error. Please check console.');
    }
}

// Load Submissions
// Load Submissions - REMOVED GRADE BUTTON
async function loadSubmissions() {
    try {
        const response = await fetch(`${API_BASE_URL}/teacher/submissions`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const submissions = await response.json();
        const container = document.getElementById('submissionsList');
        
        container.innerHTML = '';
        
        if (!submissions || submissions.length === 0) {
            container.innerHTML = '<p>No submissions yet.</p>';
            return;
        }
        
        submissions.forEach(submission => {
            const card = document.createElement('div');
            card.className = 'card submission-card';
            
            // Build card content - VIEW ONLY, NO GRADING
            let cardContent = `
                <h4>${submission.assignmentId?.title || 'Unknown Assignment'}</h4>
                <p><strong>Student:</strong> ${submission.studentId?.name || 'Unknown'}</p>
                <p><strong>Email:</strong> ${submission.studentId?.email || 'N/A'}</p>
                <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleString()}</p>
                <p><strong>Status:</strong> <span class="status ${submission.grade ? 'graded' : 'submitted'}">
                    ${submission.grade ? 'Graded' : 'Submitted'}
                </span></p>
            `;
            
            // Add submission text if available
            if (submission.submission && submission.submission.trim() !== '') {
                cardContent += `
                    <div class="submission-text">
                        <p><strong>Text Submission:</strong></p>
                        <p>${submission.submission.substring(0, 200)}${submission.submission.length > 200 ? '...' : ''}</p>
                    </div>
                `;
            }
            
            // Add PDF file link if available
            if (submission.pdfFile) {
                const pdfUrl = `http://localhost:3000/uploads/${submission.pdfFile}`;
                cardContent += `
                    <div class="file-link-container">
                        <p><strong>PDF Submission:</strong></p>
                        <a href="${pdfUrl}" target="_blank" class="file-link">
                            📄 ${submission.pdfFile}
                        </a>
                    </div>
                `;
            }
            
            // REMOVED: No grading section in view submissions
            // This is just for viewing submissions
            
            card.innerHTML = cardContent;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading submissions:', error);
        showError('submissionsList', 'Error loading submissions');
    }
}

// Load Announcements History
async function loadAnnouncementsHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/announcements`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const announcements = await response.json();
        const container = document.getElementById('announcementsHistory');
        
        container.innerHTML = '';
        
        if (!announcements || announcements.length === 0) {
            container.innerHTML = '<p>No announcements yet.</p>';
            return;
        }
        
        announcements.forEach(announcement => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${announcement.title}</h4>
                <p>${announcement.message}</p>
                <p><small>Posted on: ${new Date(announcement.createdAt).toLocaleDateString()}</small></p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading announcements:', error);
        showError('announcementsHistory', 'Error loading announcements');
    }
}

// Post Announcement
async function postAnnouncement() {
    const title = document.getElementById('announcementTitle').value;
    const message = document.getElementById('announcementMessage').value;
    
    if (!title || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/create-announcement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ title, message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Announcement posted successfully!');
            
            // Clear form
            document.getElementById('announcementTitle').value = '';
            document.getElementById('announcementMessage').value = '';
            
            // Reload announcements
            loadAnnouncementsHistory();
        } else {
            alert('Failed to post announcement: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Post announcement error:', error);
        alert('Network error. Please check console.');
    }
}

// Load Ungraded Submissions
async function loadUngradedSubmissions() {
    try {
        const response = await fetch(`${API_BASE_URL}/teacher/submissions`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const submissions = await response.json();
        const container = document.getElementById('ungradedSubmissions');
        
        container.innerHTML = '';
        
        if (!submissions || submissions.length === 0) {
            container.innerHTML = '<p>No submissions to grade.</p>';
            return;
        }
        
        const ungraded = submissions.filter(sub => !sub.grade);
        
        if (ungraded.length === 0) {
            container.innerHTML = '<p>All submissions have been graded.</p>';
            return;
        }
        
        ungraded.forEach(submission => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${submission.assignmentId?.title || 'Unknown Assignment'}</h4>
                <p><strong>Student:</strong> ${submission.studentId?.name || 'Unknown'}</p>
                <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleDateString()}</p>
                <p><strong>Submission:</strong> ${submission.submission?.substring(0, 150) || 'No text'}${submission.submission?.length > 150 ? '...' : ''}</p>
                <div class="grade-form">
                    <input type="number" id="grade-${submission._id}" placeholder="Enter grade" min="0" max="${submission.assignmentId?.maxMarks || 100}">
                    <button class="btn-small" onclick="gradeSubmission('${submission._id}')">Submit Grade</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading ungraded submissions:', error);
        showError('ungradedSubmissions', 'Error loading submissions');
    }
}

// Grade Submission
// Grade Submission - IMPROVED VERSION
async function gradeSubmission(submissionId) {
    const gradeInput = document.getElementById(`grade-${submissionId}`);
    const grade = parseFloat(gradeInput.value);
    const maxMarks = parseFloat(gradeInput.max) || 100;
    
    // Frontend validation
    if (isNaN(grade)) {
        alert('Please enter a valid number for grade');
        gradeInput.focus();
        return;
    }
    
    if (grade < 0) {
        alert('Grade cannot be negative');
        gradeInput.focus();
        return;
    }
    
    if (grade > maxMarks) {
        alert(`Grade cannot exceed maximum marks (${maxMarks})`);
        gradeInput.focus();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/grade-submission`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ submissionId, grade })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`✅ Grade submitted: ${grade}/${maxMarks}`);
            loadUngradedSubmissions();
        } else {
            alert(`❌ Failed: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Grade submission error:', error);
        alert('Network error. Please try again.');
    }
}

function gradeSubmissionPrompt(submissionId, studentName, assignmentTitle) {
    const grade = prompt(`Enter grade for ${studentName}'s "${assignmentTitle}":`);
    if (grade && !isNaN(grade) && grade >= 0) {
        // Create a temporary input element for validation
        const tempInput = document.createElement('input');
        tempInput.type = 'number';
        tempInput.value = grade;
        
        // Validate the grade
        const gradeNum = parseFloat(grade);
        if (isNaN(gradeNum)) {
            alert('Please enter a valid number');
            return;
        }
        
        if (gradeNum < 0) {
            alert('Grade cannot be negative');
            return;
        }
        
        // Submit the grade
        submitGradeDirectly(submissionId, gradeNum);
    }
}

// Helper function to submit grade
async function submitGradeDirectly(submissionId, grade) {
    try {
        const response = await fetch(`${API_BASE_URL}/grade-submission`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ submissionId, grade })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`✅ Grade submitted successfully!`);
            // Reload submissions to show updated status
            await loadSubmissions();
        } else {
            alert(`❌ Failed: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Grade submission error:', error);
        alert('Network error. Please try again.');
    }
}

// Load Students for Messaging
async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const students = await response.json();
        const container = document.getElementById('studentList');
        
        container.innerHTML = '';
        
        if (!students || students.length === 0) {
            container.innerHTML = '<p>No students available.</p>';
            return;
        }
        
        students.forEach(student => {
            const studentDiv = document.createElement('div');
            studentDiv.className = 'message-contact';
            studentDiv.innerHTML = `
                <strong>${student.name}</strong>
                <br>
                <small>${student.email}</small>
                <br>
                <button class="btn-small" onclick="openTeacherChat('${student._id}', '${student.name}')">Message</button>
            `;
            container.appendChild(studentDiv);
        });
    } catch (error) {
        console.error('Error loading students:', error);
        showError('studentList', 'Error loading students');
    }
}

// ============ MESSAGING FUNCTIONS ============

let currentChatUserId = null;
let currentChatUserName = null;

async function openChat(userId, userName) {
    currentChatUserId = userId;
    currentChatUserName = userName;
    document.getElementById('currentChat').textContent = `Chat with ${userName}`;
    await loadMessages(userId);
}

async function openTeacherChat(userId, userName) {
    currentChatUserId = userId;
    currentChatUserName = userName;
    document.getElementById('teacherCurrentChat').textContent = `Chat with ${userName}`;
    await loadTeacherMessages(userId);
}

async function loadMessages(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/${userId}`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            return;
        }
        
        const messages = await response.json();
        const container = document.getElementById('messageHistory');
        
        container.innerHTML = '';
        
        if (!messages || messages.length === 0) {
            container.innerHTML = '<p>No messages yet. Start the conversation!</p>';
            return;
        }
        
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            const isSent = message.senderId._id === localStorage.getItem('userId');
            messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
            messageDiv.innerHTML = `
                <strong>${message.senderId.name}</strong>
                <p>${message.message}</p>
                <small>${new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
            `;
            container.appendChild(messageDiv);
        });
        
        container.scrollTop = container.scrollHeight;
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

async function loadTeacherMessages(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/messages/${userId}`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            return;
        }
        
        const messages = await response.json();
        const container = document.getElementById('teacherMessageHistory');
        
        container.innerHTML = '';
        
        if (!messages || messages.length === 0) {
            container.innerHTML = '<p>No messages yet. Start the conversation!</p>';
            return;
        }
        
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            const isSent = message.senderId._id === localStorage.getItem('userId');
            messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
            messageDiv.innerHTML = `
                <strong>${message.senderId.name}</strong>
                <p>${message.message}</p>
                <small>${new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
            `;
            container.appendChild(messageDiv);
        });
        
        container.scrollTop = container.scrollHeight;
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

async function sendMessage() {
    if (!currentChatUserId) {
        alert('Please select a user to message');
        return;
    }
    
    const messageInput = document.getElementById('messageText');
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Please enter a message');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ receiverId: currentChatUserId, message })
        });
        
        if (response.ok) {
            messageInput.value = '';
            await loadMessages(currentChatUserId);
        } else {
            alert('Failed to send message');
        }
    } catch (error) {
        console.error('Send message error:', error);
        alert('Network error. Please try again.');
    }
}

async function sendTeacherMessage() {
    if (!currentChatUserId) {
        alert('Please select a user to message');
        return;
    }
    
    const messageInput = document.getElementById('teacherMessageText');
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Please enter a message');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ receiverId: currentChatUserId, message })
        });
        
        if (response.ok) {
            messageInput.value = '';
            await loadTeacherMessages(currentChatUserId);
        } else {
            alert('Failed to send message');
        }
    } catch (error) {
        console.error('Send message error:', error);
        alert('Network error. Please try again.');
    }
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

// Initialize dashboard on load
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const studentName = localStorage.getItem('userName');
        if (studentName) {
            document.getElementById('studentName').textContent = `Welcome, ${studentName}`;
        }
        loadDashboardData('assignments');
    });
}

if (window.location.pathname.includes('teacher-dashboard.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const teacherName = localStorage.getItem('userName');
        if (teacherName) {
            document.getElementById('teacherName').textContent = `Welcome, ${teacherName}`;
        }
        loadTeacherDashboardData('postAssignment');
    });
}

// Filter functions for teacher grading
let allSubmissions = [];
let currentFilter = 'ungraded';

async function filterUngraded() {
    currentFilter = 'ungraded';
    await loadUngradedSubmissions();
}

async function filterAll() {
    currentFilter = 'all';
    await loadAllSubmissions();
}

// Load all submissions (for teacher filtering)
async function loadAllSubmissions() {
    try {
        const response = await fetch(`${API_BASE_URL}/teacher/submissions`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const submissions = await response.json();
        const container = document.getElementById('ungradedSubmissions');
        
        container.innerHTML = '';
        
        if (!submissions || submissions.length === 0) {
            container.innerHTML = '<p>No submissions found.</p>';
            return;
        }
        
        allSubmissions = submissions;
        
        submissions.forEach(submission => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${submission.assignmentId?.title || 'Unknown Assignment'}</h4>
                <p><strong>Student:</strong> ${submission.studentId?.name || 'Unknown'}</p>
                <p><strong>Status:</strong> <span class="status ${submission.grade ? 'graded' : 'pending'}">${submission.grade ? 'Graded' : 'Not Graded'}</span></p>
                <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleDateString()}</p>
                <p><strong>Submission:</strong> ${submission.submission?.substring(0, 150) || 'No text'}${submission.submission?.length > 150 ? '...' : ''}</p>
                ${!submission.grade ? 
                    `<div class="grade-form">
                        <input type="number" id="grade-${submission._id}" placeholder="Enter grade" min="0" max="${submission.assignmentId?.maxMarks || 100}">
                        <button class="btn-small" onclick="gradeSubmission('${submission._id}')">Submit Grade</button>
                    </div>` :
                    `<p><strong>Grade:</strong> ${submission.grade}/${submission.assignmentId?.maxMarks || 'N/A'}</p>`
                }
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading all submissions:', error);
        showError('ungradedSubmissions', 'Error loading submissions');
    }
}

// Update loadUngradedSubmissions to work with filtering
async function loadUngradedSubmissions() {
    try {
        const response = await fetch(`${API_BASE_URL}/teacher/submissions`, {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        
        const submissions = await response.json();
        const container = document.getElementById('ungradedSubmissions');
        
        container.innerHTML = '';
        
        if (!submissions || submissions.length === 0) {
            container.innerHTML = '<p>No submissions to grade.</p>';
            return;
        }
        
        const ungraded = submissions.filter(sub => !sub.grade);
        
        if (ungraded.length === 0) {
            container.innerHTML = '<p>All submissions have been graded.</p>';
            return;
        }
        
        allSubmissions = submissions;
        
        ungraded.forEach(submission => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${submission.assignmentId?.title || 'Unknown Assignment'}</h4>
                <p><strong>Student:</strong> ${submission.studentId?.name || 'Unknown'}</p>
                <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleDateString()}</p>
                <p><strong>Submission:</strong> ${submission.submission?.substring(0, 150) || 'No text'}${submission.submission?.length > 150 ? '...' : ''}</p>
                <div class="grade-form">
                    <input type="number" id="grade-${submission._id}" placeholder="Enter grade" min="0" max="${submission.assignmentId?.maxMarks || 100}">
                    <button class="btn-small" onclick="gradeSubmission('${submission._id}')">Submit Grade</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading ungraded submissions:', error);
        showError('ungradedSubmissions', 'Error loading submissions');
    }
}

// Update the gradeAssignment function to refresh correctly
async function gradeSubmission(submissionId) {
    const gradeInput = document.getElementById(`grade-${submissionId}`);
    const grade = parseFloat(gradeInput.value);
    const maxMarks = parseFloat(gradeInput.max) || 100;
    
    if (isNaN(grade)) {
        alert('Please enter a valid number for grade');
        gradeInput.focus();
        return;
    }
    
    if (grade < 0) {
        alert('Grade cannot be negative');
        gradeInput.focus();
        return;
    }
    
    if (grade > maxMarks) {
        alert(`Grade cannot exceed maximum marks (${maxMarks})`);
        gradeInput.focus();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/grade-submission`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ submissionId, grade })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`✅ Grade submitted: ${grade}/${maxMarks}`);
            // Reload based on current filter
            if (currentFilter === 'ungraded') {
                await loadUngradedSubmissions();
            } else {
                await loadAllSubmissions();
            }
        } else {
            alert(`❌ Failed: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Grade submission error:', error);
        alert('Network error. Please try again.');
    }
}

// Add some CSS for error messages
const style = document.createElement('style');
style.textContent = `
    .error { color: #e74c3c; padding: 20px; text-align: center; }
    .btn-small { 
        padding: 5px 10px; 
        font-size: 12px; 
        margin-top: 5px; 
        background: #3498db; 
        color: white; 
        border: none; 
        border-radius: 3px; 
        cursor: pointer; 
    }
    .btn-small:hover { background: #2980b9; }
    .grade-form { margin-top: 10px; }
    .grade-form input { 
        padding: 5px; 
        margin-right: 5px; 
        width: 80px; 
    }
`;
document.head.appendChild(style);