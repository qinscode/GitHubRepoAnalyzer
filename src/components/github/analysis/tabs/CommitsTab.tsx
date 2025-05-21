import { useMemo, useContext } from "react";
import { Box, Typography, Paper } from "@mui/material";
import {
	Commit as CommitIcon,
	BarChart as BarChartIcon,
	Timeline as TimelineIcon,
} from "@mui/icons-material";
import UserTabItem from "../components/UserTabItem";
import TabDataTable from "../components/TabDataTable";
import CommitBarChart from "../components/CommitBarChart";
import { commitsTheme } from "../components/AnalysisThemes";
import AllContributorsCommitChart from "../components/AllContributorsCommitChart";
import { RepoData } from "@/services/github";
import AnalysisTabLayout from "../components/layout/AnalysisTabLayout.tsx";
import { RepoContext } from "@/components/github/repo-analysis/RepoResults";

interface CommitsTabProps {
	data: RepoData;
}

// Helper function to format date from ISO string
const formatCommitDate = (dateString: string): string => {
	if (!dateString) return "No date";

	try {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");

		return `${day}/${month}/${year} ${hours}:${minutes}`;
	} catch (error) {
		console.error("Date formatting error:", error);
		return "18/05/2025 14:30"; // Default date format matching other tabs
	}
};

function UserCommits({
	commits,
	index,
	user,
	contributorStats,
}: {
	commits: Array<{ message: string; id: string; commitDate: string }>;
	index: number;
	user: string;
	contributorStats?: Array<any>;
}) {
	// Format date from ISO string to DD/MM/YYYY HH:MM format
	const formattedCommits = commits.map((commit) => ({
		...commit,
		date: formatCommitDate(commit.commitDate),
	}));

	return (
		<UserTabItem
			chipLabel="commits"
			icon={<CommitIcon style={{ fontSize: "0.9rem" }} />}
			index={index}
			itemCount={commits.length}
			theme={commitsTheme}
			user={user}
		>
			<Box>
				{/* Commit Frequency Chart */}
				<Box
					sx={{
						px: 3,
						pt: 3,
						borderBottom: "1px solid rgba(0,0,0,0.04)",
						background: "rgba(249, 250, 251, 0.5)",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
						<BarChartIcon
							sx={{ color: commitsTheme.main, mr: 1, fontSize: "1.1rem" }}
						/>
						<Typography
							sx={{ color: "rgba(55, 65, 81, 0.9)", fontWeight: 600 }}
							variant="subtitle2"
						>
							Weekly Commit Frequency
						</Typography>
					</Box>
					<CommitBarChart
						color={commitsTheme.main}
						contributorStats={contributorStats}
						user={user}
					/>
				</Box>

				{/* Commit List Table */}
				<TabDataTable
					data={formattedCommits}
					emptyMessage="No commits available for this contributor."
					itemType="commit"
					theme={commitsTheme}
				/>
			</Box>
		</UserTabItem>
	);
}

function CommitsTab({ data }: CommitsTabProps) {
	const { repoStudents } = useContext(RepoContext);

	// Transform commits data for display
	const commitsByUser = useMemo(() => {
		type Commit = { message: string; id: string; commitDate: string };
		const users: Record<string, Array<Commit>> = {};

		Object.entries(data.commits).forEach(([user, commits]) => {
			users[user] = commits;
		});

		// Add empty arrays for students in repoStudents who don't have commits
		repoStudents.forEach((student) => {
			if (!users[student]) {
				users[student] = [];
			}
		});

		// Custom sort function based on repoStudents
		return Object.entries(users).sort(
			([userA, commitsA], [userB, commitsB]) => {
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

				// For users not in the student order, sort by commit count
				return commitsB.length - commitsA.length;
			}
		);
	}, [data.commits, repoStudents]);

	return (
		<AnalysisTabLayout
			creatorCount={Object.keys(data.commits).length}
			creatorLabel="From"
			description="Due to GitHub API limitations, commit data only shows the last 50 commits per user."
			headerTitle="Commits by Contributor"
			showMoreSwitch={false}
			theme={commitsTheme}
			title="Commit Activity Analysis"
			totalCount={Object.values(data.commits).flat().length}
			statsIcon={
				<CommitIcon sx={{ color: commitsTheme.main, fontSize: "1.1rem" }} />
			}
		>
			{/* Timeline chart showing all contributors' commits over time */}
			{data.contributorStats && data.contributorStats.length > 0 && (
				<Paper
					elevation={0}
					sx={{
						mb: 4,
						overflow: "hidden",
						border: "1px solid rgba(0,0,0,0.07)",
						borderRadius: 2,
					}}
				>
					<Box
						sx={{
							px: 3,
							pt: 3,
							borderBottom: "1px solid rgba(0,0,0,0.04)",
							background: "rgba(249, 250, 251, 0.5)",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
							<TimelineIcon
								sx={{ color: commitsTheme.main, mr: 1, fontSize: "1.2rem" }}
							/>
							<Typography
								sx={{ color: "rgba(55, 65, 81, 0.9)", fontWeight: 600 }}
								variant="h6"
							>
								Contributor Commit Timeline
							</Typography>
						</Box>
						<AllContributorsCommitChart
							contributorStats={data.contributorStats}
							primaryColor={commitsTheme.main}
						/>
					</Box>
				</Paper>
			)}

			{commitsByUser.length === 0 ? (
				<div style={{ padding: "12px", textAlign: "center", color: "#666" }}>
					No commit data available for this repository.
				</div>
			) : (
				commitsByUser.map(([user, commits], index) => (
					<UserCommits
						key={user}
						commits={commits}
						contributorStats={data.contributorStats}
						index={index}
						user={user}
					/>
				))
			)}
		</AnalysisTabLayout>
	);
}

export default CommitsTab;
