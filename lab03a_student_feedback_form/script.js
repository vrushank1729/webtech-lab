// Course Data
const courses = [
    {
        code: '20IC201',
        name: 'AI Systems',
        faculty: 'Dr. Manish Mandloi',
        icon: '🤖'
    },
    {
        code: '20IC202',
        name: 'Webtech',
        faculty: 'Ms. Shivangi Mehta',
        icon: '🌐'
    },
    {
        code: '20IC203',
        name: 'Embedded Systems',
        faculty: 'Dr. Gunjan Thakur',
        icon: '⚡'
    },
    {
        code: '20IC204',
        name: 'Computer Communication & Networking',
        faculty: 'Dr. Anand Singh',
        icon: '🔌'
    },
    {
        code: '20IC205',
        name: 'Cloud Architecture and Services',
        faculty: 'Dr. Deepak Sharma',
        icon: '☁️'
    }
];

// Feedback questions with different rating types
const questions = [
    {
        id: 'teaching',
        label: 'How would you rate the teaching quality?',
        type: 'emoji',
        emojis: ['😢', '😕', '😐', '😊', '🤩']
    },
    {
        id: 'content',
        label: 'Course content relevance and clarity',
        type: 'star',
        stars: 5
    },
    {
        id: 'engagement',
        label: 'Overall engagement level',
        type: 'slider',
        min: 0,
        max: 10
    }
];

// Store feedback data
let feedbackData = {};
let currentCourseIndex = 0;

// Initialize feedback structure
courses.forEach(course => {
    feedbackData[course.code] = {
        completed: false,
        responses: {}
    };
});

// Generate course navigation
function generateCourseNav() {
    const nav = document.getElementById('courseNav');
    
    courses.forEach((course, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'course-nav-item' + (index === 0 ? ' active' : '');
        navItem.onclick = () => switchCourse(index);
        navItem.innerHTML = `
            <div class="course-nav-icon">${course.icon}</div>
            <div class="course-nav-title">${course.name}</div>
            <div class="course-nav-code">${course.code}</div>
        `;
        nav.appendChild(navItem);
    });
}

// Generate course cards
function generateCourseCards() {
    const grid = document.getElementById('coursesGrid');
    
    courses.forEach((course, index) => {
        const card = document.createElement('div');
        card.className = 'course-card' + (index === 0 ? ' active' : '');
        card.id = `course-${index}`;
        card.innerHTML = `
            <div class="course-header">
                <div class="course-icon">${course.icon}</div>
                <div class="course-info">
                    <h3>${course.name}</h3>
                    <div class="course-code">${course.code}</div>
                    <div class="faculty-name">👨‍🏫 ${course.faculty}</div>
                </div>
            </div>
            
            ${questions.map(q => generateQuestion(course.code, q)).join('')}
            
            <div class="comments-section">
                <label class="question-label">💬 Additional Comments (Optional)</label>
                <textarea class="comment-box" 
                          placeholder="Share your thoughts, suggestions, or anything else..."
                          onchange="saveComment('${course.code}', this.value)"></textarea>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Switch between courses
function switchCourse(index) {
    currentCourseIndex = index;
    
    // Update nav items
    const navItems = document.querySelectorAll('.course-nav-item');
    navItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update course cards
    const cards = document.querySelectorAll('.course-card');
    cards.forEach((card, i) => {
        if (i === index) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.getElementById('hamburger');
        sidebar.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

// Generate different types of questions
function generateQuestion(courseCode, question) {
    let html = `<div class="question">
        <label class="question-label">${question.label}</label>`;
    
    if (question.type === 'emoji') {
        html += `<div class="emoji-rating">`;
        question.emojis.forEach((emoji, index) => {
            html += `<span class="emoji-option" 
                           onclick="selectEmoji('${courseCode}', '${question.id}', ${index + 1}, this)">${emoji}</span>`;
        });
        html += `</div>`;
    } else if (question.type === 'star') {
        html += `<div class="star-rating" id="${courseCode}-${question.id}">`;
        for (let i = 1; i <= question.stars; i++) {
            html += `<span class="star" onclick="selectStar('${courseCode}', '${question.id}', ${i}, this)">⭐</span>`;
        }
        html += `</div>`;
    } else if (question.type === 'slider') {
        html += `<div class="slider-container">
            <input type="range" class="slider" min="${question.min}" max="${question.max}" value="5"
                   oninput="selectSlider('${courseCode}', '${question.id}', this.value, this)">
            <div class="slider-value" id="${courseCode}-${question.id}-value">5/10</div>
        </div>`;
    }
    
    html += `</div>`;
    return html;
}

// Emoji selection
function selectEmoji(courseCode, questionId, rating, element) {
    const siblings = element.parentElement.children;
    Array.from(siblings).forEach(s => s.classList.remove('selected'));
    element.classList.add('selected');
    
    if (!feedbackData[courseCode].responses) {
        feedbackData[courseCode].responses = {};
    }
    feedbackData[courseCode].responses[questionId] = rating;
    updateProgress();
}

// Star selection
function selectStar(courseCode, questionId, rating, element) {
    const container = element.parentElement;
    const stars = container.children;
    
    Array.from(stars).forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    if (!feedbackData[courseCode].responses) {
        feedbackData[courseCode].responses = {};
    }
    feedbackData[courseCode].responses[questionId] = rating;
    updateProgress();
}

// Slider selection
function selectSlider(courseCode, questionId, value, element) {
    const valueDisplay = document.getElementById(`${courseCode}-${questionId}-value`);
    valueDisplay.textContent = `${value}/10`;
    
    if (!feedbackData[courseCode].responses) {
        feedbackData[courseCode].responses = {};
    }
    feedbackData[courseCode].responses[questionId] = parseInt(value);
    updateProgress();
}

// Save comments
function saveComment(courseCode, comment) {
    if (!feedbackData[courseCode].responses) {
        feedbackData[courseCode].responses = {};
    }
    feedbackData[courseCode].responses.comment = comment;
}

// Update progress bar
function updateProgress() {
    let totalQuestions = courses.length * questions.length;
    let answeredQuestions = 0;
    
    courses.forEach(course => {
        if (feedbackData[course.code].responses) {
            answeredQuestions += Object.keys(feedbackData[course.code].responses).filter(key => key !== 'comment').length;
        }
    });
    
    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage + '%';
}

// Submit feedback
function submitFeedback() {
    // Check if at least 50% completed
    let totalQuestions = courses.length * questions.length;
    let answeredQuestions = 0;
    
    courses.forEach(course => {
        if (feedbackData[course.code].responses) {
            answeredQuestions += Object.keys(feedbackData[course.code].responses).filter(key => key !== 'comment').length;
        }
    });
    
    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
    
    if (percentage < 50) {
        alert('⚠️ Please complete at least 50% of the feedback form before submitting!');
        return;
    }
    
    console.log('Feedback Data:', feedbackData);
    
    // Show success modal
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    
    // Create confetti
    createConfetti();
    
    // Close modal after 3 seconds
    setTimeout(() => {
        modal.classList.remove('active');
    }, 3000);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Create animated particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialize
window.onload = function() {
    generateCourseNav();
    generateCourseCards();
    createParticles();
};

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    sidebar.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
            sidebar.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});