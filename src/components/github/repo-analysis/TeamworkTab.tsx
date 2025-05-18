import { useMemo } from "react";
import {
	Box,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Avatar,
	Chip,
	Card,
	Fade,
	Grow,
	alpha,
	useTheme,
} from "@mui/material";
import {
	ChatBubble as CommentIcon,
	RateReview as ReviewIcon,
} from "@mui/icons-material";
import type { RepoData } from "./types";

interface TeamworkTabProps {
	data: RepoData;
}

// 定义主题色
const colors = {
	main: "#EC4899", // pink
	secondary: "#8B5CF6", // purple
	tertiary: "#F59E0B", // amber
	light: "rgba(236, 72, 153, 0.1)",
	lighter: "rgba(236, 72, 153, 0.05)",
	gradient: "linear-gradient(90deg, #EC4899 0%, #D946EF 100%)",
	gradientSecondary: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
};

function SectionTitle({ title }: { title: string }): JSX.Element {
	return (
		<Typography
			sx={{
				fontSize: "1.15rem",
				fontWeight: 600,
				color: "#BE185D",
				mb: 2.5,
				mt: 2,
				position: "relative",
				paddingLeft: "16px",
				display: "inline-block",
				transition: "transform 0.2s ease",
				"&:hover": {
					transform: "translateX(2px)",
				},
				"&::before": {
					content: '""',
					position: "absolute",
					left: 0,
					top: "50%",
					transform: "translateY(-50%)",
					width: "4px",
					height: "18px",
					borderRadius: "2px",
					background: colors.gradient,
				},
				"&::after": {
					content: '""',
					position: "absolute",
					bottom: -5,
					left: 16,
					width: "40%",
					height: "2px",
					background: colors.gradient,
					transition: "width 0.3s ease",
				},
				"&:hover::after": {
					width: "80%",
				},
			}}
		>
			{title}
		</Typography>
	);
}

