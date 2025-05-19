import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Chip, Card, Grow, alpha } from "@mui/material";
import { ChatBubble as CommentIcon, RateReview as ReviewIcon } from "@mui/icons-material";
import { TeamworkColors } from "./TeamworkTheme";

interface TeamworkTableProps {
	title: string;
	data: Array<[string, number]>;
	valueLabel: string;
	index: number;
}

/**
 * Displays a table of teamwork data with animation effects
 */
const TeamworkTable: React.FC<TeamworkTableProps> = ({
	title,
	data,
	valueLabel,
	index,
}) => {
	const isIssuesTable = title.includes("Issues");
	const lightColor = isIssuesTable ? TeamworkColors.light : "rgba(139, 92, 246, 0.1)";
	const lighterColor = isIssuesTable
		? TeamworkColors.lighter
		: "rgba(139, 92, 246, 0.05)";

	return (
		<Grow in timeout={700 + index * 100}>
			<Box
				sx={{
					flex: "1 1 400px",
					minWidth: 0,
					animation: `fadeIn 0.5s ease-out forwards ${index * 0.15}s`,
					opacity: 0,
					"@keyframes fadeIn": {
						"0%": { opacity: 0, transform: "translateY(10px)" },
						"100%": { opacity: 1, transform: "translateY(0)" },
					},
				}}
			>
				<Card
					elevation={2}
					sx={{
						overflow: "hidden",
						borderRadius: "12px",
						background:
							"linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
						backdropFilter: "blur(8px)",
						transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						borderLeft: isIssuesTable
							? `1px solid rgba(236, 72, 153, 0.2)`
							: `1px solid rgba(139, 92, 246, 0.2)`,
						borderTop: "1px solid rgba(255, 255, 255, 0.7)",
						boxShadow:
							"0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
						"&:hover": {
							transform: "translateY(-3px)",
							boxShadow: isIssuesTable
								? "0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.05)"
								: "0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.05)",
						},
					}}
				>
					<Box
						sx={{
							padding: "16px 20px",
							borderBottom: "1px solid rgba(0,0,0,0.04)",
							background: `linear-gradient(to right, ${lighterColor}, rgba(249, 250, 251, 0.6))`,
							display: "flex",
							alignItems: "center",
						}}
					>
						{isIssuesTable ? (
							<CommentIcon
								sx={{ fontSize: "1.2rem", color: TeamworkColors.primaryText, marginRight: 1.5 }}
							/>
						) : (
							<ReviewIcon
								sx={{ fontSize: "1.2rem", color: TeamworkColors.secondaryText, marginRight: 1.5 }}
							/>
						)}
						<Typography
							sx={{
								fontSize: "1rem",
								fontWeight: 600,
								color: isIssuesTable ? TeamworkColors.primaryText : TeamworkColors.secondaryText,
							}}
						>
							{title}
						</Typography>
					</Box>
					<TableContainer>
						<Table>
							<TableHead
								sx={{
									background: `linear-gradient(to right, ${lighterColor}, rgba(248, 250, 252, 0.8))`,
								}}
							>
								<TableRow>
									<TableCell
										sx={{
											borderBottom: `2px solid ${lightColor}`,
											py: 1.5,
											fontWeight: 600,
											color: "rgba(55, 65, 81, 0.9)",
										}}
									>
										User
									</TableCell>
									<TableCell
										align="center"
										sx={{
											borderBottom: `2px solid ${lightColor}`,
											py: 1.5,
											fontWeight: 600,
											color: "rgba(55, 65, 81, 0.9)",
										}}
									>
										{valueLabel}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map(([user, count], userIndex) => (
									<TableRow
										key={user}
										sx={{
											transition: "all 0.2s ease",
											animation: `rowFadeIn 0.4s ease-out forwards ${userIndex * 0.05 + 0.2}s`,
											opacity: 0,
											"@keyframes rowFadeIn": {
												"0%": { opacity: 0, transform: "translateY(5px)" },
												"100%": { opacity: 1, transform: "translateY(0)" },
											},
											"&:nth-of-type(odd)": {
												backgroundColor: isIssuesTable
													? alpha(TeamworkColors.main, 0.02)
													: alpha(TeamworkColors.secondary, 0.02),
											},
											"&:hover": {
												backgroundColor: isIssuesTable
													? alpha(TeamworkColors.main, 0.05)
													: alpha(TeamworkColors.secondary, 0.05),
											},
											"&:last-child td, &:last-child th": {
												borderBottom: 0,
											},
										}}
									>
										<TableCell
											sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
										>
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<Avatar
													sx={{
														width: 36,
														height: 36,
														mr: 1.5,
														background: isIssuesTable
															? TeamworkColors.gradient
															: TeamworkColors.gradientSecondary,
														fontSize: "0.9rem",
														boxShadow: isIssuesTable
															? `0 2px 5px ${alpha(TeamworkColors.main, 0.4)}`
															: `0 2px 5px ${alpha(TeamworkColors.secondary, 0.4)}`,
													}}
												>
													{user.charAt(0).toUpperCase()}
												</Avatar>
												<Typography
													sx={{
														fontWeight: 500,
														fontSize: "0.95rem",
														color: "rgba(55, 65, 81, 0.9)",
													}}
												>
													{user}
												</Typography>
											</Box>
										</TableCell>
										<TableCell
											align="center"
											sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
										>
											<Chip
												label={count}
												size="small"
												sx={{
													background:
														count > 5
															? isIssuesTable
																? TeamworkColors.gradient
																: TeamworkColors.gradientSecondary
															: count > 2
																? `linear-gradient(90deg, ${alpha(isIssuesTable ? TeamworkColors.main : TeamworkColors.secondary, 0.7)} 0%, ${alpha(isIssuesTable ? "#D946EF" : "#A78BFA", 0.7)} 100%)`
																: "rgba(0, 0, 0, 0.08)",
													color: count > 2 ? "white" : "rgba(55, 65, 81, 0.9)",
													fontWeight: 600,
													minWidth: "36px",
													boxShadow:
														count > 2
															? isIssuesTable
																? `0 2px 4px ${alpha(TeamworkColors.main, 0.2)}`
																: `0 2px 4px ${alpha(TeamworkColors.secondary, 0.2)}`
															: "none",
													transition: "all 0.2s ease",
													"&:hover": {
														transform: "scale(1.05)",
													},
												}}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Card>
			</Box>
		</Grow>
	);
};

export default TeamworkTable; 