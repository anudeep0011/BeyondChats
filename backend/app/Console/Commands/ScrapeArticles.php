<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Article;
use DOMDocument;
use DOMXPath;

class ScrapeArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:scrape-articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape the latest articles from BeyondChats blog';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $url = 'https://beyondchats.com/blogs/';
        $this->info("Starting scrape from $url ...");

        try {
            // Add User-Agent to mimic a real browser
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            ])->withoutVerifying()->get($url);
            
            if ($response->failed()) {
                $this->error('Failed to fetch the blog page. Status: ' . $response->status());
                return;
            }

            $html = $response->body();
            
            // Suppress warnings for malformed HTML
            libxml_use_internal_errors(true);
            $dom = new DOMDocument();
            // Load HTML with options to handle encoding and errors better
            $dom->loadHTML($html, LIBXML_NOERROR | LIBXML_NOWARNING);
            libxml_clear_errors();
            
            $xpath = new DOMXPath($dom);
            
            $articles = [];
            // Query for all anchor tags
            $links = $xpath->query('//a');
            
            $count = 0;
            $maxArticles = 10; // Limit to 10 articles

            foreach ($links as $link) {
                if ($count >= $maxArticles) break;

                $href = $link->getAttribute('href');
                $title = trim($link->nodeValue);
                
                // --- Robust Filtering Logic ---

                // 1. Must be a valid link
                if (empty($href) || $href === '#') continue;

                // 2. Must be a blog post link (contains /blogs/ or /blog/)
                if (strpos($href, '/blogs/') === false && strpos($href, '/blog/') === false) continue;

                // 3. Skip the main blog index page itself
                $normalizedHref = rtrim($href, '/');
                $normalizedBase = rtrim('https://beyondchats.com/blogs', '/');
                if ($normalizedHref === $normalizedBase || $normalizedHref === '/blogs') continue;

                // 4. Normalize URL to absolute
                if (strpos($href, 'http') === false) {
                    $href = 'https://beyondchats.com' . '/' . ltrim($href, '/');
                }

                // 5. Ensure unique processing
                if (isset($articles[$href])) continue;

                // 6. Title fallback: if link text is empty, try to find a heading inside the link or just use slug
                if (empty($title)) {
                    // check for nested elements like h2, h3, h4, div with class title etc.
                    foreach ($link->childNodes as $child) {
                        if ($child->nodeType === XML_ELEMENT_NODE && in_array($child->nodeName, ['h2', 'h3', 'h4', 'span', 'p', 'div'])) {
                             $potentialTitle = trim($child->nodeValue);
                             if (!empty($potentialTitle)) {
                                 $title = $potentialTitle;
                                 break;
                             }
                        }
                    }
                }

                // 7. Last resort: Extract title from URL slug
                if (empty($title)) {
                     $path = parse_url($href, PHP_URL_PATH);
                     $slug = basename(rtrim($path, '/'));
                     $title = ucwords(str_replace('-', ' ', $slug));
                }

                $this->info("Found article: $title");
                $this->line("Link: $href");
                
                Article::firstOrCreate(
                    ['link' => $href],
                    [
                        'title' => $title,
                        'content' => 'Scraped content placeholder. Run processor to enrich.',
                        'is_updated' => false,
                        'published_at' => now(),
                    ]
                );
                
                $articles[$href] = true;
                $count++;
            }
            
            if ($count === 0) {
                $this->warn('No articles found with the current selectors. Debugging info:');
                $this->line('Total links found on page: ' . $links->length);
            } else {
                $this->info('Scraping completed. Found and stored ' . $count . ' articles.');
            }

        } catch (\Exception $e) {
            $this->error('An error occurred: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
        }
    }
}
