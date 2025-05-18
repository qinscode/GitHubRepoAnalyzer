export interface BatchRepoFormProps {
  onDataFetched: (results: Array<any>) => void;
}

export interface RepoResult {
  repoUrl: string;
  repoName: string;
  commits: number;
  issues: number;
  prs: number;
  contributors: number;
  data: any;
}

export type RepoStatus = "pending" | "processing" | "completed" | "error";

export interface RepoListItem {
  id: string;
  url: string;
  status: RepoStatus;
  result?: RepoResult;
  error?: string;
}

export interface RepoStatusListProps {
  repoItems: Array<RepoListItem>;
  extractRepoName: (url: string) => string;
}

export interface RepoStatusItemProps {
  item: RepoListItem;
  extractRepoName: (url: string) => string;
}

export interface ProcessingProgressProps {
  loading: boolean;
  currentIndex: number;
  repoItemsLength: number;
  progress: number;
}

export interface AnalysisOptionsProps {
  hideMergeCommits: boolean;
  setHideMergeCommits: (value: boolean) => void;
}

export interface FormActionsProps {
  loading: boolean;
  error: string | null;
  success: boolean;
  repoItemsLength: number;
  onClear: () => void;
} 