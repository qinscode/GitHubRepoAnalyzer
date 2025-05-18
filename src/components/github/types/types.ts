import type React from "react";
import type { RepoData } from "../../../services/github/types";

// Re-export RepoData type for backwards compatibility
export type { RepoData };

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