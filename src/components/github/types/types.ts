import type React from "react";
import type { ComponentRepoData } from "../../../services/github/types";

export type RepoData = ComponentRepoData;

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