function TeamworkTable({
	title,
	data,
	valueLabel,
	index,
}: {
	title: string;
	data: Array<[string, number]>;
	valueLabel: string;
	index: number;
}): JSX.Element {
	const isIssuesTable = title.includes("Issues");
	const lightColor = isIssuesTable ? colors.light : "rgba(139, 92, 246, 0.1)";
	const lighterColor = isIssuesTable
		? colors.lighter
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
								sx={{ fontSize: "1.2rem", color: "#BE185D", marginRight: 1.5 }}
							/>
						) : (
							<ReviewIcon
								sx={{ fontSize: "1.2rem", color: "#5B21B6", marginRight: 1.5 }}
							/>
						)}
						<Typography
							sx={{
								fontSize: "1rem",
								fontWeight: 600,
								color: isIssuesTable ? "#BE185D" : "#5B21B6",
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
													? alpha("#EC4899", 0.02)
													: alpha("#8B5CF6", 0.02),
											},
											"&:hover": {
												backgroundColor: isIssuesTable
													? alpha("#EC4899", 0.05)
													: alpha("#8B5CF6", 0.05),
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
															? colors.gradient
															: colors.gradientSecondary,
														fontSize: "0.9rem",
														boxShadow: isIssuesTable
															? `0 2px 5px ${alpha("#EC4899", 0.4)}`
															: `0 2px 5px ${alpha("#8B5CF6", 0.4)}`,
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
																? colors.gradient
																: colors.gradientSecondary
															: count > 2
																? `linear-gradient(90deg, ${alpha(isIssuesTable ? "#EC4899" : "#8B5CF6", 0.7)} 0%, ${alpha(isIssuesTable ? "#D946EF" : "#A78BFA", 0.7)} 100%)`
																: "rgba(0, 0, 0, 0.08)",
													color: count > 2 ? "white" : "rgba(55, 65, 81, 0.9)",
													fontWeight: 600,
													minWidth: "36px",
													boxShadow:
														count > 2
															? isIssuesTable
																? `0 2px 4px ${alpha("#EC4899", 0.2)}`
																: `0 2px 4px ${alpha("#8B5CF6", 0.2)}`
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
}

function TeamworkInteractionsTable({
	data,
}: {
	data: {
		issueComments: Record<string, number>;
		prReviews: Record<string, number>;
	};
}): JSX.Element {
	// Process teamwork data into array of stats objects
	const teamworkStats = useMemo(() => {
		// Handle case where data might be null or undefined
		if (!data) {
			return [];
		}

		// Get unique users from both issueComments and prReviews
		const users = Array.from(
			new Set([
				...Object.keys(data.issueComments || {}),
				...Object.keys(data.prReviews || {}),
			])
		);

		// Create stats objects for each user
		return users
			.map((user) => {
				const issueComments = data.issueComments?.[user] || 0;
				const prReviews = data.prReviews?.[user] || 0;
				const total = issueComments + prReviews;

				return { user, issueComments, prReviews, total };
			})
			.sort((a, b) => b.total - a.total);
	}, [data]);

	return (
		<Fade in timeout={1000}>
			<Box sx={{ mt: 4 }}>
				<SectionTitle title="Teamwork Interactions by User" />

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 3,
					}}
				>
					{/* 表头卡片 */}
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
								color: "#BE185D",
								fontSize: "0.95rem",
							}}
						>
							Contributor
						</Box>
						<Box
							sx={{
								flex: 2,
								fontWeight: 600,
								color: "#BE185D",
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
								color: "#5B21B6",
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
								color: "#BE185D",
								fontSize: "0.95rem",
								textAlign: "center",
							}}
						>
							Total
						</Box>
					</Box>

					{/* 用户数据卡片 */}
					{teamworkStats.map((stats, index) => (
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
									{/* 贡献者信息 */}
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
														? colors.gradient
														: `linear-gradient(90deg, ${alpha(colors.main, 0.9)}, ${alpha("#D946EF", 0.9)})`,
												boxShadow: `0 4px 8px ${alpha(colors.main, stats.total > 10 ? 0.4 : 0.2)}`,
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

									{/* 议题评论 */}
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
												backgroundColor: alpha("#BE185D", 0.08),
												mb: 0.5,
											}}
										>
											<Typography
												sx={{
													fontWeight: 700,
													fontSize: "1.3rem",
													color:
														stats.issueComments > 0
															? "#BE185D"
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
															? "#BE185D"
															: "rgba(107, 114, 128, 0.6)",
												}}
											/>
											<Typography
												sx={{
													fontSize: "0.75rem",
													color:
														stats.issueComments > 0
															? "#BE185D"
															: "rgba(107, 114, 128, 0.6)",
													fontWeight: 500,
												}}
											>
												Comments
											</Typography>
										</Box>
									</Box>

									{/* PR 评审 */}
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
												backgroundColor: alpha("#5B21B6", 0.08),
												mb: 0.5,
											}}
										>
											<Typography
												sx={{
													fontWeight: 700,
													fontSize: "1.3rem",
													color:
														stats.prReviews > 0
															? "#5B21B6"
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
															? "#5B21B6"
															: "rgba(107, 114, 128, 0.6)",
												}}
											/>
											<Typography
												sx={{
													fontSize: "0.75rem",
													color:
														stats.prReviews > 0
															? "#5B21B6"
															: "rgba(107, 114, 128, 0.6)",
													fontWeight: 500,
												}}
											>
												Reviews
											</Typography>
										</Box>
									</Box>

									{/* 总交互 */}
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
														? colors.gradient
														: stats.total > 5
															? `linear-gradient(90deg, ${alpha(colors.main, 0.7)} 0%, ${alpha("#D946EF", 0.7)} 100%)`
															: "rgba(236, 72, 153, 0.15)",
												color: stats.total > 5 ? "white" : "#BE185D",
												fontWeight: 700,
												minWidth: "48px",
												height: "32px",
												fontSize: "1rem",
												boxShadow:
													stats.total > 5
														? `0 3px 6px ${alpha(colors.main, 0.3)}`
														: "none",
												borderRadius: "16px",
												transition: "all 0.3s ease",
												"&:hover": {
													transform: "scale(1.1)",
													boxShadow:
														stats.total > 5
															? `0 6px 12px ${alpha(colors.main, 0.4)}`
															: `0 3px 6px ${alpha(colors.main, 0.2)}`,
												},
											}}
										/>
										<Typography
											sx={{
												fontSize: "0.75rem",
												color: "#BE185D",
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
		</Fade>
	);
}

function TeamworkTab({ data }: TeamworkTabProps): JSX.Element {
	const { teamwork } = data || {};
	const theme = useTheme();

	// 确保数据存在，使用空对象作为默认值
	const issueCommentsData = Object.entries(teamwork?.issueComments || {})
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5);

	const prReviewsData = Object.entries(teamwork?.prReviews || {})
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5);

	// 检查是否有数据可显示
	const hasData =
		(teamwork?.issueComments &&
			Object.keys(teamwork.issueComments).length > 0) ||
		(teamwork?.prReviews && Object.keys(teamwork.prReviews).length > 0);

	// 没有数据时显示提示信息
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
						title="Issue Comments"
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
