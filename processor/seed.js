const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://127.0.0.1:8000/api/articles';

async function seed() {
    try {
        console.log('Seeding article...');
        const article = {
            title: "Future of Artificial Intelligence",
            link: "https://example.com/ai-future",
            content: "Artificial Intelligence is rapidly evolving."
        };

        const response = await axios.post(API_URL, article);
        console.log('Seeding successful:', response.data);
    } catch (error) {
        console.error('Seeding failed:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        }
    }
}

seed();
