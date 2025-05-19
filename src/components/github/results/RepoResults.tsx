import type { RepoData } from "@/services/github/types";
import ModularRepoResults from "../repo-analysis/RepoResults.tsx";

// Re-export component to maintain backward compatibility
export default ModularRepoResults;

// Export RepoData type for type compatibility
export type { RepoData };
