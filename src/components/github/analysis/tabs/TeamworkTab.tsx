import { useMemo, useContext } from "react";
import { Box, Typography, Fade, alpha, useTheme } from "@mui/material";
import { RepoData } from "@/services/github";
import { RepoContext } from "@/components/github/repo-analysis/RepoResults";
import { 
  TeamworkTable, 
  TeamworkInteractionsTable 
} from "../components/teamwork";

interface TeamworkTabProps {
	data: RepoData;
}

/**
 * Tab that displays teamwork metrics from GitHub repository data
 */
function TeamworkTab({ data }: TeamworkTabProps) {
	const { teamwork } = data || {};
	const theme = useTheme();
	const { repoStudents } = useContext(RepoContext);

	// Process issue comments data with student order
	const issueCommentsData = useMemo(() => {
		const entries = Object.entries(teamwork?.issueComments || {}).map(
			([user, count]) => ({ user, count })
		);

		// Sort based on student order and then by count
		const sorted = entries.sort((a, b) => {
			// Get indices from student order
			const indexA = repoStudents.indexOf(a.user);
			const indexB = repoStudents.indexOf(b.user);

			// If both users are in the student order
			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB; // Sort by student order
			}

			// If only one is in the student order, prioritize that one
			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;

			// For users not in the student order, sort by count
			return b.count - a.count;
		});

		// Convert back to [string, number] format and take top 5
		return sorted
			.slice(0, 5)
			.map((entry) => [entry.user, entry.count] as [string, number]);
	}, [teamwork?.issueComments, repoStudents]);

	// Process PR reviews data with student order
	const prReviewsData = useMemo(() => {
		const entries = Object.entries(teamwork?.prReviews || {}).map(
			([user, count]) => ({ user, count })
		);

		// Sort based on student order and then by count
		const sorted = entries.sort((a, b) => {
			// Get indices from student order
			const indexA = repoStudents.indexOf(a.user);
			const indexB = repoStudents.indexOf(b.user);

			// If both users are in the student order
			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB; // Sort by student order
			}

			// If only one is in the student order, prioritize that one
			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;

			// For users not in the student order, sort by count
			return b.count - a.count;
		});

		// Convert back to [string, number] format and take top 5
		return sorted
			.slice(0, 5)
			.map((entry) => [entry.user, entry.count] as [string, number]);
	}, [teamwork?.prReviews, repoStudents]);

	// Check if there is data to display
	const hasData =
		(teamwork?.issueComments &&
			Object.keys(teamwork.issueComments).length > 0) ||
		(teamwork?.prReviews && Object.keys(teamwork.prReviews).length > 0);

	// Display a message when no data is available
	if (!hasData) {
		return (
			<Box sx={{ p: 3, textAlign: "center" }}>
				<Typography
					variant="h6"
					sx={{
						color: alpha(theme.palette.primary.main, 0.7),
						mb: 2,
						fontWeight: 500,
					}}
				>
					No teamwork data available for this repository
				</Typography>
				<Typography
					variant="body2"
					sx={{
						color: alpha(theme.palette.text.secondary, 0.7),
						maxWidth: "600px",
						mx: "auto",
					}}
				>
					This repository doesn't have any recorded issue comments or pull
					request reviews, or the data couldn't be retrieved from the GitHub
					API.
				</Typography>
			</Box>
		);
	}

	return (
		<Fade in timeout={500}>
			<Box
				sx={{
					position: "relative",
					"&::before": {
						content: '""',
						position: "absolute",
						top: -100,
						right: -150,
						width: 300,
						height: 300,
						background:
							"radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, rgba(236, 72, 153, 0) 70%)",
						borderRadius: "50%",
						zIndex: -1,
					},
				}}
			>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
					<TeamworkTable
						data={issueCommentsData}
						index={0}
						title="Issue Comments on the Otthers' Issues"
						valueLabel="Comments"
					/>
					<TeamworkTable
						data={prReviewsData}
						index={1}
						title="PR Reviews"
						valueLabel="Reviews"
					/>
				</Box>

				<TeamworkInteractionsTable
					data={
						teamwork
							? {
									issueComments: teamwork.issueComments || {},
									prReviews: teamwork.prReviews || {},
								}
							: {
									issueComments: {},
									prReviews: {},
								}
					}
				/>
			</Box>
		</Fade>
	);
}

export default TeamworkTab; 