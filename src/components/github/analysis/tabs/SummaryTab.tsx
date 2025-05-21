import { useMemo, useEffect, useRef, useContext } from "react";
import { Box } from "@mui/material";
import { RepoData } from "@/services/github/types";
import ContributionTable from "../components/ContributionTable";
import StudentOrderer from "../components/StudentOrderer";
import { calculateContributionStats } from "../utils/contributionUtils";
import { RepoContext } from "@/components/github/repo-analysis/RepoResults";

interface SummaryTabProps {
	data: RepoData;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ data }) => {
	// 使用RepoContext替代全局state
	const { repoStudents, setRepoStudents, isInitialized, setIsInitialized } = useContext(RepoContext);
	
	// 跟踪当前数据源的引用，用于检测数据变化
	const dataRef = useRef<RepoData | null>(null);

	// 初始化学生顺序，但在已初始化时保留现有顺序
	useEffect(() => {
		// 只有在未初始化状态或初次加载数据时才进行初始化
		if (!isInitialized) {
			// 检查数据是否变化
			const dataChanged = dataRef.current !== data;
			dataRef.current = data;
			
			// 获取贡献者列表
			const actualContributors = Array.from(
				new Set([
					...Object.keys(data.commits),
					...Object.keys(data.issues),
					...Object.keys(data.prs),
				])
			);

			// 只有在有新贡献者或学生列表为空时才更新
			if (actualContributors.length > 0 && (repoStudents.length === 0 || dataChanged)) {
				// 最多只包含7个贡献者
				const updatedOrder = actualContributors.slice(0, 7);
				
				// 如果有排序的学生数据，保留相同的学生，只添加新学生
				if (repoStudents.length > 0 && !dataChanged) {
					// 保留现有顺序，只添加新学生
					const existingStudents = new Set(repoStudents);
					const newStudents = updatedOrder.filter(student => !existingStudents.has(student));
					setRepoStudents([...repoStudents, ...newStudents]);
				} else {
					// 全新初始化
					setRepoStudents(updatedOrder);
				}
			} else if (actualContributors.length === 0 && repoStudents.length === 0) {
				// 如果没有贡献者且学生列表为空，设置为空数组
				setRepoStudents([]);
			}
			
			// 标记为已初始化
			setIsInitialized(true);
		}
	}, [data, repoStudents, setRepoStudents, isInitialized, setIsInitialized]);

	// 计算统计数据
	const { commitsByUser, issuesByUser, prsByUser } = useMemo(() => {
		return calculateContributionStats(data, repoStudents);
	}, [data, repoStudents]);

	// 只有在有学生时才显示StudentOrderer
	return (
		<Box className="flex flex-col">
			{repoStudents.length > 0 && <StudentOrderer />}
			<Box>
				<ContributionTable
					color="primary"
					data={commitsByUser}
					title="Commits by Contributor"
				/>

				<ContributionTable
					color="secondary"
					data={issuesByUser}
					title="Issues by Contributor"
				/>

				<ContributionTable
					color="info"
					data={prsByUser}
					title="Pull Requests by Contributor"
				/>
			</Box>
		</Box>
	);
};

export default SummaryTab;
