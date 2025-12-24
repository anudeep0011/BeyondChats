const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeContent(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        // Remove scripts, styles, etc.
        $('script, style, nav, footer, header, iframe, ads, .ads, .sidebar').remove();

        // Try to find the main content
        let content = '';
        const selectors = ['article', 'main', '.content', '#content', '.post-content', '.entry-content'];

        for (const selector of selectors) {
            if ($(selector).length > 0) {
                content = $(selector).text().trim();
                break;
            }
        }

        // Fallback: body text
        if (!content) {
            content = $('body').text().trim();
        }

        // Clean up whitespace
        return content.replace(/\s+/g, ' ').substring(0, 5000); // Limit to 5000 chars
    } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
        return '';
    }
}

module.exports = { scrapeContent };
