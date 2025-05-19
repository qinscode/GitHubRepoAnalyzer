declare module './RepoTabBar' {
  interface RepoTabBarProps {
    tabValue: number;
    handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
    counts: {
      commits: number;
      issues: number;
      prs: number;
    };
    isMobile: boolean;
  }
  
  const RepoTabBar: React.FC<RepoTabBarProps>;
  export default RepoTabBar;
}

declare module './RepoResultsContainer' {
  interface RepoResultsContainerProps {
    children: React.ReactNode;
  }
  
  const RepoResultsContainer: React.FC<RepoResultsContainerProps>;
  export default RepoResultsContainer;
} 