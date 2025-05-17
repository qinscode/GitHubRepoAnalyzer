import type { RepoData } from './repo-analysis/types';
import ModularRepoResults from './repo-analysis/RepoResults';

// 重新导出组件，保持向后兼容性
export default ModularRepoResults;

// 为了类型兼容性，导出 RepoData 类型
export type { RepoData };