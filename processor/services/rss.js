const Parser = require('rss-parser');
const axios = require('axios');
const parser = new Parser();

async function fetchFromRSS(apiUrl) {
    try {
        console.log('Fetching RSS feed...');
        const feed = await parser.parseURL('https://beyondchats.com/feed/');
        console.log(`Found ${feed.items.length} items in RSS feed.`);

        let newCount = 0;

        for (const item of feed.items) {
            try {
                // Prepare article payload
                const articleData = {
                    title: item.title,
                    link: item.link,
                    content: item.contentSnippet || 'Placeholder content from RSS', // Initial content
                    published_at: item.isoDate
                };

                // Send to Backend API
                // We use firstOrCreate logic on backend, but via API we might need to check existence or just rely on unique constraints?
                // The API endpoint `POST /articles` usually creates. 
                // Let's assume the backend controller does NOT handle duplicates gracefully by default with `create`,
                // but the DB migration might have unique constraint on `link`.
                // However, let's try to just POST and ignore 422 errors (Duplicate).

                await axios.post(apiUrl, articleData);
                console.log(`[NEW] Added: ${item.title}`);
                newCount++;

            } catch (error) {
                if (error.response && error.response.status === 422) {
                    // Likely duplicate, ignore
                    // console.log(`[SKIP] Exists: ${item.title}`);
                } else {
                    console.error(`[ERR] Failed to add ${item.title}:`, error.message);
                }
            }
        }

        console.log(`RSS Sync complete. Added ${newCount} new articles.`);
        return newCount;

    } catch (error) {
        console.error('Error fetching RSS feed:', error.message);
        return 0;
    }
}

module.exports = { fetchFromRSS };
