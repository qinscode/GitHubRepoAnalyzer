import axios from 'axios';

interface GitHubRateLimitResponse {
  resources?: {
    core?: {
      remaining?: number;
      reset?: number;
    };
  };
}

export interface RateLimitStatus {
  remaining: number;
  resetAt: number | null;
}

/**
 * Send a GraphQL request to GitHub API
 * @param query GraphQL query
 * @param variables Query variables
 * @param token GitHub access token
 * @returns Response data
 */
export const graphqlRequest = async (
  query: string, 
  variables: Record<string, any>, 
  token: string
): Promise<any> => {
  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      {
        query,
        variables
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('GraphQL API request failed:', error);
    throw new Error(`GitHub API request failed: ${(error as Error).message}`);
  }
}; 

/**
 * Fetch remaining REST API calls for the current hour using GitHub Rate Limit API
 * @param token GitHub access token
 * @returns Remaining API calls and reset timestamp in the hourly budget
 */
export const fetchRateLimitStatus = async (token: string): Promise<RateLimitStatus> => {
  try {
    const response = await axios.get<GitHubRateLimitResponse>(
      'https://api.github.com/rate_limit',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );

    return {
      remaining: response.data.resources?.core?.remaining ?? 0,
      resetAt: response.data.resources?.core?.reset ?? null,
    };
  } catch (error) {
    console.error('Rate limit API request failed:', error);
    throw new Error(`Failed to fetch GitHub rate limit: ${(error as Error).message}`);
  }
};