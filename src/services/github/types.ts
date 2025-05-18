// GitHub API response types and interfaces

// Main repository data structure
export interface RepoData {
  commits: Record<string, Array<{ message: string; id: string; commitDate: string }>>;
  issues: Record<string, Array<{ title: string; body: string }>>;
  prs: Record<string, Array<{ title: string; body: string }>>;
  teamwork: {
    issueComments: Record<string, number>;
    prReviews: Record<string, number>;
  };
}

// Repository info parsed from URL
export interface RepoInfo {
  owner: string;
  repo: string;
}

// Options for data fetching
export interface FetchOptions {
  hideMergeCommits?: boolean;
}

// Commit data structure
export interface Commit {
  id: string;
  message: string;
  commitDate: string;
}

// Issue data structure
export interface Issue {
  title: string;
  body: string;
}

// Pull request data structure
export interface PullRequest {
  title: string;
  body: string;
}

// Teamwork statistics
export interface TeamworkData {
  issueComments: Record<string, number>;
  prReviews: Record<string, number>;
} 