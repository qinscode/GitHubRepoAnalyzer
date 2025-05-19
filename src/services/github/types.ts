// GitHub API response types and interfaces

// GitHub API contributor statistics 
export interface ContributorStats {
  author: {
    login: string;
    id: number;
    type: string;
  };
  total: number;
  weeks: Array<{
    w: number; // Unix timestamp for start of week
    a: number; // Additions
    d: number; // Deletions
    c: number; // Commits
  }>;
}

// Main repository data structure
export interface RepoData {
  commits: Record<string, Array<{ message: string; id: string; commitDate: string; url?: string }>>;
  issues: Record<string, Array<{ title: string; body: string; date?: string; url?: string }>>;
  prs: Record<string, Array<{ title: string; body: string; date?: string; url?: string }>>;
  teamwork: {
    issueComments: Record<string, number>;
    prReviews: Record<string, number>;
  };
  contributorStats?: Array<ContributorStats>;
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
  url?: string;
}

// Issue data structure
export interface Issue {
  title: string;
  body: string;
  date?: string;
  url?: string;
}

// Pull request data structure
export interface PullRequest {
  title: string;
  body: string;
  date?: string;
  url?: string;
}

// Teamwork statistics
export interface TeamworkData {
  issueComments: Record<string, number>;
  prReviews: Record<string, number>;
} 