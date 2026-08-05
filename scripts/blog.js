import Parser from 'rss-parser';

const parser = new Parser();

/**
 * Fetches latest blog posts from RSS feed URL.
 * @param {string} feedUrl 
 * @returns {Array} List of blog post objects
 */
export async function fetchLatestBlogPosts(feedUrl = '') {
  if (!feedUrl) {
    return getFallbackBlogPosts();
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    return (feed.items || []).slice(0, 4).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : '',
      snippet: item.contentSnippet ? item.contentSnippet.slice(0, 100) + '...' : ''
    }));
  } catch (error) {
    console.warn(`[blog] Failed to parse RSS feed ${feedUrl}: ${error.message}. Returning default engineering posts.`);
    return getFallbackBlogPosts();
  }
}

function getFallbackBlogPosts() {
  return [
    {
      title: "Building Real-Time Inventory Tracking Systems with WebSockets & PostgreSQL",
      link: "https://github.com/anurag150304",
      pubDate: "Feb 2026",
      snippet: "How optimistic versioning and WebSockets solved concurrency control and reduced stock reconciliation errors by 90%."
    },
    {
      title: "Scaling Next.js & Node.js Applications with Redis Pub/Sub",
      link: "https://github.com/anurag150304",
      pubDate: "Jan 2026",
      snippet: "A practical guide to scaling WebSocket servers horizontally across microservice containers."
    },
    {
      title: "Clean Architecture in TypeScript & Prisma ORM",
      link: "https://github.com/anurag150304",
      pubDate: "Dec 2025",
      snippet: "Structuring full-stack enterprise applications for maintainability and 60% faster reporting workflows."
    }
  ];
}
