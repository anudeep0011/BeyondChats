const axios = require('axios');
const { searchGoogle } = require('./services/search');
const { scrapeContent } = require('./services/scraper');
const { rewriteArticle } = require('./services/llm');
const { fetchFromRSS } = require('./services/rss');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:8000/api/articles';

async function processNextArticle() {
    try {
        // 0. Sync with RSS Feed first
        await fetchFromRSS(API_URL);

        console.log('Fetching next pending article...');
        // 1. Fetch next pending article
        const { data: article } = await axios.get(`${API_URL}/pending`);

        if (!article || !article.id) {
            console.log('No pending articles found.');
            return;
        }

        if (article.is_updated && !article.content.includes('placeholder')) {
            console.log('Article already fully updated.');
            return;
        }

        console.log(`Processing article: ${article.title} (ID: ${article.id})`);

        // 2. Search Google
        console.log('Searching Google...');
        const links = await searchGoogle(article.title);
        console.log(`Found links: ${links.join(', ')}`);

        // 3. Scrape content
        const referenceContents = [];
        for (const link of links) {
            console.log(`Scraping ${link}...`);
            const content = await scrapeContent(link);
            if (content) referenceContents.push(content);
        }

        // 4. Rewrite with LLM
        console.log('Rewriting article...');
        const newContent = await rewriteArticle(article.title, article.content, referenceContents);

        if (!newContent) {
            console.error('Failed to generate enriched content. Aborting update to keep article pending.');
            return;
        }

        // Append references
        let finalContent = newContent;
        if (links.length > 0) {
            finalContent += '\n\n## References\n';
            links.forEach((link, index) => {
                finalContent += `${index + 1}. [${link}](${link})\n`;
            });
        }

        // 5. Update article
        console.log('Updating article...');
        await axios.put(`${API_URL}/${article.id}`, {
            content: finalContent,
            is_updated: true
        });

        console.log('Article updated successfully!');

    } catch (error) {
        console.error('Error processing article:', error);
        if (error.response) {
            console.error('API Response:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            console.error('No response received. Request details:', error.request);
        } else {
            console.error('Error config:', error.config);
        }
    }
}

const POLLING_INTERVAL = 300000; // 5 minutes

async function startProcessor() {
    console.log('Starting Processor Service...');

    // Initial run
    await processNextArticle();

    // Loop
    setInterval(async () => {
        try {
            await processNextArticle();
        } catch (error) {
            console.error('Error in processor loop:', error);
        }
    }, POLLING_INTERVAL);
}

// Run the processor
startProcessor();
