require('dotenv').config();

/**
 * Heuristic "Rewrite" / Enrichment Function
 * Replaces LLM with a rule-based aggregator to avoid API costs/issues.
 */
async function rewriteArticle(originalTitle, originalContent, referenceContents) {
    try {
        console.log('Using Heuristic Enrichment (Rule-Based)...');

        let enrichedContent = `## Overview\n\n`;

        // Use original content if it's not just a placeholder
        if (originalContent && !originalContent.includes('placeholder')) {
            enrichedContent += `${originalContent}\n\n`;
        } else {
            enrichedContent += `This article explores the topic of **${originalTitle}**, verifying key details and gathering insights from across the web.\n\n`;
        }

        enrichedContent += `## Key Insights from the Web\n\n`;

        if (referenceContents && referenceContents.length > 0) {
            referenceContents.forEach((content, index) => {
                if (!content) return;

                // Extract a meaningful excerpt (first 3 sentences or ~400 chars)
                let excerpt = content.substring(0, 400);

                // Try to cut off at the last period to be clean
                const lastPeriod = excerpt.lastIndexOf('.');
                if (lastPeriod > 100) {
                    excerpt = excerpt.substring(0, lastPeriod + 1);
                } else {
                    excerpt += '...';
                }

                enrichedContent += `### Insight ${index + 1}\n`;
                enrichedContent += `${excerpt}\n\n`;
            });
        } else {
            enrichedContent += `*No additional external details could be retrieved at this time.*\n\n`;
        }

        enrichedContent += `## Conclusion\n\n`;
        enrichedContent += `The topic of **${originalTitle}** is actively discussed. The above insights provide a quick overview of the current perspectives found online.`;

        return enrichedContent;

    } catch (error) {
        console.error('Heuristic Enrichment failed:', error.message);
        return originalContent; // Fallback
    }
}

module.exports = { rewriteArticle };
