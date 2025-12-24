const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ articles: [] }, null, 2));
}

// Helpers
const getDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const saveDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// API Routes mimicking Laravel

// 1. Get All Articles (Latest)
app.get('/api/articles', (req, res) => {
    const db = getDB();
    // Sort by id descending (mocking latest())
    const articles = db.articles.sort((a, b) => b.id - a.id);
    res.json(articles);
});

app.get('/api/articles/latest', (req, res) => {
    const db = getDB();
    const article = db.articles.length > 0 ? db.articles[db.articles.length - 1] : null;
    res.json(article);
});


// 2. Get Pending Articles
app.get('/api/articles/pending', (req, res) => {
    const db = getDB();
    const article = db.articles.find(a => !a.is_updated || a.content.includes('placeholder'));
    res.json(article || null);
});

// 3. Create Article (Store)
app.post('/api/articles', (req, res) => {
    const db = getDB();
    const { title, link, content, published_at } = req.body;

    // Check duplicate link
    const exists = db.articles.find(a => a.link === link);
    if (exists) {
        return res.status(422).json({ message: 'Article already exists' });
    }

    const newArticle = {
        id: db.articles.length + 1,
        title,
        link,
        content: content || 'Placeholder content...',
        is_updated: false,
        published_at: published_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    db.articles.push(newArticle);
    saveDB(db);

    console.log(`[CREATED] ${title}`);
    res.status(201).json(newArticle);
});

// 4. Update Article
app.put('/api/articles/:id', (req, res) => {
    const db = getDB();
    const id = parseInt(req.params.id);
    const index = db.articles.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Article not found' });
    }

    const updatedArticle = {
        ...db.articles[index],
        ...req.body,
        updated_at: new Date().toISOString()
    };

    db.articles[index] = updatedArticle;
    saveDB(db);

    console.log(`[UPDATED] Article ${id}`);
    res.json(updatedArticle);
});

app.listen(PORT, () => {
    console.log(`Node Mock Backend running on http://localhost:${PORT}`);
});
