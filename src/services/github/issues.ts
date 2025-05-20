import type { Issue } from './types';
import { graphqlRequest } from './api';

/**
 * Fetch issues data using GraphQL API
 * @param owner Repository owner
 * @param repo Repository name
 * @param token GitHub access token
 * @returns Object containing issues and comment statistics
 */
export const fetchIssues = async (owner: string, repo: string, token: string): Promise<{
  issuesByUser: Record<string, Array<Issue>>;
  issueCommentsByUser: Record<string, number>;
}> => {
  const query = `
    query GetIssues($owner: String!, $repo: String!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        issues(first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            body
            url
            createdAt
            author {
              login
            }
            comments(first: 30) {
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
    // Group issues by user
    const issuesByUser: Record<string, Array<Issue>> = {};
    // Store issue comment statistics - will track unique issues commented on by each user
    const issueCommentsByUser: Record<string, number> = {};
    // Keep track of which issues each user has commented on to avoid double counting
    const commentedIssuesByUser: Record<string, Set<string>> = {};
    
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // Use pagination to get more data
    while (hasNextPage) {
      const responseData = await graphqlRequest(query, { owner, repo, cursor }, token);
      
      // Check for valid response
      if (!responseData?.repository?.issues) {
        break;
      }
      
      const issuesData = responseData.repository.issues;
      const issues = issuesData.nodes;
      
      // Process retrieved issues
      issues.forEach((issue: any) => {
        const issueId = issue.id;
        const author = issue.author?.login || 'Unknown';
        
        // Process the issue itself
        if (!issuesByUser[author]) {
          issuesByUser[author] = [];
        }
        
        // Limit to maximum 50 issues per user
        if (issuesByUser[author].length < 50) {
          issuesByUser[author].push({
            title: issue.title,
            body: issue.body || '',
            url: issue.url,
            date: issue.createdAt ? new Date(issue.createdAt).toLocaleString() : undefined
          });
        }
        
        // Process issue comments
        if (issue.comments?.nodes) {
          issue.comments.nodes.forEach((comment: any) => {
            const commentAuthor = comment.author?.login || 'Unknown';
            
            // Don't count comments on own issues
            if (commentAuthor !== author) {
              // Initialize tracking structures if not exists
              if (!commentedIssuesByUser[commentAuthor]) {
                commentedIssuesByUser[commentAuthor] = new Set();
              }
              if (!issueCommentsByUser[commentAuthor]) {
                issueCommentsByUser[commentAuthor] = 0;
              }
              
              // If this user hasn't commented on this issue before, count it
              if (!commentedIssuesByUser[commentAuthor].has(issueId)) {
                commentedIssuesByUser[commentAuthor].add(issueId);
                issueCommentsByUser[commentAuthor] += 1;
              }
            }
          });
        }
      });
      
      // Update pagination info
      hasNextPage = issuesData.pageInfo.hasNextPage;
      cursor = issuesData.pageInfo.endCursor;
      
      // Stop fetching if all users already have 50 issues
      const allUsersFull = Object.values(issuesByUser).every(issues => issues.length >= 50);
      if (allUsersFull) {
        break;
      }
    }
    
    return { issuesByUser, issueCommentsByUser };
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    throw new Error(`Failed to fetch issues list: ${(error as Error).message}`);
  }
}; 