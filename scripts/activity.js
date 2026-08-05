import { Octokit } from '@octokit/rest';

/**
 * Fetches recent public GitHub activity events for user.
 * @param {string} username 
 * @returns {Array} List of formatted activity items
 */
export async function fetchLatestActivity(username = 'anurag150304') {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const octokit = token ? new Octokit({ auth: token }) : new Octokit();

  try {
    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username,
      per_page: 10
    });

    const formattedEvents = events
      .filter(evt => ['PushEvent', 'CreateEvent', 'WatchEvent', 'IssuesEvent', 'PullRequestEvent'].includes(evt.type))
      .slice(0, 5)
      .map(evt => {
        const repoName = evt.repo.name;
        const repoUrl = `https://github.com/${repoName}`;
        
        switch (evt.type) {
          case 'PushEvent': {
            const commitMsg = evt.payload?.commits?.[0]?.message?.split('\n')[0] || 'Updated codebase';
            return `🔨 Pushed to [${repoName}](${repoUrl}): *"${commitMsg}"*`;
          }
          case 'CreateEvent':
            return `🚀 Created ${evt.payload?.ref_type || 'repository'} in [${repoName}](${repoUrl})`;
          case 'WatchEvent':
            return `⭐ Starred repository [${repoName}](${repoUrl})`;
          case 'PullRequestEvent':
            return `🔀 ${evt.payload?.action} PR in [${repoName}](${repoUrl})`;
          case 'IssuesEvent':
            return `📌 ${evt.payload?.action} issue in [${repoName}](${repoUrl})`;
          default:
            return `⚡ Active on [${repoName}](${repoUrl})`;
        }
      });

    if (formattedEvents.length > 0) {
      return formattedEvents;
    }
  } catch (error) {
    console.warn(`[activity] Could not fetch live activity for ${username}: ${error.message}`);
  }

  // Fallback activity list showcasing active developer endeavors
  return [
    "🚀 Architected real-time Inventory Stock Management System with WebSockets & Optimistic Concurrency Control",
    "⚡ Scaled enterprise platforms (HRMS & CRM) supporting 100+ active users",
    "📦 Published reusable TypeScript utility modules & Prisma database migrations",
    "⚙️ Configured Docker containers & CI/CD workflows for automated deployments",
    "📚 Deepening knowledge in Distributed Systems, Redis Pub/Sub & Microservices Architecture"
  ];
}
