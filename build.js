const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

async function buildBlogs() {
    try {
        // Create dist directory if it doesn't exist
        await fs.mkdir('dist', { recursive: true });
        await fs.mkdir('dist/blogs', { recursive: true });
        
        // Read all markdown files from blogs directory
        const files = await fs.readdir('blogs');
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        
        // Generate blog listing HTML
        const blogListHTML = await Promise.all(markdownFiles.map(async (filename) => {
            const content = await fs.readFile(path.join('blogs', filename), 'utf-8');
            const title = filename.replace('.md', '');
            const date = new Date().toLocaleDateString();
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            return `
                <div class="blog-card">
                    <h3><a href="/blogs/${slug}.html">${title}</a></h3>
                    <div class="blog-meta">Published on: ${date}</div>
                </div>
            `;
        }));

        // Generate individual blog pages
        for (const filename of markdownFiles) {
            const content = await fs.readFile(path.join('blogs', filename), 'utf-8');
            const title = filename.replace('.md', '');
            const date = new Date().toLocaleDateString();
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            const blogHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Rohan Pudasaini's Blog</title>
    <link rel="stylesheet" href="../index.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">RP</div>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/portfolio/">Home</a></li>
                <li class="nav-item"><a href="/portfolio/#projects">Projects</a></li>
                <li class="nav-item"><a href="/portfolio/#blog" class="active">Blog</a></li>
                <li class="nav-item"><a href="/portfolio/#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <main class="main-content">
        <div class="container">
            <div class="blog-post">
                <h1>${title}</h1>
                <div class="blog-meta">Published on: ${date}</div>
                <div class="blog-content">${marked.parse(content)}</div>
                <div class="blog-navigation">
                    <a href="/portfolio/" class="btn">← Back to Home</a>
                </div>
            </div>
        </div>
    </main>

    <script src="../index.js"></script>
</body>
</html>`;
            
            await fs.writeFile(`dist/blogs/${slug}.html`, blogHTML);
        }
        
        // Read the main HTML template
        const template = await fs.readFile('index.html', 'utf-8');
        
        // Replace the blog list content
        const updatedHTML = template.replace(
            /<div id="blogList" class="blog-list">[\s\S]*?<\/div>/,
            `<div id="blogList" class="blog-list">${blogListHTML.join('')}</div>`
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