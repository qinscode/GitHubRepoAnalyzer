import { Box } from "@mui/material";
import { EmojiEvents as BonusIcon } from "@mui/icons-material";
import { bonusMarksTheme } from "../../components/AnalysisThemes";
import AnalysisTabLayout from "../../components/layout/AnalysisTabLayout.tsx";
import { useStudentStore } from "@/store/useStudentStore";
import { BonusMarksTabProps } from "./types";
import { useContributors } from "./useContributors";
import { useBonusMarks } from "./useBonusMarks";
import { menuProps, selectStyles } from "./styles";
import WarningAlert from "./WarningAlert";
import ContributorsTable from "./ContributorsTable";
import { useState, useEffect } from "react";

function BonusMarksTab({ data }: BonusMarksTabProps) {
	const { studentOrder } = useStudentStore();
	const contributors = useContributors(data, studentOrder);
	const { bonusMarks, totalBonusMarks, handleMarkChange } =
		useBonusMarks(contributors);

	// State to track custom order of contributors
	const [customOrder, setCustomOrder] = useState<Array<string>>([]);

	// Initialize custom order when contributors change
	useEffect(() => {
		setCustomOrder(contributors);
	}, [contributors]);

	// Handle reordering of contributors
	const handleReorder = (newOrder: Array<string>) => {
		setCustomOrder(newOrder);
	};

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
					contributors={customOrder.length > 0 ? customOrder : contributors}
					handleMarkChange={handleMarkChange}
					menuProps={menuProps}
					selectStyles={selectStyles}
					studentOrder={studentOrder}
					totalBonusMarks={totalBonusMarks}
					onReorder={handleReorder}
				/>
			</Box>
		</AnalysisTabLayout>
	);
}

export default BonusMarksTab;
