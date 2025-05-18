import React, { useMemo } from "react";
import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Avatar,
	Chip,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Fade,
	Grow,
} from "@mui/material";
import {
	ExpandMore as ExpandMoreIcon,
	Commit as CommitIcon,
} from "@mui/icons-material";
import type { RepoData } from "../../types/types.ts";

interface CommitsTabProps {
	data: RepoData;
}

function UserCommits({
	commits,
	index,
	user,
}: {
	commits: Array<{ message: string; id: string }>;
	index: number;
	user: string;
}): JSX.Element {
	const [expanded, setExpanded] = React.useState(false);

	const handleChange = (): void => {
		setExpanded(!expanded);
	};

	// Define colors for the component
	const colors = {
		main: "#10B981", // green
		light: "rgba(16, 185, 129, 0.1)",
		lighter: "rgba(16, 185, 129, 0.05)",
		gradient: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
	};

	return (
		<Grow in timeout={800 + index * 150}>
			<Accordion
				key={user}
				expanded={expanded}
				sx={{
					mb: 2.5,
					borderRadius: "12px !important",
					overflow: "hidden",
					boxShadow: expanded
						? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
						: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
					border: "1px solid rgba(255, 255, 255, 0.7)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					background:
						"linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
					backdropFilter: "blur(8px)",
					"&:before": {
						display: "none",
					},
					"&:hover": {
						boxShadow:
							"0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)",
					},
				}}
				onChange={handleChange}
			>
				<AccordionSummary
					expandIcon={
						<ExpandMoreIcon
							sx={{
								color: colors.main,
								transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
								transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
							}}
						/>
					}
					sx={{
						background: expanded
							? `linear-gradient(to right, ${colors.lighter}, rgba(249, 250, 251, 0.8))`
							: "transparent",
						borderLeft: `4px solid ${colors.main}`,
						transition: "all 0.3s ease",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							width: "100%",
							justifyContent: "space-between",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Avatar
								sx={{
									width: 36,
									height: 36,
									mr: 2,
									background: colors.gradient,
									fontSize: "0.9rem",
									boxShadow: `0 2px 5px ${colors.main}40`,
								}}
							>
								{user.charAt(0).toUpperCase()}
							</Avatar>
							<Typography
								variant="subtitle1"
								sx={{
									fontWeight: 600,
									color: "rgba(55, 65, 81, 0.9)",
								}}
							>
								{user}
							</Typography>
						</Box>
						<Chip
							icon={<CommitIcon style={{ fontSize: "0.9rem" }} />}
							label={`${commits.length} commits`}
							size="small"
							sx={{
								ml: 2,
								background: colors.gradient,
								color: "white",
								fontWeight: 500,
								boxShadow: "0 2px 5px rgba(16, 185, 129, 0.2)",
								"& .MuiChip-icon": {
									color: "white",
								},
							}}
						/>
					</Box>
				</AccordionSummary>
				<AccordionDetails sx={{ p: 0 }}>
					<Fade in={expanded} timeout={500}>
						<TableContainer
							component={Paper}
							elevation={0}
							sx={{
								borderRadius: 0,
								"& .MuiTable-root": {
									borderCollapse: "separate",
									borderSpacing: "0",
								},
							}}
						>
							<Table size="small">
								<TableHead
									sx={{
										background: `linear-gradient(to right, ${colors.lighter}, rgba(248, 250, 252, 0.8))`,
									}}
								>
									<TableRow>
										<TableCell
											width="10%"
											sx={{
												borderBottom: `2px solid ${colors.light}`,
												py: 1.5,
												fontSize: "0.875rem",
												fontWeight: 600,
												color: "rgba(55, 65, 81, 0.9)",
											}}
										>
											#
										</TableCell>
										<TableCell
											sx={{
												borderBottom: `2px solid ${colors.light}`,
												py: 1.5,
												fontSize: "0.875rem",
												fontWeight: 600,
												color: "rgba(55, 65, 81, 0.9)",
											}}
										>
											Commit Message
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{commits.map((commit, commitIndex) => (
										<TableRow
											key={commit.id || commitIndex}
											sx={{
												transition: "background-color 0.2s ease",
												"&:hover": {
													backgroundColor: "rgba(16, 185, 129, 0.04)",
												},
												animation: `fadeIn 0.5s ease-out forwards ${commitIndex * 0.03}s`,
												opacity: 0,
												"@keyframes fadeIn": {
													"0%": { opacity: 0, transform: "translateY(5px)" },
													"100%": { opacity: 1, transform: "translateY(0)" },
												},
												"&:last-child td": {
													borderBottom: 0,
												},
											}}
										>
											<TableCell
												sx={{
													fontWeight: 500,
													color: colors.main,
													borderBottom: "1px solid rgba(0,0,0,0.04)",
													py: 1.25,
												}}
											>
												{commitIndex + 1}
											</TableCell>
											<TableCell
												sx={{
													fontFamily: "monospace",
													whiteSpace: "pre-wrap",
													wordBreak: "break-word",
													fontSize: "0.85rem",
													borderBottom: "1px solid rgba(0,0,0,0.04)",
													py: 1.25,
												}}
											>
												{commit.message}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Fade>
				</AccordionDetails>
			</Accordion>
		</Grow>
	);
}

function CommitsTab({ data }: CommitsTabProps): JSX.Element {
	// Transform commits data for display
	const commitsByUser = useMemo(() => {
		type Commit = { message: string; id: string };
		const users: Record<string, Array<Commit>> = {};

		Object.entries(data.commits).forEach(([user, commits]) => {
			users[user] = commits;
		});

		return Object.entries(users).sort(
			([, commitsA], [, commitsB]) => commitsB.length - commitsA.length
		);
	}, [data.commits]);

	return (
		<Fade in timeout={500}>
			<Box
				sx={{
					position: "relative",
					animation: "fadeIn 0.5s ease-out forwards",
					opacity: 0,
					"@keyframes fadeIn": {
						"0%": { opacity: 0 },
						"100%": { opacity: 1 },
					},
				}}
			>
				<Box
					className="shine-effect"
					sx={{
						p: 2,
						mb: 4,
						borderRadius: "14px",
						background:
							"linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.04))",
						border: "1px solid rgba(16, 185, 129, 0.15)",
						boxShadow:
							"0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
						position: "relative",
						overflow: "hidden",
						"&::before": {
							content: '""',
							position: "absolute",
							top: -30,
							right: -30,
							width: 120,
							height: 120,
							borderRadius: "50%",
							background:
								"radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)",
							zIndex: 0,
						},
					}}
				>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 600,
							color: "#065F46",
							mb: 1,
							position: "relative",
							zIndex: 1,
						}}
					>
						Commit Activity Analysis
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: "rgba(107, 114, 128, 0.9)",
							position: "relative",
							zIndex: 1,
						}}
					>
						This analysis shows commit activity by contributor, with detailed
						commit messages.
					</Typography>
				</Box>

				<Box sx={{ mb: 2 }}>
					<Typography
						sx={{
							fontSize: "1.15rem",
							fontWeight: 600,
							color: "#065F46",
							mb: 2.5,
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
								background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
							},
							"&::after": {
								content: '""',
								position: "absolute",
								bottom: -5,
								left: 16,
								width: "40%",
								height: "2px",
								background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
								transition: "width 0.3s ease",
							},
							"&:hover::after": {
								width: "80%",
							},
						}}
					>
						Commits by Contributor
					</Typography>
				</Box>

				{commitsByUser.length === 0 ? (
					<Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
						<Typography>
							No commit data available for this repository.
						</Typography>
					</Box>
				) : (
					commitsByUser.map(([user, commits], index) => (
						<UserCommits
							key={user}
							commits={commits}
							index={index}
							user={user}
						/>
					))
				)}

				<Box
					sx={{
						mt: 4,
						p: 2,
						borderRadius: "12px",
						border: "1px dashed rgba(16, 185, 129, 0.3)",
						backgroundColor: "rgba(16, 185, 129, 0.03)",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1.5,
						}}
					>
						<CommitIcon sx={{ color: "#10B981", fontSize: "1.1rem" }} />
						<Typography
							sx={{ color: "#065F46", fontWeight: 500 }}
							variant="body2"
						>
							Total Commits: {Object.values(data.commits).flat().length}
						</Typography>
					</Box>
					<Typography
						variant="caption"
						sx={{
							display: "block",
							ml: 3.5,
							mt: 0.5,
							color: "text.secondary",
							opacity: 0.8,
						}}
					>
						From {Object.keys(data.commits).length} contributors
					</Typography>
				</Box>
			</Box>
		</Fade>
	);
}

export default CommitsTab;
