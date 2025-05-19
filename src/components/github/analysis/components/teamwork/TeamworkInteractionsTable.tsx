import { useMemo } from "react";
import { Box, Typography, Avatar, Chip, Card, Grow, alpha } from "@mui/material";
import { ChatBubble as CommentIcon, RateReview as ReviewIcon } from "@mui/icons-material";
import { useStudentStore } from "@/store/useStudentStore";
import { TeamworkColors } from "./TeamworkTheme";
import SectionTitle from "./SectionTitle";

interface TeamworkInteractionsTableProps {
	data: {
		issueComments: Record<string, number>;
		prReviews: Record<string, number>;
	};
}

interface InteractionStat {
	user: string;
	issueComments: number;
	prReviews: number;
	total: number;
}

/**
 * Displays a comprehensive table of all teamwork interactions by user
 */
const TeamworkInteractionsTable: React.FC<TeamworkInteractionsTableProps> = ({ data }) => {
	const { studentOrder } = useStudentStore();

	// Create a combined stats array with all interactions
	const interactionStats = useMemo(() => {
		const stats: Record<
			string,
			{ issueComments: number; prReviews: number; total: number }
		> = {};

		// Process issue comments
		Object.entries(data.issueComments).forEach(([user, count]) => {
			if (!stats[user]) {
				stats[user] = { issueComments: 0, prReviews: 0, total: 0 };
			}
			stats[user].issueComments = count;
			stats[user].total += count;
		});

		// Process PR reviews
		Object.entries(data.prReviews).forEach(([user, count]) => {
			if (!stats[user]) {
				stats[user] = { issueComments: 0, prReviews: 0, total: 0 };
			}
			stats[user].prReviews = count;
			stats[user].total += count;
		});

		// Add entries with zero counts for students in studentOrder who don't have interactions
		studentOrder.forEach((student) => {
			if (!stats[student]) {
				stats[student] = { issueComments: 0, prReviews: 0, total: 0 };
			}
		});

		// Convert to array and sort based on student order
		return Object.entries(stats)
			.map(([user, stats]) => ({ user, ...stats }))
			.sort((a, b) => {
				// Get indices from student order
				const indexA = studentOrder.indexOf(a.user);
				const indexB = studentOrder.indexOf(b.user);

				// If both users are in the student order
				if (indexA !== -1 && indexB !== -1) {
					return indexA - indexB; // Sort by student order
				}

				// If only one is in the student order, prioritize that one
				if (indexA !== -1) return -1;
				if (indexB !== -1) return 1;

				// For users not in the student order, sort by total interactions
				return b.total - a.total;
			});
	}, [data.issueComments, data.prReviews, studentOrder]);

	return (
		<Box sx={{ mt: 4 }}>
			<SectionTitle title="Teamwork Interactions by User" />

			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 3,
				}}
			>
				{/* Header card */}
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						bgcolor: "rgba(236, 72, 153, 0.04)",
						borderRadius: "12px",
						padding: "12px 16px",
						border: "1px solid rgba(236, 72, 153, 0.1)",
					}}
				>
					<Box
						sx={{
							flex: 3,
							fontWeight: 600,
							color: TeamworkColors.primaryText,
							fontSize: "0.95rem",
						}}
					>
						Contributor
					</Box>
					<Box
						sx={{
							flex: 2,
							fontWeight: 600,
							color: TeamworkColors.primaryText,
							fontSize: "0.95rem",
							textAlign: "center",
						}}
					>
						Issues Commented
					</Box>
					<Box
						sx={{
							flex: 2,
							fontWeight: 600,
							color: TeamworkColors.secondaryText,
							fontSize: "0.95rem",
							textAlign: "center",
						}}
					>
						PRs Reviewed
					</Box>
					<Box
						sx={{
							flex: 2,
							fontWeight: 600,
							color: TeamworkColors.primaryText,
							fontSize: "0.95rem",
							textAlign: "center",
						}}
					>
						Total
					</Box>
				</Box>

				{/* User data cards */}
				{interactionStats.map((stats, index) => (
					<Grow
						key={stats.user}
						in
						style={{ transformOrigin: "0 0 0" }}
						timeout={300 + index * 100}
					>
						<Card
							elevation={2}
							sx={{
								borderRadius: "12px",
								overflow: "hidden",
								background:
									"linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
								backdropFilter: "blur(8px)",
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								borderLeft:
									stats.total > 10
										? "3px solid #EC4899"
										: stats.total > 5
											? "3px solid rgba(236, 72, 153, 0.7)"
											: "3px solid rgba(236, 72, 153, 0.3)",
								borderTop: "1px solid rgba(255, 255, 255, 0.7)",
								boxShadow:
									"0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
								"&:hover": {
									transform: "translateY(-3px) scale(1.01)",
									boxShadow:
										"0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.05)",
								},
								position: "relative",
								"&::before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: "100%",
									background:
										stats.total > 10
											? "linear-gradient(90deg, rgba(236, 72, 153, 0.05) 0%, transparent 20%)"
											: stats.total > 5
												? "linear-gradient(90deg, rgba(236, 72, 153, 0.03) 0%, transparent 15%)"
												: "none",
									zIndex: 0,
								},
							}}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									padding: "16px",
									position: "relative",
									zIndex: 1,
								}}
							>
								{/* Contributor info */}
								<Box
									sx={{
										flex: 3,
										display: "flex",
										alignItems: "center",
										mr: 2,
									}}
								>
									<Avatar
										sx={{
											width: 42,
											height: 42,
											mr: 1.5,
											fontSize: "1rem",
											fontWeight: "bold",
											background:
												stats.total > 10
													? TeamworkColors.gradient
													: `linear-gradient(90deg, ${alpha(TeamworkColors.main, 0.9)}, ${alpha("#D946EF", 0.9)})`,
											boxShadow: `0 4px 8px ${alpha(TeamworkColors.main, stats.total > 10 ? 0.4 : 0.2)}`,
											border: "2px solid white",
											transition: "all 0.3s ease",
											"&:hover": {
												transform: "scale(1.1) rotate(5deg)",
											},
										}}
									>
										{stats.user.charAt(0).toUpperCase()}
									</Avatar>
									<Box>
										<Typography
											sx={{
												fontWeight: 600,
												fontSize: "1rem",
												color: "rgba(55, 65, 81, 0.9)",
												lineHeight: 1.2,
											}}
										>
											{stats.user}
										</Typography>
										<Typography
											sx={{
												fontSize: "0.8rem",
												color: "rgba(107, 114, 128, 0.8)",
											}}
										>
											Team contributor
										</Typography>
									</Box>
								</Box>

								{/* Issue comments */}
								<Box
									sx={{
										flex: 2,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 48,
											height: 48,
											borderRadius: "12px",
											backgroundColor: alpha(TeamworkColors.primaryText, 0.08),
											mb: 0.5,
										}}
									>
										<Typography
											sx={{
												fontWeight: 700,
												fontSize: "1.3rem",
												color:
													stats.issueComments > 0
														? TeamworkColors.primaryText
														: "rgba(107, 114, 128, 0.6)",
											}}
										>
											{stats.issueComments}
										</Typography>
									</Box>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.5,
										}}
									>
										<CommentIcon
											sx={{
												fontSize: "0.85rem",
												color:
													stats.issueComments > 0
														? TeamworkColors.primaryText
														: "rgba(107, 114, 128, 0.6)",
											}}
										/>
										<Typography
											sx={{
												fontSize: "0.75rem",
												color:
													stats.issueComments > 0
														? TeamworkColors.primaryText
														: "rgba(107, 114, 128, 0.6)",
												fontWeight: 500,
											}}
										>
											Comments
										</Typography>
									</Box>
								</Box>

								{/* PR reviews */}
								<Box
									sx={{
										flex: 2,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 48,
											height: 48,
											borderRadius: "12px",
											backgroundColor: alpha(TeamworkColors.secondaryText, 0.08),
											mb: 0.5,
										}}
									>
										<Typography
											sx={{
												fontWeight: 700,
												fontSize: "1.3rem",
												color:
													stats.prReviews > 0
														? TeamworkColors.secondaryText
														: "rgba(107, 114, 128, 0.6)",
											}}
										>
											{stats.prReviews}
										</Typography>
									</Box>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.5,
										}}
									>
										<ReviewIcon
											sx={{
												fontSize: "0.85rem",
												color:
													stats.prReviews > 0
														? TeamworkColors.secondaryText
														: "rgba(107, 114, 128, 0.6)",
											}}
										/>
										<Typography
											sx={{
												fontSize: "0.75rem",
												color:
													stats.prReviews > 0
														? TeamworkColors.secondaryText
														: "rgba(107, 114, 128, 0.6)",
												fontWeight: 500,
											}}
										>
											Reviews
										</Typography>
									</Box>
								</Box>

								{/* Total interactions */}
								<Box
									sx={{
										flex: 2,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Chip
										label={stats.total}
										sx={{
											background:
												stats.total > 10
													? TeamworkColors.gradient
													: stats.total > 5
														? `linear-gradient(90deg, ${alpha(TeamworkColors.main, 0.7)} 0%, ${alpha("#D946EF", 0.7)} 100%)`
														: "rgba(236, 72, 153, 0.15)",
											color: stats.total > 5 ? "white" : TeamworkColors.primaryText,
											fontWeight: 700,
											minWidth: "48px",
											height: "32px",
											fontSize: "1rem",
											boxShadow:
												stats.total > 5
													? `0 3px 6px ${alpha(TeamworkColors.main, 0.3)}`
													: "none",
											borderRadius: "16px",
											transition: "all 0.3s ease",
											"&:hover": {
												transform: "scale(1.1)",
												boxShadow:
													stats.total > 5
														? `0 6px 12px ${alpha(TeamworkColors.main, 0.4)}`
														: `0 3px 6px ${alpha(TeamworkColors.main, 0.2)}`,
											},
										}}
									/>
									<Typography
										sx={{
											fontSize: "0.75rem",
											color: TeamworkColors.primaryText,
											fontWeight: 500,
											mt: 1,
										}}
									>
										Total
									</Typography>
								</Box>
							</Box>
						</Card>
					</Grow>
				))}
			</Box>
		</Box>
	);
};

export default TeamworkInteractionsTable; 