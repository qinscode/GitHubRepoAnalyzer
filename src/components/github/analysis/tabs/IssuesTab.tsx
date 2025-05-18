import { useMemo, useState } from "react";
import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Avatar,
	Chip,
	Fade,
	Grow,
	alpha,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Button,
} from "@mui/material";
import {
	ExpandMore as ExpandMoreIcon,
	BugReport as IssueIcon,
	MoreHoriz as MoreIcon,
} from "@mui/icons-material";
import type { RepoData } from "../../types/types.ts";
import type { Issue } from "../../../../services/github/types.ts";

interface IssuesTabProps {
	data: RepoData;
}

const colors = {
	main: "#8B5CF6", // purple
	light: "rgba(139, 92, 246, 0.1)",
	lighter: "rgba(139, 92, 246, 0.05)",
	gradient: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
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

function UserIssues({
	user,
	issues,
	index,
}: {
	user: string;
	issues: Array<Issue>;
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
							"0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)",
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
							icon={<IssueIcon style={{ fontSize: "0.9rem" }} />}
							label={`${issues.length} issues`}
							size="small"
							sx={{
								ml: 2,
								background: colors.gradient,
								color: "white",
								fontWeight: 500,
								boxShadow: "0 2px 5px rgba(139, 92, 246, 0.2)",
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
											width="30%"
											sx={{
												borderBottom: `2px solid ${colors.light}`,
												py: 1.5,
												fontSize: "0.875rem",
												fontWeight: 600,
												color: "rgba(55, 65, 81, 0.9)",
											}}
										>
											Issue Title
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
										<TableCell
											width="15%"
											sx={{
												borderBottom: `2px solid ${colors.light}`,
												py: 1.5,
												fontSize: "0.875rem",
												fontWeight: 600,
												color: "rgba(55, 65, 81, 0.9)",
											}}
										>
											Date
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{issues.map((issue, issueIndex) => (
										<TableRow
											key={issueIndex}
											sx={{
												transition: "background-color 0.2s ease",
												"&:hover": {
													backgroundColor: "rgba(139, 92, 246, 0.04)",
												},
												animation: `fadeIn 0.5s ease-out forwards ${issueIndex * 0.03}s`,
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
												{issueIndex + 1}
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
												{issue.title}
											</TableCell>
											<TableCell
												sx={{
													fontFamily: "monospace",
													borderBottom: "1px solid rgba(0,0,0,0.04)",
													py: 1.25,
												}}
											>
												{issue.body ? (
													<CollapsibleContent text={issue.body} />
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
											<TableCell
												sx={{
													fontFamily: "monospace",
													fontSize: "0.85rem",
													borderBottom: "1px solid rgba(0,0,0,0.04)",
													py: 1.25,
													color: "text.secondary",
												}}
											>
												{issue.date || "18/05/2025 14:30"}
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

function IssuesTab({ data }: IssuesTabProps): JSX.Element {
	const issuesByUser = useMemo(() => {
		type IssueWithDate = Issue;
		const users: Record<string, Array<IssueWithDate>> = {};

		// Group issues by user
		Object.entries(data.issues).forEach(([user, issues]) => {
			// Add default date if missing
			users[user] = issues.map(issue => ({
				...issue,
				date: issue.date || "18/05/2025 14:30" // Default date
			}));
		});

		// Sort users by number of issues (descending)
		return Object.entries(users).sort(([, a], [, b]) => b.length - a.length);
	}, [data.issues]);

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
							"linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(124, 58, 237, 0.04))",
						border: "1px solid rgba(139, 92, 246, 0.15)",
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
								"radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0) 70%)",
							zIndex: 0,
						},
					}}
				>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 600,
							color: "#5B21B6",
							mb: 1,
							position: "relative",
							zIndex: 1,
						}}
					>
						Issues Analysis
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: "rgba(107, 114, 128, 0.9)",
							position: "relative",
							zIndex: 1,
						}}
					>
						This analysis shows issues created by repository contributors.
					</Typography>
				</Box>

				<Box sx={{ mb: 2 }}>
					<Typography
						sx={{
							fontSize: "1.15rem",
							fontWeight: 600,
							color: "#5B21B6",
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
								background: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
							},
							"&::after": {
								content: '""',
								position: "absolute",
								bottom: -5,
								left: 16,
								width: "40%",
								height: "2px",
								background: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
								transition: "width 0.3s ease",
							},
							"&:hover::after": {
								width: "80%",
							},
						}}
					>
						Issues by Creator
					</Typography>
				</Box>

				{issuesByUser.length === 0 ? (
					<Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
						<Typography>
							No issues data available for this repository.
						</Typography>
					</Box>
				) : (
					issuesByUser.map(([user, issues], index) => (
						<UserIssues key={user} index={index} issues={issues} user={user} />
					))
				)}

				<Box
					sx={{
						mt: 4,
						p: 2,
						borderRadius: "12px",
						border: "1px dashed rgba(139, 92, 246, 0.3)",
						backgroundColor: "rgba(139, 92, 246, 0.03)",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1.5,
						}}
					>
						<IssueIcon sx={{ color: "#8B5CF6", fontSize: "1.1rem" }} />
						<Typography
							sx={{ color: "#5B21B6", fontWeight: 500 }}
							variant="body2"
						>
							Total Issues: {Object.values(data.issues).flat().length}
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
						Created by {Object.keys(data.issues).length} users
					</Typography>
				</Box>
			</Box>
		</Fade>
	);
}

export default IssuesTab;
