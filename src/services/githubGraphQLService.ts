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

// 处理仓库 URL，提取 owner 和 repo 名称
export const parseRepoUrl = (url: string): { owner: string; repo: string } | null => {
  try {
    // 处理完整 URL 格式
    if (url.includes('github.com')) {
      const parsed = new URL(url);
      const pathSegments = parsed.pathname.split('/').filter(Boolean);
      if (pathSegments.length >= 2) {
        const owner = pathSegments[0];
        const repo = pathSegments[1];
        
        if (owner && repo) {
          return { owner, repo };
        }
      }
    } 
    // 处理简短格式 owner/repo
    else if (url.includes('/')) {
      const [owner, repo] = url.split('/');
      if (owner && repo) {
        return { owner, repo };
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to parse repo URL:', error);
    return null;
  }
};

// 使用GraphQL API获取提交数据
const fetchCommits = async (owner: string, repo: string, token: string): Promise<Record<string, Array<{message: string, id: string}>>> => {
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
    // 按用户分组提交记录
    const commitsByUser: Record<string, Array<{message: string, id: string}>> = {};
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // 使用分页获取更多数据
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
      
      // 检查是否有效响应
      if (!responseData?.repository?.defaultBranchRef?.target?.history) {
        break;
      }
      
      const history = responseData.repository.defaultBranchRef.target.history;
      const commits = history.nodes;
      
      // 处理获取的提交
      commits.forEach((commit: any) => {
        const authorLogin = commit.author?.user?.login;
        const authorName = commit.author?.name;
        const author = authorLogin || authorName || 'Unknown';
        
        if (!commitsByUser[author]) {
          commitsByUser[author] = [];
        }
        
        // 限制每个用户最多50条提交
        if (commitsByUser[author].length < 50) {
          commitsByUser[author].push({
            id: commit.oid,
            message: commit.message
          });
        }
      });
      
      // 更新分页信息
      hasNextPage = history.pageInfo.hasNextPage;
      cursor = history.pageInfo.endCursor;
      
      // 如果所有用户都已经有50条提交，则停止获取
      const allUsersFull = Object.values(commitsByUser).every(commits => commits.length >= 50);
      if (allUsersFull) {
        break;
      }
    }
    
    return commitsByUser;
  } catch (error) {
    console.error('Failed to fetch commits:', error);
    throw new Error(`获取提交历史失败: ${(error as Error).message}`);
  }
};

// 使用GraphQL API获取Issues数据
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
    // 按用户分组issues
    const issuesByUser: Record<string, Array<{title: string, body: string}>> = {};
    // 用于存储issue评论统计
    const issueCommentsByUser: Record<string, number> = {};
    
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // 使用分页获取更多数据
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
      
      // 检查是否有效响应
      if (!responseData?.repository?.issues) {
        break;
      }
      
      const issuesData = responseData.repository.issues;
      const issues = issuesData.nodes;
      
      // 处理获取的issues
      issues.forEach((issue: any) => {
        const author = issue.author?.login || 'Unknown';
        
        // 处理issue本身
        if (!issuesByUser[author]) {
          issuesByUser[author] = [];
        }
        
        // 限制每个用户最多50个issue
        if (issuesByUser[author].length < 50) {
          issuesByUser[author].push({
            title: issue.title,
            body: issue.body || ''
          });
        }
        
        // 处理issue评论
        if (issue.comments?.nodes) {
          issue.comments.nodes.forEach((comment: any) => {
            const commentAuthor = comment.author?.login || 'Unknown';
            
            // 不统计自己评论自己的issue
            if (commentAuthor !== author) {
              if (!issueCommentsByUser[commentAuthor]) {
                issueCommentsByUser[commentAuthor] = 0;
              }
              issueCommentsByUser[commentAuthor] += 1;
            }
          });
        }
      });
      
      // 更新分页信息
      hasNextPage = issuesData.pageInfo.hasNextPage;
      cursor = issuesData.pageInfo.endCursor;
      
      // 如果所有用户都已经有50个issue，则停止获取
      const allUsersFull = Object.values(issuesByUser).every(issues => issues.length >= 50);
      if (allUsersFull) {
        break;
      }
    }
    
    return { issuesByUser, issueCommentsByUser };
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    throw new Error(`获取问题列表失败: ${(error as Error).message}`);
  }
};




// 使用GraphQL API获取PR数据
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
    // 按用户分组PRs
    const prsByUser: Record<string, Array<{title: string}>> = {};
    // 用于存储PR评审统计
    const prReviewsByUser: Record<string, number> = {};
    
    let hasNextPage = true;
    let cursor: string | null = null;
    
    // 使用分页获取更多数据
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
      
      // 检查是否有效响应
      if (!responseData?.repository?.pullRequests) {
        break;
      }
      
      const prsData = responseData.repository.pullRequests;
      const prs = prsData.nodes;
      
      // 处理获取的PRs
      prs.forEach((pr: any) => {
        const author = pr.author?.login || 'Unknown';
        
        // 处理PR本身
        if (!prsByUser[author]) {
          prsByUser[author] = [];
        }
        
        // 限制每个用户最多50个PR
        if (prsByUser[author].length < 50) {
          prsByUser[author].push({
            title: pr.title
          });
        }
        
        // 处理PR评审
        if (pr.reviews?.nodes) {
          pr.reviews.nodes.forEach((review: any) => {
            const reviewAuthor = review.author?.login || 'Unknown';
            
            // 不统计自己评审自己的PR
            if (reviewAuthor !== author) {
              if (!prReviewsByUser[reviewAuthor]) {
                prReviewsByUser[reviewAuthor] = 0;
              }
              prReviewsByUser[reviewAuthor] += 1;
            }
          });
        }
      });
      
      // 更新分页信息
      hasNextPage = prsData.pageInfo.hasNextPage;
      cursor = prsData.pageInfo.endCursor;
      
      // 如果所有用户都已经有50个PR，则停止获取
      const allUsersFull = Object.values(prsByUser).every(prs => prs.length >= 50);
      if (allUsersFull) {
        break;
      }
    }
    
    return { prsByUser, prReviewsByUser };
  } catch (error) {
    console.error('Failed to fetch pull requests:', error);
    throw new Error(`获取 PR 列表失败: ${(error as Error).message}`);
  }
};

// 使用GraphQL API获取仓库数据

export const fetchRepositoryData = async (repoUrl: string, token: string): Promise<RepoData> => {
	const repoInfo = parseRepoUrl(repoUrl);

	if (!repoInfo) {
		throw new Error('无效的仓库 URL 格式，请使用 https://github.com/owner/repo 或 owner/repo 格式');
	}

	const { owner, repo } = repoInfo;

	try {
		// 1. 获取提交数据
		const commits = await fetchCommits(owner, repo, token);

		// 2. 获取Issues数据
		const { issuesByUser, issueCommentsByUser } = await fetchIssues(owner, repo, token);

		// 3. 获取PR数据
		const { prsByUser, prReviewsByUser } = await fetchPullRequests(owner, repo, token);

		// 4. 构建团队协作数据
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
		throw new Error(`获取仓库数据失败: ${(error as Error).message}`);
	}
};
