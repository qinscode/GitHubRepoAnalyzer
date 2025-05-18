import type { Commit, FetchOptions } from './types';
import { graphqlRequest } from './api';

/**
 * Fetch commit data using GraphQL API
 * @param owner Repository owner
 * @param repo Repository name
 * @param token GitHub access token
 * @param options Optional settings
 * @returns Object mapping users to their commits
 */
export const fetchCommits = async (
  owner: string, 
  repo: string, 
  token: string, 
  options: FetchOptions = {}
): Promise<Record<string, Array<Commit>>> => {
  const query = `
    query GetCommits($owner: String!, $repo: String!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100, after: $cursor) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  oid
                  message
                  committedDate
                  author {
                    name
                    user {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    // Group commits by user
    const commitsByUser: Record<string, Array<Commit>> = {};
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // Use pagination to get more data
    while (hasNextPage) {
      const responseData = await graphqlRequest(query, { owner, repo, cursor }, token);
      
      // Check for valid response
      if (!responseData?.repository?.defaultBranchRef?.target?.history) {
        break;
      }
      
      const history = responseData.repository.defaultBranchRef.target.history;
      const commits = history.nodes;
      
      // Process retrieved commits
      commits.forEach((commit: any) => {
        // Filter merge commits if option is enabled
        if (options.hideMergeCommits && commit.message.toLowerCase().startsWith('merge ')) {
          return;
        }
        
        const authorLogin = commit.author?.user?.login;
        const authorName = commit.author?.name;
        const author = authorLogin || authorName || 'Unknown';
        
        if (!commitsByUser[author]) {
          commitsByUser[author] = [];
        }
        
        // Limit to maximum 50 commits per user
        if (commitsByUser[author].length < 50) {
          commitsByUser[author].push({
            id: commit.oid,
            message: commit.message,
            commitDate: commit.committedDate
          });
        }
      });
      
      // Update pagination info
      hasNextPage = history.pageInfo.hasNextPage;
      cursor = history.pageInfo.endCursor;
      
      // Stop fetching if all users already have 50 commits
      const allUsersFull = Object.values(commitsByUser).every(commits => commits.length >= 50);
      if (allUsersFull) {
        break;
      }
    }
    
    return commitsByUser;
  } catch (error) {
    console.error('Failed to fetch commits:', error);
    throw new Error(`Failed to fetch commit history: ${(error as Error).message}`);
  }
}; 