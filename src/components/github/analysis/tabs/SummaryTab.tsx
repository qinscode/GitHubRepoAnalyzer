import { useMemo, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { RepoData } from "@/services/github/types";
import { useStudentStore } from "@/store/useStudentStore";
import ContributionTable from "../components/ContributionTable";
import StudentSelector from "../components/StudentSelector";
import { calculateContributionStats } from "../utils/contributionUtils";

interface SummaryTabProps {
	data: RepoData;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ data }) => {
	const { selectedStudent, studentOrder, setStudentOrder } = useStudentStore();
	
	// Use a ref to track if we've already initialized the student order
	const initializedRef = useRef(false);
	
	// Update student order with actual contributors only once on initial load
	useEffect(() => {
		// Skip if we've already initialized
		if (initializedRef.current) return;
		
		const actualContributors = Array.from(
			new Set([
				...Object.keys(data.commits),
				...Object.keys(data.issues),
				...Object.keys(data.prs),
			])
		);
		
		// If we have actual contributors, update the generic student names
		if (actualContributors.length > 0) {
			const updatedOrder = [...studentOrder];
			for (
				let index = 0;
				index < Math.min(actualContributors.length, 4);
				index++
			) {
				updatedOrder[index] =
					actualContributors[index] || `Student ${index + 1}`;
			}
			setStudentOrder(updatedOrder);
			// Mark as initialized
			initializedRef.current = true;
		}
	}, [data, studentOrder, setStudentOrder]); // Include all dependencies but prevent infinite loop with ref

	// Calculate statistics data
	const { commitsByUser, issuesByUser, prsByUser } = useMemo(() => {
		return calculateContributionStats(data, selectedStudent, studentOrder);
	}, [data, selectedStudent, studentOrder]);

	return (
		<Box className="flex flex-col gap-8">
			<StudentSelector />
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
