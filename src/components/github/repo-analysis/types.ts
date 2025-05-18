import type React from "react";

export interface RepoData {
  commits: Record<string, Array<{ message: string; id: string }>>;
  issues: Record<string, Array<{ title: string; body: string }>>;
  prs: Record<string, Array<{ title: string; body: string }>>;
  teamwork: {
    issueComments: Record<string, number>;
    prReviews: Record<string, number>;
  };
}

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