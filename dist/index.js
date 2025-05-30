// Global variables
let blogs = [];
let currentSection = 'home';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
    
    // Load blogs from markdown files
    loadBlogsFromMarkdown();
    
    // Setup contact form
    setupContactForm();
});

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Update nav active state
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentSection = sectionName;
}

// Blog functions
async function loadBlogsFromMarkdown() {
    try {
        const response = await fetch('/blogs');
        const files = await response.json();
        
        blogs = await Promise.all(files.map(async (filename) => {
            const response = await fetch(`/blogs/${filename}`);
            const content = await response.text();
            const title = filename.replace('.md', '');
            
            return {
                id: Date.now() + Math.random(),
                title: title,
                content: content,
                date: new Date().toLocaleDateString(),
                timestamp: new Date().toISOString()
            };
        }));
        
        renderBlogs();
    } catch (error) {
        console.error('Error loading blogs:', error);
        showNotification('Error loading blogs. Please try again later.');
    }
}

function toggleBlogForm() {
    const form = document.getElementById('blogForm');
    form.classList.toggle('active');
    
    if (!form.classList.contains('active')) {
        // Clear form
        document.getElementById('blogTitle').value = '';
        document.getElementById('blogContent').value = '';
    }
}

async function saveBlog() {
    const title = document.getElementById('blogTitle').value.trim();
    const content = document.getElementById('blogContent').value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content!');
        return;
    }
    
    try {
        const response = await fetch('/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        });
        
        if (response.ok) {
            showNotification('Blog published successfully! 🎉');
            toggleBlogForm();
            loadBlogsFromMarkdown(); // Reload blogs
        } else {
            throw new Error('Failed to save blog');
        }
    } catch (error) {
        console.error('Error saving blog:', error);
        showNotification('Error saving blog. Please try again later.');
    }
}

async function deleteBlog(blogId) {
    if (confirm('Are you sure you want to delete this blog?')) {
        try {
            const response = await fetch(`/blogs/${blogId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                blogs = blogs.filter(blog => blog.id !== blogId);
                renderBlogs();
                showNotification('Blog deleted successfully!');
            } else {
                throw new Error('Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            showNotification('Error deleting blog. Please try again later.');
        }
    }
}

function renderBlogs() {
    const blogList = document.getElementById('blogList');
    
    if (blogs.length === 0) {
        blogList.innerHTML = `
            <div class="blog-card">
                <h3>Welcome to My Blog!</h3>
                <div class="blog-meta">Published on: ${new Date().toLocaleDateString()}</div>
                <div class="blog-content">
                    <p>This is where I'll share my thoughts on Python development, machine learning, and technology. Stay tuned for tutorials, insights, and project walkthroughs!</p>
                </div>
            </div>
        `;
        return;
    }
    
    blogList.innerHTML = blogs.map(blog => `
        <div class="blog-card">
            <h3>${escapeHtml(blog.title)}</h3>
            <div class="blog-meta">Published on: ${blog.date}</div>
            <div class="blog-content">${marked.parse(blog.content)}</div>
            <div class="blog-actions">
                <button class="btn btn-danger btn-small" onclick="deleteBlog(${blog.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// Contact form setup
function setupContactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;
        
        // Create mailto link
        const mailtoLink = `mailto:rohanpudasaini581@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showNotification('Email client opened! Please send the email to complete your message. 📧');
        
        // Reset form
        form.reset();
    });
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add slide in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Mobile menu toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    showNotification('Mobile menu - Feature coming soon! 📱');
});