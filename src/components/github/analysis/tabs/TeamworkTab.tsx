import { useMemo, useContext } from "react";
import { Box, Typography } from "@mui/material";
import {
	BugReport as IssueIcon,
	MergeType as PullRequestIcon,
	RateReview as ReviewIcon,
} from "@mui/icons-material";
import { RepoData, Issue, PullRequest } from "@/services/github";
import { RepoContext } from "@/components/github/repo-analysis/RepoResults";
import AnalysisTabLayout from "../components/layout/AnalysisTabLayout";
import UserTabItem from "../components/UserTabItem";
import TabDataTable from "../components/TabDataTable";
import { issuesTheme, pullRequestsTheme } from "../components/AnalysisThemes";

interface TeamworkTabProps {
	data: RepoData;
}

/**
 * Tab that displays teamwork metrics from GitHub repository data
 */
function TeamworkTab({ data }: TeamworkTabProps) {
	const { teamwork } = data || {};
	const { repoStudents } = useContext(RepoContext);

	const sortUsers = (
		entries: Array<[string, Array<Issue> | Array<PullRequest>]>
	) =>
		entries.sort(([userA, itemsA], [userB, itemsB]) => {
			const indexA = repoStudents.indexOf(userA);
			const indexB = repoStudents.indexOf(userB);

			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB;
			}

			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;

			return itemsB.length - itemsA.length;
		});

	const issuesCommentedByUser = useMemo(() => {
		const users: Record<string, Array<Issue>> = {
			...(teamwork?.issuesCommented || {}),
		};

		repoStudents.forEach((student) => {
			if (!users[student]) {
				users[student] = [];
			}
		});

		return sortUsers(Object.entries(users)) as Array<[string, Array<Issue>]>;
	}, [repoStudents, teamwork?.issuesCommented]);

	const substantivePrsByUser = useMemo(() => {
		const users: Record<string, Array<PullRequest>> = {
			...(teamwork?.substantivePrReviews || {}),
		};

		Object.keys(teamwork?.prReviews || {}).forEach((user) => {
			if (!users[user]) {
				users[user] = [];
			}
		});

		repoStudents.forEach((student) => {
			if (!users[student]) {
				users[student] = [];
			}
		});

		return sortUsers(Object.entries(users)) as Array<
			[string, Array<PullRequest>]
		>;
	}, [repoStudents, teamwork?.prReviews, teamwork?.substantivePrReviews]);

	// Check if there is data to display
	const hasData =
		(teamwork?.issuesCommented &&
			Object.keys(teamwork.issuesCommented).length > 0) ||
		(teamwork?.substantivePrReviews &&
			Object.keys(teamwork.substantivePrReviews).length > 0) ||
		(teamwork?.prReviews && Object.keys(teamwork.prReviews).length > 0);

	const totalIssuesCommented = Object.values(teamwork?.issuesCommented || {}).reduce(
		(sum, issues) => sum + issues.length,
		0
	);

	const totalSubstantiveReviews = Object.values(
		teamwork?.substantivePrReviews || {}
	).reduce((sum, prs) => sum + prs.length, 0);

	const totalReviews = Object.values(teamwork?.prReviews || {}).reduce(
		(sum, count) => sum + count,
		0
	);

	const contributors = new Set([
		...Object.keys(teamwork?.issuesCommented || {}),
		...Object.keys(teamwork?.substantivePrReviews || {}),
		...Object.keys(teamwork?.prReviews || {}),
	]).size;

	// Display a message when no data is available
	if (!hasData) {
		return (
			<Box sx={{ p: 3, textAlign: "center" }}>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
					No teamwork data available for this repository
				</Typography>
				<Typography variant="body2" sx={{ maxWidth: "600px", mx: "auto" }}>
					This repository doesn't have recorded issue comments or substantive
					pull request reviews, or the data couldn't be retrieved from the
					GitHub API.
				</Typography>
			</Box>
		);
	}

	return (
		<AnalysisTabLayout
			creatorCount={contributors}
			creatorLabel="Contributors"
			description="Teamwork interactions grouped by contributor with direct links to issues and pull requests."
			headerTitle="Collaborative Review Activity"
			theme={issuesTheme}
			title="Team Work Analysis"
			totalCount={totalIssuesCommented + totalSubstantiveReviews}
			statsIcon={<ReviewIcon sx={{ color: issuesTheme.main, fontSize: "1.1rem" }} />}
		>
			<Box sx={{ mb: 3 }}>
				<Typography sx={{ fontWeight: 600, mb: 1, color: issuesTheme.textColor }}>
					Issues Commented On
				</Typography>
				{issuesCommentedByUser.map(([user, issues], index) => (
					<UserTabItem
						chipLabel="issues commented"
						icon={<IssueIcon style={{ fontSize: "0.9rem" }} />}
						index={index}
						itemCount={issues.length}
						key={`issues-${user}`}
						theme={issuesTheme}
						user={user}
					>
						<TabDataTable
							data={issues}
							emptyMessage="No issues commented on by this contributor"
							itemType="issue"
							theme={issuesTheme}
						/>
					</UserTabItem>
				))}
			</Box>

			<Box>
				<Typography
					sx={{ fontWeight: 600, mb: 1, color: pullRequestsTheme.textColor }}
				>
					Substantive PRs Reviewed
				</Typography>
				{substantivePrsByUser.map(([user, pullRequests], index) => {
					const totalUserReviews = teamwork?.prReviews?.[user] || 0;

					return (
						<UserTabItem
							chipLabel={`substantive reviews • ${totalUserReviews} reviews total`}
							icon={<PullRequestIcon style={{ fontSize: "0.9rem" }} />}
							index={index + issuesCommentedByUser.length}
							itemCount={pullRequests.length}
							key={`prs-${user}`}
							theme={pullRequestsTheme}
							user={user}
						>
							<TabDataTable
								data={pullRequests}
								emptyMessage="No substantive pull requests reviewed by this contributor"
								itemType="pullRequest"
								theme={pullRequestsTheme}
							/>
						</UserTabItem>
					);
				})}
			</Box>

			<Typography sx={{ mt: 1, color: "text.secondary", fontSize: "0.85rem" }}>
				Total reviews (all): {totalReviews} • Substantive reviews listed: {totalSubstantiveReviews}
			</Typography>
		</AnalysisTabLayout>
	);
}

export default TeamworkTab;
