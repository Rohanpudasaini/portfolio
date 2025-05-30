const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Routes
app.get('/blogs', async (req, res) => {
    try {
        const files = await fs.readdir('blogs');
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        res.json(markdownFiles);
    } catch (error) {
        console.error('Error reading blogs directory:', error);
        res.status(500).json({ error: 'Failed to read blogs' });
    }
});

app.get('/blogs/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join('blogs', filename);
        const content = await fs.readFile(filePath, 'utf-8');
        res.send(content);
    } catch (error) {
        console.error('Error reading blog file:', error);
        res.status(500).json({ error: 'Failed to read blog file' });
    }
});

app.post('/blogs', async (req, res) => {
    try {
        const { title, content } = req.body;
        const filename = `${title}.md`;
        const filePath = path.join('blogs', filename);
        
        await fs.writeFile(filePath, content);
        res.json({ message: 'Blog saved successfully' });
    } catch (error) {
        console.error('Error saving blog:', error);
        res.status(500).json({ error: 'Failed to save blog' });
    }
});

app.delete('/blogs/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join('blogs', filename);
        
        await fs.unlink(filePath);
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 