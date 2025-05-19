import { useMemo } from "react";
import { MergeType as PRIcon } from "@mui/icons-material";

import type { PullRequest, RepoData } from "../../../../services/github";
import UserTabItem from "../components/UserTabItem";
import AnalysisTabLayout from "../components/layout/AnalysisTabLayout.tsx";
import TabDataTable from "../components/TabDataTable";
import { pullRequestsTheme } from "../components/AnalysisThemes";

interface PullRequestsTabProps {
	data: RepoData;
}

function UserPullRequests({
	user,
	prs,
	index,
}: {
	user: string;
	prs: Array<PullRequest>;
	index: number;
}): JSX.Element {
	return (
		<UserTabItem
			chipLabel="PRs"
			icon={<PRIcon style={{ fontSize: "0.9rem" }} />}
			index={index}
			itemCount={prs.length}
			theme={pullRequestsTheme}
			user={user}
		>
			<TabDataTable
				data={prs}
				emptyMessage="No pull requests available for this contributor"
				itemType="pullRequest"
				theme={pullRequestsTheme}
			/>
		</UserTabItem>
	);
}

function PullRequestsTab({ data }: PullRequestsTabProps): JSX.Element {
	const prsByUser = useMemo(() => {
		const users: Record<string, Array<PullRequest>> = {};

		Object.entries(data.prs).forEach(([user, prs]) => {
			// Add default date if missing
			users[user] = prs.map((pr) => ({
				...pr,
				date: pr.date || "18/05/2025 14:30", // Default date
			}));
		});

		return Object.entries(users).sort(([, a], [, b]) => b.length - a.length);
	}, [data.prs]);

	return (
		<AnalysisTabLayout
			creatorCount={Object.keys(data.prs).length}
			creatorLabel="Created by"
			description="This analysis shows pull requests created by repository contributors."
			headerTitle="Pull Requests by Author"
			theme={pullRequestsTheme}
			title="Pull Requests Analysis"
			totalCount={Object.values(data.prs).flat().length}
			statsIcon={
				<PRIcon sx={{ color: pullRequestsTheme.main, fontSize: "1.1rem" }} />
			}
		>
			{prsByUser.length === 0 ? (
				<div style={{ padding: "12px", textAlign: "center", color: "#666" }}>
					No pull request data available for this repository.
				</div>
			) : (
				prsByUser.map(([user, prs], index) => (
					<UserPullRequests key={user} index={index} prs={prs} user={user} />
				))
			)}
		</AnalysisTabLayout>
	);
}

export default PullRequestsTab;
