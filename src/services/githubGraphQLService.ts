import axios from 'axios';

interface RepoData {
  commits: Record<string, Array<{message: string, id: string}>>;
  issues: Record<string, Array<{title: string, body: string}>>;
  prs: Record<string, Array<{title: string}>>;
  teamwork: {
    issueComments: Record<string, number>;
    prReviews: Record<string, number>;
  };
}

// Process repository URL and extract owner and repo name
export const parseRepoUrl = (url: string): { owner: string; repo: string } | null => {
  try {
    if (!url) return null;
    
    // Process input URL, remove possible prefixes and suffixes
    let cleanUrl = url.trim();
    
    // Remove @ prefix
    if (cleanUrl.startsWith('@')) {
      cleanUrl = cleanUrl.substring(1);
    }
    
    // Remove .git suffix (wherever it appears)
    cleanUrl = cleanUrl.replace(/\.git$/i, '');
    
    // Handle full URL format
    if (cleanUrl.includes('github.com')) {
      try {
        const parsed = new URL(cleanUrl);
        const pathSegments = parsed.pathname.split('/').filter(Boolean);
        
        if (pathSegments.length >= 2) {
          const owner = pathSegments[0];
          const repo = pathSegments[1];
          
          if (owner && repo) {
            return { owner, repo };
          }
        }
      } catch (error) {
        // URL parsing failed, try alternative methods
        console.error('URL parsing failed, trying alternative methods:', error);
      }
    } 
    
    // Handle shorthand format owner/repo
    if (cleanUrl.includes('/')) {
      const parts = cleanUrl.split('/');
      // Ensure we have at least owner/repo parts
      if (parts.length >= 2 && parts[0] && parts[1]) {
        const owner = parts[0].trim();
        const repo = parts[1].trim();
        
        if (owner && repo) {
          return { owner, repo };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse repo URL:', error);
    return null;
  }
};

// Fetch commit data using GraphQL API
const fetchCommits = async (
  owner: string, 
  repo: string, 
  token: string, 
  options: { hideMergeCommits?: boolean } = {}
): Promise<Record<string, Array<{message: string, id: string}>>> => {
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
    const commitsByUser: Record<string, Array<{message: string, id: string}>> = {};
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // Use pagination to get more data
    while (hasNextPage) {
      const response = await axios.post(
        'https://api.github.com/graphql',
        {
          query,
          variables: { owner, repo, cursor }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      const responseData = response.data.data;
      
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
            message: commit.message
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

// Fetch issues data using GraphQL API
const fetchIssues = async (owner: string, repo: string, token: string): Promise<{
  issuesByUser: Record<string, Array<{title: string, body: string}>>;
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
    const issuesByUser: Record<string, Array<{title: string, body: string}>> = {};
    // Store issue comment statistics - will track unique issues commented on by each user
    const issueCommentsByUser: Record<string, number> = {};
    // Keep track of which issues each user has commented on to avoid double counting
    const commentedIssuesByUser: Record<string, Set<string>> = {};
    
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // Use pagination to get more data
    while (hasNextPage) {
      const response = await axios.post(
        'https://api.github.com/graphql',
        {
          query,
          variables: { owner, repo, cursor }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      const responseData = response.data.data;
      
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
            body: issue.body || ''
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

// Fetch pull request data using GraphQL API
const fetchPullRequests = async (owner: string, repo: string, token: string): Promise<{
  prsByUser: Record<string, Array<{title: string}>>;
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
    const prsByUser: Record<string, Array<{title: string}>> = {};
    // Store PR review statistics
    const prReviewsByUser: Record<string, number> = {};
    
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // Use pagination to get more data
    while (hasNextPage) {
      const response = await axios.post(
        'https://api.github.com/graphql',
        {
          query,
          variables: { owner, repo, cursor }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      const responseData = response.data.data;
      
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
            title: pr.title
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

// Fetch repository data using GraphQL API
export const fetchRepositoryData = async (
  repoUrl: string, 
  token: string, 
  options: { hideMergeCommits?: boolean } = {}
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
