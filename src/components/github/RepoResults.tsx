import type { RepoData } from './repo-analysis/types';
import ModularRepoResults from './repo-analysis/RepoResults';

// Re-export component to maintain backward compatibility
export default ModularRepoResults;

// Export RepoData type for type compatibility
export type { RepoData };