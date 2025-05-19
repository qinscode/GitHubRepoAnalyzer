import type { RepoData } from "../../../services/github";

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