import { useMemo } from "react";
import { BugReport as IssueIcon } from "@mui/icons-material";
import type { Issue, RepoData } from "@/services/github";
import UserTabItem from "../components/UserTabItem";
import TabDataTable from "../components/TabDataTable";
import { issuesTheme } from "../components/AnalysisThemes";
import AnalysisTabLayout from "../components/layout/AnalysisTabLayout";
import { useStudentStore } from "@/store/useStudentStore";

interface IssuesTabProps {
	data: RepoData;
}

function UserIssues({
	user,
	issues,
	index,
}: {
	user: string;
	issues: Array<Issue>;
	index: number;
}) {
	return (
		<UserTabItem
			chipLabel="issues"
			icon={<IssueIcon style={{ fontSize: "0.9rem" }} />}
			index={index}
			itemCount={issues.length}
			theme={issuesTheme}
			user={user}
		>
			<TabDataTable
				data={issues}
				emptyMessage="No issues available for this user"
				itemType="issue"
				theme={issuesTheme}
			/>
		</UserTabItem>
	);
}

function IssuesTab({ data }: IssuesTabProps) {
	const { studentOrder } = useStudentStore();

	const issuesByUser = useMemo(() => {
		// Define IssueWithDate as an extension of Issue with a required date property
		interface IssueWithDate extends Issue {
			date: string;
		}
		const users: Record<string, Array<IssueWithDate>> = {};

		// Group issues by user
		Object.entries(data.issues).forEach(([user, issues]) => {
			// Add a default date if missing
			users[user] = issues.map((issue) => ({
				...issue,
				date: issue.date || "18/05/2025 14:30", // Default date
			}));
		});

		// Add empty arrays for students in studentOrder who don't have issues
		studentOrder.forEach((student) => {
			if (!users[student]) {
				users[student] = [];
			}
		});

		// Custom sort function based on studentOrder
		return Object.entries(users).sort(([userA, issuesA], [userB, issuesB]) => {
			// Get indices from student order
			const indexA = studentOrder.indexOf(userA);
			const indexB = studentOrder.indexOf(userB);
			
			// If both users are in the student order
			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB; // Sort by student order
			}
			
			// If only one is in the student order, prioritize that one
			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;
			
			// For users not in the student order, sort by issue count
			return issuesB.length - issuesA.length;
		});
	}, [data.issues, studentOrder]);

	return (
		<AnalysisTabLayout
			showMoreSwitch
			creatorCount={Object.keys(data.issues).length}
			creatorLabel="Created by"
			description="This analysis shows issues created by repository contributors."
			headerTitle="Issues by Creator"
			theme={issuesTheme}
			title="Issues Analysis"
			totalCount={Object.values(data.issues).flat().length}
			statsIcon={
				<IssueIcon sx={{ color: issuesTheme.main, fontSize: "1.1rem" }} />
			}
		>
			{issuesByUser.length === 0 ? (
				<div style={{ padding: "12px", textAlign: "center", color: "#666" }}>
					No issues data available for this repository.
				</div>
			) : (
				issuesByUser.map(([user, issues], index) => (
					<UserIssues key={user} index={index} issues={issues} user={user} />
				))
			)}
		</AnalysisTabLayout>
	);
}

export default IssuesTab;
