import { useMemo, useState } from "react";
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
	alpha,
	Button,
} from "@mui/material";
import {
	ExpandMore as ExpandMoreIcon,
	MergeType as PRIcon,
	MoreHoriz as MoreIcon,
} from "@mui/icons-material";
import type { RepoData } from "../../types/types.ts";

interface PullRequestsTabProps {
	data: RepoData;
}

// 定义主题色
const colors = {
	main: "#F59E0B", // amber
	light: "rgba(245, 158, 11, 0.1)",
	lighter: "rgba(245, 158, 11, 0.05)",
	gradient: "linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)",
};

// Maximum characters to show before collapsing text
const MAX_VISIBLE_CHARS = 150;

// Component to handle collapsible text content
function CollapsibleContent({ text }: { text: string }): JSX.Element {
	const [expanded, setExpanded] = useState(false);
	const shouldCollapse = text.length > MAX_VISIBLE_CHARS;

	const toggleExpanded = (): void => {
		setExpanded(!expanded);
	};

	// If text is shorter than threshold, just display it
	if (!shouldCollapse) {
		return (
			<Typography sx={{ whiteSpace: "pre-wrap", fontSize: "0.85rem" }}>
				{text}
			</Typography>
		);
	}

	return (
		<>
			<Typography sx={{ whiteSpace: "pre-wrap", fontSize: "0.85rem" }}>
				{expanded ? text : `${text.substring(0, MAX_VISIBLE_CHARS)}...`}
			</Typography>
			<Button
				size="small"
				startIcon={<MoreIcon />}
				sx={{
					mt: 1,
					color: colors.main,
					fontSize: "0.75rem",
					"&:hover": {
						backgroundColor: alpha(colors.main, 0.08),
					},
				}}
				onClick={toggleExpanded}
			>
				{expanded ? "Show less" : "Show more"}
			</Button>
		</>
	);
}

function UserPullRequests({
	user,
	prs,
	index,
}: {
	user: string;
	prs: Array<{ title: string; body: string }>;
	index: number;
}): JSX.Element {
	const [expanded, setExpanded] = useState(false);

	const handleChange = (): void => {
		setExpanded(!expanded);
	};

	return (
		<Grow in timeout={800 + index * 150}>
			<Accordion
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
							"0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)",
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
									boxShadow: `0 2px 5px ${alpha(colors.main, 0.4)}`,
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
							icon={<PRIcon style={{ fontSize: "0.9rem" }} />}
							label={`${prs.length} PRs`}
							size="small"
							sx={{
								ml: 2,
								background: colors.gradient,
								color: "white",
								fontWeight: 500,
								boxShadow: "0 2px 5px rgba(245, 158, 11, 0.2)",
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
											width="8%"
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
											width="40%"
											sx={{
												borderBottom: `2px solid ${colors.light}`,
												py: 1.5,
												fontSize: "0.875rem",
												fontWeight: 600,
												color: "rgba(55, 65, 81, 0.9)",
											}}
										>
											Pull Request Title
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
											Description
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{prs.map((pr, prIndex) => (
										<TableRow
											key={prIndex}
											sx={{
												transition: "background-color 0.2s ease",
												"&:hover": {
													backgroundColor: "rgba(245, 158, 11, 0.04)",
												},
												animation: `fadeIn 0.5s ease-out forwards ${prIndex * 0.03}s`,
												opacity: 0,
												"@keyframes fadeIn": {
													"0%": { opacity: 0, transform: "translateY(5px)" },
													"100%": { opacity: 1, transform: "translateY(0)" },
												},
												"&:nth-of-type(odd)": {
													backgroundColor: alpha(colors.main, 0.02),
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
												{prIndex + 1}
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
												{pr.title}
											</TableCell>
											<TableCell
												sx={{
													fontFamily: "monospace",
													borderBottom: "1px solid rgba(0,0,0,0.04)",
													py: 1.25,
												}}
											>
												{pr.body ? (
													<CollapsibleContent text={pr.body} />
												) : (
													<Typography
														sx={{
															color: "text.secondary",
															fontStyle: "italic",
															fontSize: "0.85rem",
														}}
													>
														No description provided
													</Typography>
												)}
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

function PullRequestsTab({ data }: PullRequestsTabProps): JSX.Element {
	const prsByUser = useMemo(() => {
		const users: Record<string, Array<{ title: string; body: string }>> = {};

		Object.entries(data.prs).forEach(([user, prs]) => {
			users[user] = prs;
		});

		return Object.entries(users).sort(([, a], [, b]) => b.length - a.length);
	}, [data.prs]);

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
							"linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.04))",
						border: "1px solid rgba(245, 158, 11, 0.15)",
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
								"radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0) 70%)",
							zIndex: 0,
						},
					}}
				>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 600,
							color: "#B45309",
							mb: 1,
							position: "relative",
							zIndex: 1,
						}}
					>
						Pull Requests Analysis
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: "rgba(107, 114, 128, 0.9)",
							position: "relative",
							zIndex: 1,
						}}
					>
						This analysis shows pull requests created by repository
						contributors.
					</Typography>
				</Box>

				<Box sx={{ mb: 2 }}>
					<Typography
						sx={{
							fontSize: "1.15rem",
							fontWeight: 600,
							color: "#B45309",
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
								background: "linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)",
							},
							"&::after": {
								content: '""',
								position: "absolute",
								bottom: -5,
								left: 16,
								width: "40%",
								height: "2px",
								background: "linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)",
								transition: "width 0.3s ease",
							},
							"&:hover::after": {
								width: "80%",
							},
						}}
					>
						Pull Requests by Author
					</Typography>
				</Box>

				{prsByUser.length === 0 ? (
					<Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
						<Typography>
							No pull request data available for this repository.
						</Typography>
					</Box>
				) : (
					prsByUser.map(([user, prs], index) => (
						<UserPullRequests key={user} index={index} prs={prs} user={user} />
					))
				)}

				<Box
					sx={{
						mt: 4,
						p: 2,
						borderRadius: "12px",
						border: "1px dashed rgba(245, 158, 11, 0.3)",
						backgroundColor: "rgba(245, 158, 11, 0.03)",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1.5,
						}}
					>
						<PRIcon sx={{ color: "#F59E0B", fontSize: "1.1rem" }} />
						<Typography
							sx={{ color: "#B45309", fontWeight: 500 }}
							variant="body2"
						>
							Total Pull Requests: {Object.values(data.prs).flat().length}
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
						Created by {Object.keys(data.prs).length} contributors
					</Typography>
				</Box>
			</Box>
		</Fade>
	);
}

export default PullRequestsTab;
