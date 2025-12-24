const axios = require('axios');
const cheerio = require('cheerio');

async function searchGoogle(query) {
    try {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const links = [];
        
        // Selectors for Google search results
        // .yuRUbf > a is a common selector for the main link in a result
        $('.yuRUbf > a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.startsWith('http') && !href.includes('google.com')) {
                links.push(href);
            }
        });

        // Fallback if the above selector doesn't work (Google changes classes often)
        if (links.length === 0) {
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.startsWith('http') && !href.includes('google.com') && $(el).find('h3').length > 0) {
                     links.push(href);
                }
            });
        }

        // Filter unique links and return top 2
        return [...new Set(links)].slice(0, 2);
    } catch (error) {
        console.error('Search failed:', error.message);
        return [];
    }
}

module.exports = { searchGoogle };
