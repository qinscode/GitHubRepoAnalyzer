import { useMemo, useContext } from "react";
import { MergeType as PRIcon } from "@mui/icons-material";

import type { PullRequest, RepoData } from "@/services/github";
import UserTabItem from "../components/UserTabItem";
import AnalysisTabLayout from "../components/layout/AnalysisTabLayout.tsx";
import TabDataTable from "../components/TabDataTable";
import { pullRequestsTheme } from "../components/AnalysisThemes";
import { RepoContext } from "@/components/github/repo-analysis/RepoResults";

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
}) {
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

function PullRequestsTab({ data }: PullRequestsTabProps) {
	const { repoStudents } = useContext(RepoContext);

	const prsByUser = useMemo(() => {
		const users: Record<string, Array<PullRequest>> = {};

		Object.entries(data.prs).forEach(([user, prs]) => {
			// Add default date if missing
			users[user] = prs.map((pr) => ({
				...pr,
				date: pr.date || new Date().toLocaleString(), // Use current date as fallback instead of hardcoded future date
			}));
		});

		// Add empty arrays for students in repoStudents who don't have PRs
		repoStudents.forEach((student) => {
			if (!users[student]) {
				users[student] = [];
			}
		});

		// Custom sort function based on repoStudents
		return Object.entries(users).sort(([userA, prsA], [userB, prsB]) => {
			// Get indices from student order
			const indexA = repoStudents.indexOf(userA);
			const indexB = repoStudents.indexOf(userB);
			
			// If both users are in the student order
			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB; // Sort by student order
			}
			
			// If only one is in the student order, prioritize that one
			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;
			
			// For users not in the student order, sort by PR count
			return prsB.length - prsA.length;
		});
	}, [data.prs, repoStudents]);

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
