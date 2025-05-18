import type { RepoData, FetchOptions } from './types';
import { parseRepoUrl } from './utils';
import { fetchCommits } from './commits';
import { fetchIssues } from './issues';
import { fetchPullRequests } from './pullRequests';

/**
 * Fetch all repository data using GraphQL API
 * @param repoUrl GitHub repository URL
 * @param token GitHub access token
 * @param options Optional settings
 * @returns Complete repository data
 */
export const fetchRepositoryData = async (
  repoUrl: string, 
  token: string, 
  options: FetchOptions = {}
): Promise<RepoData> => {
  const repoInfo = parseRepoUrl(repoUrl);

  if (!repoInfo) {
    throw new Error('Invalid repository URL format. Please use https://github.com/owner/repo or owner/repo format');
  }

  const { owner, repo } = repoInfo;

  try {
    // 1. Fetch commit data with filtering options
    const commits = await fetchCommits(owner, repo, token, options);

    // 2. Fetch issues data
    const { issuesByUser, issueCommentsByUser } = await fetchIssues(owner, repo, token);

    // 3. Fetch PR data
    const { prsByUser, prReviewsByUser } = await fetchPullRequests(owner, repo, token);

    // 4. Build teamwork data
    const teamwork = {
      issueComments: issueCommentsByUser,
      prReviews: prReviewsByUser
    };

    return {
      commits,
      issues: issuesByUser,
      prs: prsByUser,
      teamwork
    };
  } catch (error) {
    console.error('Failed to fetch repository data:', error);
    throw new Error(`Failed to fetch repository data: ${(error as Error).message}`);
  }
};

// Re-export utility functions and types
export { parseRepoUrl };
export * from './types'; 