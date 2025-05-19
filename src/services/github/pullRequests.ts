import type { PullRequest } from './types';
import { graphqlRequest } from './api';

/**
 * Fetch pull request data using GraphQL API
 * @param owner Repository owner
 * @param repo Repository name
 * @param token GitHub access token
 * @returns Object containing PRs and review statistics
 */
export const fetchPullRequests = async (owner: string, repo: string, token: string): Promise<{
  prsByUser: Record<string, Array<PullRequest>>;
  prReviewsByUser: Record<string, number>;
}> => {
  const query = `
    query GetPullRequests($owner: String!, $repo: String!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        pullRequests(first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            title
            body
            url
            author {
              login
            }
            reviews(first: 30) {
              nodes {
                author {
                  login
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    // Group PRs by user
    const prsByUser: Record<string, Array<PullRequest>> = {};
    // Store PR review statistics
    const prReviewsByUser: Record<string, number> = {};
    
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // Use pagination to get more data
    while (hasNextPage) {
      const responseData = await graphqlRequest(query, { owner, repo, cursor }, token);
      
      // Check for valid response
      if (!responseData?.repository?.pullRequests) {
        break;
      }
      
      const prsData = responseData.repository.pullRequests;
      const prs = prsData.nodes;
      
      // Process retrieved PRs
      prs.forEach((pr: any) => {
        const author = pr.author?.login || 'Unknown';
        
        // Process the PR itself
        if (!prsByUser[author]) {
          prsByUser[author] = [];
        }
        
        // Limit to maximum 50 PRs per user
        if (prsByUser[author].length < 50) {
          prsByUser[author].push({
            title: pr.title,
            body: pr.body || '',
            url: pr.url
          });
        }
        
        // Process PR reviews
        if (pr.reviews?.nodes) {
          pr.reviews.nodes.forEach((review: any) => {
            const reviewAuthor = review.author?.login || 'Unknown';
            
            // Don't count self-reviewing own PRs
            if (reviewAuthor !== author) {
              if (!prReviewsByUser[reviewAuthor]) {
                prReviewsByUser[reviewAuthor] = 0;
              }
              prReviewsByUser[reviewAuthor] += 1;
            }
          });
        }
      });
      
      // Update pagination info
      hasNextPage = prsData.pageInfo.hasNextPage;
      cursor = prsData.pageInfo.endCursor;
      
      // Stop fetching if all users already have 50 PRs
      const allUsersFull = Object.values(prsByUser).every(prs => prs.length >= 50);
      if (allUsersFull) {
        break;
      }
    }
    
    return { prsByUser, prReviewsByUser };
  } catch (error) {
    console.error('Failed to fetch pull requests:', error);
    throw new Error(`Failed to fetch PR list: ${(error as Error).message}`);
  }
}; 