import { useMemo } from "react";
import { BugReport as IssueIcon } from "@mui/icons-material";
import type { Issue, RepoData } from "../../../../services/github";
import UserTabItem from "../components/UserTabItem";
import TabDataTable from "../components/TabDataTable";
import { issuesTheme } from "../components/AnalysisThemes";
import AnalysisTabLayout from "../components/layout/AnalysisTabLayout";

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
}): JSX.Element {
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

function IssuesTab({ data }: IssuesTabProps): JSX.Element {
	const issuesByUser = useMemo(() => {
		type IssueWithDate = Issue;
		const users: Record<string, Array<IssueWithDate>> = {};

		// Group issues by user
		Object.entries(data.issues).forEach(([user, issues]) => {
			// Add default date if missing
			// @ts-ignore
			users[user] = issues.map((issue) => ({
				...issue,
				date: issue.date || "18/05/2025 14:30", // Default date
			}));
		});

		// Sort users by number of issues (descending)
		return Object.entries(users).sort(([, a], [, b]) => b.length - a.length);
	}, [data.issues]);

	return (
		<AnalysisTabLayout
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
