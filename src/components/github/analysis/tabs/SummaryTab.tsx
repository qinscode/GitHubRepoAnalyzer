import { useMemo, useEffect, useRef, useContext } from "react";
import { Box } from "@mui/material";
import { RepoData } from "@/services/github/types";
import ContributionTable from "../components/ContributionTable";
import StudentOrderer from "../components/StudentOrderer";
import { calculateContributionStats } from "../utils/contributionUtils";
import { RepoContext } from "../../repo-analysis/RepoResults";

interface SummaryTabProps {
	data: RepoData;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ data }) => {
	// 使用RepoContext替代全局state
	const { repoStudents, setRepoStudents } = useContext(RepoContext);
	
	// 跟踪当前数据源的引用，用于检测数据变化
	const dataRef = useRef<RepoData | null>(null);

	// 初始化学生顺序，确保在数据变化时重新处理
	useEffect(() => {
		// 检查数据是否已变化
		const isNewData = dataRef.current !== data;
		
		// 更新数据引用
		dataRef.current = data;
		
		// 如果是新数据或学生列表为空，则重新获取贡献者列表
		if (isNewData || repoStudents.length === 0) {
			// 获取贡献者列表
			const actualContributors = Array.from(
				new Set([
					...Object.keys(data.commits),
					...Object.keys(data.issues),
					...Object.keys(data.prs),
				])
			);

			// 如果有贡献者，更新学生顺序
			if (actualContributors.length > 0) {
				// 最多只包含7个贡献者
				const updatedOrder = actualContributors.slice(0, 7);
				setRepoStudents(updatedOrder);
			} else {
				// 如果没有贡献者，设置为空数组
				setRepoStudents([]);
			}
		}
	}, [data, setRepoStudents, repoStudents.length]);

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
