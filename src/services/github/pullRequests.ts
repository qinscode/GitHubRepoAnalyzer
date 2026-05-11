import axios from 'axios';
import type { PullRequest } from './types';
import { graphqlRequest } from './api';

interface GitHubPullRequestNode {
  number: number;
  title: string;
  body?: string | null;
  url: string;
  createdAt?: string;
  author?: {
    login?: string;
  } | null;
}

interface GitHubPullRequestsResponse {
  repository?: {
    pullRequests?: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: Array<GitHubPullRequestNode>;
    };
  };
}

interface GitHubReview {
  user?: {
    login?: string;
  } | null;
  body?: string | null;
}

interface GitHubReviewComment {
  user?: {
    login?: string;
  } | null;
  body?: string | null;
}

const REST_HEADERS = {
  Accept: 'application/vnd.github+json',
};

const countWords = (text: string): number => {
  const normalizedText = text
    .replace(/[\n\r\t]+/g, ' ')
    .replace(/[`*_>#~-]+/g, ' ')
    .trim();

  return normalizedText ? normalizedText.split(/\s+/).length : 0;
};

const incrementCount = (counts: Record<string, number>, user: string): void => {
  counts[user] = (counts[user] || 0) + 1;
};

const fetchPaginatedRest = async <T>(url: string, token: string): Promise<Array<T>> => {
  const items: Array<T> = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await axios.get<Array<T>>(url, {
      headers: {
        Authorization: `token ${token}`,
        ...REST_HEADERS,
      },
      params: new URLSearchParams({
        per_page: '100',
        page: String(page),
      }),
    });

    items.push(...response.data);
    hasNextPage = response.data.length === 100;
    page += 1;
  }

  return items;
};

const fetchPullRequestReviewMetrics = async (
  owner: string,
  repo: string,
  pullRequestNumber: number,
  pullRequestAuthor: string,
  token: string
): Promise<{
  reviewers: Set<string>;
  substantiveReviewers: Set<string>;
}> => {
  const reviewsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequestNumber}/reviews`;
  const commentsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequestNumber}/comments`;

  const [reviews, reviewComments] = await Promise.all([
    fetchPaginatedRest<GitHubReview>(reviewsUrl, token),
    fetchPaginatedRest<GitHubReviewComment>(commentsUrl, token),
  ]);

  const reviewers = new Set<string>();
  const wordCountsByReviewer = new Map<string, number>();
  const inlineCommenters = new Set<string>();

  const addWords = (reviewer: string, text: string | null | undefined): void => {
    const wordCount = countWords(text || '');
    wordCountsByReviewer.set(reviewer, (wordCountsByReviewer.get(reviewer) || 0) + wordCount);
  };

  reviews.forEach((review) => {
    const reviewer = review.user?.login || 'Unknown';

    if (reviewer === pullRequestAuthor) {
      return;
    }

    reviewers.add(reviewer);
    addWords(reviewer, review.body);
  });

  reviewComments.forEach((comment) => {
    const reviewer = comment.user?.login || 'Unknown';

    if (reviewer === pullRequestAuthor) {
      return;
    }

    reviewers.add(reviewer);
    inlineCommenters.add(reviewer);
  });

  const substantiveReviewers = new Set(
    [...wordCountsByReviewer.entries()]
      .filter(([, wordCount]) => wordCount > 30)
      .map(([reviewer]) => reviewer)
  );

  inlineCommenters.forEach((reviewer) => substantiveReviewers.add(reviewer));

  return { reviewers, substantiveReviewers };
};

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
  commentedReviewsByUser: Record<string, number>;
  substantiveReviewedPrsByUser: Record<string, Array<PullRequest>>;
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
            number
            title
            body
            url
            createdAt
            author {
              login
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
    const commentedReviewsByUser: Record<string, number> = {};
    const substantiveReviewedPrsByUser: Record<string, Array<PullRequest>> = {};
    
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // Use pagination to get more data
    while (hasNextPage) {
      const responseData = await graphqlRequest(query, { owner, repo, cursor }, token) as GitHubPullRequestsResponse;
      
      // Check for valid response
      if (!responseData?.repository?.pullRequests) {
        break;
      }
      
      const prsData = responseData.repository.pullRequests;
      const prs = prsData.nodes;
      
      // Process retrieved PRs
      for (const pr of prs) {
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
            url: pr.url,
            date: pr.createdAt ? new Date(pr.createdAt).toLocaleString() : undefined
          });
        }

        const { reviewers, substantiveReviewers } = await fetchPullRequestReviewMetrics(
          owner,
          repo,
          pr.number,
          author,
          token
        );

        reviewers.forEach((reviewer) => {
          incrementCount(prReviewsByUser, reviewer);
        });

        substantiveReviewers.forEach((reviewer) => {
          incrementCount(commentedReviewsByUser, reviewer);

          if (!substantiveReviewedPrsByUser[reviewer]) {
            substantiveReviewedPrsByUser[reviewer] = [];
          }

          if (substantiveReviewedPrsByUser[reviewer].length < 50) {
            substantiveReviewedPrsByUser[reviewer].push({
              title: pr.title,
              body: pr.body || '',
              url: pr.url,
              date: pr.createdAt ? new Date(pr.createdAt).toLocaleString() : undefined
            });
          }
        });
      }
      
      // Update pagination info
      hasNextPage = prsData.pageInfo.hasNextPage;
      cursor = prsData.pageInfo.endCursor;
      
    }
    
    return {
      prsByUser,
      prReviewsByUser,
      commentedReviewsByUser,
      substantiveReviewedPrsByUser
    };
  } catch (error) {
    console.error('Failed to fetch pull requests:', error);
    throw new Error(`Failed to fetch PR list: ${(error as Error).message}`);
  }
}; 