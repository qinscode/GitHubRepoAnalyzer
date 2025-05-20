import { useMemo, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { RepoData } from "@/services/github/types";
import { useStudentStore } from "@/store/useStudentStore";
import ContributionTable from "../components/ContributionTable";
import StudentOrderer from "../components/StudentOrderer";
import { calculateContributionStats } from "../utils/contributionUtils";

interface SummaryTabProps {
	data: RepoData;
}

const SummaryTab: React.FC<SummaryTabProps> = ({ data }) => {
	const { studentOrder, setStudentOrder } = useStudentStore();

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

		// If we have actual contributors, update the student order with only actual contributors
		if (actualContributors.length > 0) {
			// Only include actual contributors, up to maximum of 7
			const updatedOrder = actualContributors.slice(0, 7);
			setStudentOrder(updatedOrder);
		} else {
			// If no contributors, set empty array
			setStudentOrder([]);
		}
		
		// Mark as initialized
		initializedRef.current = true;
	}, [data, setStudentOrder]); // Removed studentOrder from dependencies to prevent loop

	// Calculate statistics data
	const { commitsByUser, issuesByUser, prsByUser } = useMemo(() => {
		return calculateContributionStats(data, studentOrder);
	}, [data, studentOrder]);

	// Only show StudentOrderer if there are actual students
	return (
		<Box className="flex flex-col">
			{studentOrder.length > 0 && <StudentOrderer />}
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
