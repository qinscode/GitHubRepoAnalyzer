import { Box } from "@mui/material";
import { EmojiEvents as BonusIcon } from "@mui/icons-material";
import { bonusMarksTheme } from "../../components/AnalysisThemes";
import AnalysisTabLayout from "../../components/layout/AnalysisTabLayout.tsx";
import { RepoContext } from "@/components/github/repo-analysis/RepoResults";
import { BonusMarksTabProps } from "./types";
import { useContributors } from "./useContributors";
import { useBonusMarks } from "./useBonusMarks";
import { menuProps, selectStyles } from "./styles";
import WarningAlert from "./WarningAlert";
import ContributorsTable from "./ContributorsTable";
import { useCallback, useContext } from "react";

function BonusMarksTab({ data }: BonusMarksTabProps) {
	// 使用RepoContext获取仓库特定的学生顺序
	const { repoStudents, reorderRepoStudents } = useContext(RepoContext);

	// 获取所有可能的贡献者
	const contributors = useContributors(data, repoStudents);

	// 使用所有贡献者初始化bonus marks
	const { bonusMarks, totalBonusMarks, handleMarkChange } =
		useBonusMarks(contributors);

	// 处理重新排序
	const handleReorder = useCallback(
		(activeId: string, overId: string) => {
			if (activeId === overId) return;

			// 在repoStudents中找到索引
			const oldIndex = repoStudents.indexOf(activeId);
			const newIndex = repoStudents.indexOf(overId);

			if (oldIndex !== -1 && newIndex !== -1) {
				// 使用重排序函数更新顺序
				reorderRepoStudents(oldIndex, newIndex);
			}
		},
		[repoStudents, reorderRepoStudents]
	);

	return (
		<AnalysisTabLayout
			creatorCount={contributors.length}
			creatorLabel="Total"
			showMoreSwitch={false}
			theme={bonusMarksTheme}
			title="Bonus Marks Analysis"
			totalCount={contributors.length}
			statsIcon={
				<BonusIcon
					sx={{
						color: bonusMarksTheme.main,
						fontSize: "1.1rem",
						filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
					}}
				/>
			}
		>
			<Box sx={{ position: "relative", overflow: "auto" }}>
				<WarningAlert totalBonusMarks={totalBonusMarks} />
				<ContributorsTable
					bonusMarks={bonusMarks}
					contributors={contributors}
					handleMarkChange={handleMarkChange}
					menuProps={menuProps}
					selectStyles={selectStyles}
					studentOrder={repoStudents}
					totalBonusMarks={totalBonusMarks}
					onReorder={handleReorder}
				/>
			</Box>
		</AnalysisTabLayout>
	);
}

export default BonusMarksTab;
