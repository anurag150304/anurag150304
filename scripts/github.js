import { Octokit } from '@octokit/rest';

/**
 * Initializes Octokit instance using GITHUB_TOKEN or GH_TOKEN if available.
 */
function getOctokit() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return token ? new Octokit({ auth: token }) : new Octokit();
}

/**
 * Fetches GitHub user statistics & top repositories.
 * @param {string} username 
 * @returns {object}
 */
export async function fetchGitHubStats(username = 'anurag150304') {
  const octokit = getOctokit();
  try {
    const { data: user } = await octokit.rest.users.getByUsername({ username });

    // Fetch user public repos to calculate total stars & forks
    let totalStars = 0;
    let totalForks = 0;
    let repos = [];

    try {
      const { data: userRepos } = await octokit.rest.repos.listForUser({
        username,
        sort: 'updated',
        per_page: 30
      });
      repos = userRepos;
      userRepos.forEach(repo => {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
      });
    } catch (repoErr) {
      console.warn(`[github] Warning listing repos for ${username}:`, repoErr.message);
    }

    return {
      username: user.login,
      name: user.name || username,
      avatarUrl: user.avatar_url,
      followers: user.followers || 0,
      following: user.following || 0,
      publicRepos: user.public_repos || 0,
      totalStars,
      totalForks,
      bio: user.bio || '',
      location: user.location || '',
      recentRepos: repos.slice(0, 4).map(r => ({
        name: r.name,
        description: r.description || 'No description provided.',
        url: r.html_url,
        language: r.language || 'JavaScript',
        stars: r.stargazers_count,
        forks: r.forks_count
      }))
    };
  } catch (error) {
    console.warn(`[github] Unable to fetch live stats for ${username}: ${error.message}. Using fallback data.`);
    return {
      username,
      name: 'Anurag',
      avatarUrl: `https://github.com/${username}.png`,
      followers: 15,
      following: 20,
      publicRepos: 12,
      totalStars: 45,
      totalForks: 10,
      recentRepos: []
    };
  }
}
