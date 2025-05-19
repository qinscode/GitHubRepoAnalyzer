import type { RepoData } from "../../services/github/types";
import type React from "react";

// Re-export RepoData type for backwards compatibility
export type { RepoData };

// From index.ts
export interface RepoResult {
  repoUrl: string;
  repoName: string;
  commits: number;
  issues: number;
  prs: number;
  contributors: number;
  data: RepoData;
}

export type RepoStatus = "pending" | "processing" | "completed" | "error";

export interface RepoListItem {
  id: string;
  url: string;
  status: RepoStatus;
  result?: RepoResult;
  error?: string;
}

export interface TokenMessage {
  message: string;
  severity: "success" | "error" | "info";
}

// From types.ts
export interface RepoResultsProps {
  data: RepoData;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface ContributorStats {
  user: string;
  count: number;
  percentage: string;
}

export interface TeamworkStats {
  user: string;
  issueComments: number;
  prReviews: number;
  total: number;
}

// From batchRepoTypes.ts
export interface BatchRepoFormProps {
  onDataFetched: (results: Array<RepoResult>) => void;
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