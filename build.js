const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

async function buildBlogs() {
    try {
        // Create dist directory if it doesn't exist
        await fs.mkdir('dist', { recursive: true });
        
        // Read all markdown files from blogs directory
        const files = await fs.readdir('blogs');
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        
        // Generate blog HTML
        const blogHTML = await Promise.all(markdownFiles.map(async (filename) => {
            const content = await fs.readFile(path.join('blogs', filename), 'utf-8');
            const title = filename.replace('.md', '');
            const date = new Date().toLocaleDateString();
            
            return `
                <div class="blog-card">
                    <h3>${title}</h3>
                    <div class="blog-meta">Published on: ${date}</div>
                    <div class="blog-content">${marked.parse(content)}</div>
                </div>
            `;
        }));
        
        // Read the main HTML template
        const template = await fs.readFile('index.html', 'utf-8');
        
        // Replace the blog list content
        const updatedHTML = template.replace(
            /<div id="blogList" class="blog-list">[\s\S]*?<\/div>/,
            `<div id="blogList" class="blog-list">${blogHTML.join('')}</div>`
        );
        
        // Write the updated HTML to dist/index.html
        await fs.writeFile('dist/index.html', updatedHTML);
        
        // Copy CSS and other static files
        await fs.copyFile('index.css', 'dist/index.css');
        await fs.copyFile('index.js', 'dist/index.js');
        
        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
    }
}

buildBlogs(); 