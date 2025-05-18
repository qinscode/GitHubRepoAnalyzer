import type React from "react";
import { useState } from "react";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Button,
	Collapse,
	Avatar,
	Tooltip,
	Stack,
	Divider,
	alpha,
	IconButton,
	Fade,
	useTheme,
	Chip,
} from "@mui/material";
import {
	Commit as CommitIcon,
	BugReport as IssueIcon,
	MergeType as PRIcon,
	Group as TeamIcon,
	KeyboardArrowDown as ExpandIcon,
	KeyboardArrowUp as CollapseIcon,
	GitHub as GitHubIcon,
	ContentCopy as CopyIcon,
	OpenInNew as OpenInNewIcon,
	Check as CheckIcon,
} from "@mui/icons-material";
import RepoResults from "./RepoResults";

interface RepoData {
	commits: Record<string, Array<{ message: string; id: string }>>;
	issues: Record<string, Array<{ title: string; body: string }>>;
	prs: Record<string, Array<{ title: string }>>;
	teamwork: {
		issueComments: Record<string, number>;
		prReviews: Record<string, number>;
	};
}

interface RepoResult {
	repoUrl: string;
	repoName: string;
	commits: number;
	issues: number;
	prs: number;
	contributors: number;
	data: RepoData;
}

interface BatchResultsProps {
	results: Array<RepoResult>;
}

// Custom color configuration
const statColors = {
	commits: {
		main: "#2563eb",
		light: "rgba(37, 99, 235, 0.1)",
		gradient: "linear-gradient(45deg, #2563eb, #1d4ed8)",
	},
	issues: {
		main: "#8e44ad",
		light: "rgba(142, 68, 173, 0.1)",
		gradient: "linear-gradient(45deg, #8e44ad, #9b59b6)",
	},
	prs: {
		main: "#0891b2",
		light: "rgba(8, 145, 178, 0.1)",
		gradient: "linear-gradient(45deg, #0891b2, #06b6d4)",
	},
	contributors: {
		main: "#16a34a",
		light: "rgba(22, 163, 74, 0.1)",
		gradient: "linear-gradient(45deg, #16a34a, #22c55e)",
	},
};

// Statistics item component
const StatItem = ({
	icon,
	label,
	value,
	color,
}: {
	icon: React.ReactNode;
	label: string;
	value: number;
	color: string;
}) => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				transition: "transform 0.2s ease",
				"&:hover": {
					transform: "translateY(-2px)",
				},
			}}
		>
			<Box
				sx={{
					color,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{icon}
			</Box>
			<Typography
				variant="h6"
				sx={{
					fontWeight: 600,
					fontSize: "1.1rem",
					color,
				}}
			>
				{value}
			</Typography>
			<Typography
				variant="caption"
				sx={{
					color: alpha(color, 0.7),
					fontWeight: 500,
					fontSize: "0.75rem",
				}}
			>
				{label}
			</Typography>
		</Box>
	);
};

// Main component
function BatchResults({ results }: BatchResultsProps): JSX.Element {
	const [expandedRepo, setExpandedRepo] = useState<string | null>(null);
	const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
	const theme = useTheme();

	const handleToggleDetails = (repoUrl: string): void => {
		setExpandedRepo(expandedRepo === repoUrl ? null : repoUrl);
	};

	const copyRepoUrl = (url: string): void => {
		navigator.clipboard.writeText(url);
		setCopiedUrl(url);
		setTimeout(() => {
			setCopiedUrl(null);
		}, 2000);
	};

	const openInGitHub = (url: string): void => {
		window.open(url, "_blank");
	};

	return (
		<Box
			sx={{
				animation: "fadeIn 0.5s ease-out forwards",
				"@keyframes fadeIn": {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				position: "relative",
				"&::before": {
					content: '""',
					position: "absolute",
					top: -100,
					left: -150,
					width: 300,
					height: 300,
					background:
						"radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 70%)",
					borderRadius: "50%",
					zIndex: -1,
				},
				"&::after": {
					content: '""',
					position: "absolute",
					bottom: -100,
					right: -150,
					width: 300,
					height: 300,
					background:
						"radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, rgba(79, 70, 229, 0) 70%)",
					borderRadius: "50%",
					zIndex: -1,
				},
			}}
		>
			<Box sx={{ mb: 4 }}>
				<Typography
					color="text.secondary"
					sx={{ mb: 3, maxWidth: "800px" }}
					variant="body1"
				>
					Analyzed {results.length} repositories. Click on "View Details" to see
					comprehensive analysis for each repository.
				</Typography>
			</Box>

			<Stack spacing={2.5}>
				{results.map((result, index) => (
					<Fade
						key={result.repoUrl}
						in
						style={{ transitionDelay: `${index * 80}ms` }}
					>
						<Card
							elevation={1}
							sx={{
								borderRadius: "12px",
								overflow: "hidden",
								background:
									"linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.95))",
								backdropFilter: "blur(10px)",
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								borderLeft: "1px solid rgba(59, 130, 246, 0.2)",
								borderTop: "1px solid rgba(255, 255, 255, 0.7)",
								boxShadow:
									expandedRepo === result.repoUrl
										? "0 15px 20px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
										: "0 2px 5px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)",
								"&:hover": {
									transform:
										expandedRepo === result.repoUrl
											? "none"
											: "translateY(-3px)",
									boxShadow:
										"0 10px 15px -5px rgba(59, 130, 246, 0.08), 0 5px 10px -5px rgba(59, 130, 246, 0.05)",
								},
								position: "relative",
								"&::before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: "3px",
									background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
									opacity: expandedRepo === result.repoUrl ? 1 : 0,
									transition: "opacity 0.3s ease",
								},
							}}
						>
							<CardContent sx={{ p: 2.5 }}>
								<Stack
									alignItems={{ xs: "flex-start", sm: "center" }}
									direction={{ xs: "column", sm: "row" }}
									spacing={2}
								>
									{/* Left: Repository identifier and name */}
									<Box
										sx={{
											width: { xs: "100%", sm: "30%" },
											mb: { xs: 1, sm: 0 },
										}}
									>
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<Avatar
												sx={{
													width: 42,
													height: 42,
													mr: 1.5,
													background:
														"linear-gradient(135deg, #3b82f6, #6366f1)",
													fontSize: "1rem",
													fontWeight: "bold",
													boxShadow: "0 3px 5px rgba(59, 130, 246, 0.25)",
													transition: "all 0.3s ease",
													"&:hover": {
														transform: "scale(1.05)",
														boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)",
													},
												}}
											>
												{result.repoName.charAt(0).toUpperCase()}
											</Avatar>
											<Box sx={{ overflow: "hidden" }}>
												<Typography
													variant="h6"
													sx={{
														fontWeight: 700,
														color: "text.primary",
														lineHeight: 1.3,
														fontSize: "1rem",
														whiteSpace: "nowrap",
														overflow: "hidden",
														textOverflow: "ellipsis",
														maxWidth: { xs: "200px", sm: "160px", md: "220px" },
													}}
												>
													{result.repoName.split("/")[1] || result.repoName}
												</Typography>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 0.5,
													}}
												>
													<GitHubIcon
														sx={{ fontSize: 14, color: "text.secondary" }}
													/>
													<Typography
														variant="body2"
														sx={{
															color: "text.secondary",
															fontSize: "0.8rem",
															whiteSpace: "nowrap",
															overflow: "hidden",
															textOverflow: "ellipsis",
															maxWidth: {
																xs: "190px",
																sm: "150px",
																md: "210px",
															},
														}}
													>
														{result.repoName}
													</Typography>
												</Box>
											</Box>
										</Box>
									</Box>

									{/* Middle: Statistics data */}
									<Box
										sx={{
											width: { xs: "100%", sm: "40%" },
											mb: { xs: 2, sm: 0 },
										}}
									>
										<Stack
											direction="row"
											justifyContent={{ xs: "space-between", sm: "flex-start" }}
											spacing={{ xs: 2, md: 3 }}
											sx={{
												pl: { xs: 1, sm: 0 },
												pr: { xs: 1, sm: 0 },
											}}
										>
											<StatItem
												color={statColors.commits.main}
												icon={<CommitIcon sx={{ fontSize: "1.2rem" }} />}
												label="Commits"
												value={result.commits}
											/>
											<StatItem
												color={statColors.issues.main}
												icon={<IssueIcon sx={{ fontSize: "1.2rem" }} />}
												label="Issues"
												value={result.issues}
											/>
											<StatItem
												color={statColors.prs.main}
												icon={<PRIcon sx={{ fontSize: "1.2rem" }} />}
												label="PRs"
												value={result.prs}
											/>
										</Stack>
									</Box>

									{/* Right: Action buttons */}
									<Box
										sx={{
											width: { xs: "100%", sm: "30%" },
											display: "flex",
											justifyContent: { xs: "flex-start", sm: "flex-end" },
										}}
									>
										<Stack
											direction="row"
											spacing={1}
											sx={{ mt: { xs: 0, sm: 0 } }}
										>
											<Tooltip
												title={
													copiedUrl === result.repoUrl ? "Copied!" : "Copy URL"
												}
											>
												<IconButton
													aria-label="Copy repository URL"
													size="small"
													sx={{
														backgroundColor: alpha(
															theme.palette.primary.main,
															0.1
														),
														color:
															copiedUrl === result.repoUrl
																? theme.palette.success.main
																: theme.palette.primary.main,
														width: 32,
														height: 32,
														"&:hover": {
															backgroundColor: alpha(
																theme.palette.primary.main,
																0.15
															),
															transform: "translateY(-2px)",
														},
													}}
													onClick={() => {
														copyRepoUrl(result.repoUrl);
													}}
												>
													{copiedUrl === result.repoUrl ? (
														<CheckIcon fontSize="small" />
													) : (
														<CopyIcon fontSize="small" />
													)}
												</IconButton>
											</Tooltip>

											<Tooltip title="Open in GitHub">
												<IconButton
													aria-label="Open repository in GitHub"
													size="small"
													sx={{
														backgroundColor: alpha(
															theme.palette.grey[700],
															0.08
														),
														color: theme.palette.grey[700],
														width: 32,
														height: 32,
														"&:hover": {
															backgroundColor: alpha(
																theme.palette.grey[700],
																0.15
															),
															transform: "translateY(-2px)",
														},
													}}
													onClick={() => {
														openInGitHub(result.repoUrl);
													}}
												>
													<OpenInNewIcon fontSize="small" />
												</IconButton>
											</Tooltip>

											<Button
												color="primary"
												size="small"
												endIcon={
													expandedRepo === result.repoUrl ? (
														<CollapseIcon />
													) : (
														<ExpandIcon />
													)
												}
												sx={{
													borderRadius: "8px",
													textTransform: "none",
													fontWeight: 600,
													fontSize: "0.85rem",
													minWidth: "115px",
													height: 32,
													boxShadow: "none",
													...(expandedRepo === result.repoUrl
														? {
																background:
																	"linear-gradient(45deg, #3B82F6, #4F46E5)",
															}
														: {
																borderColor: alpha(
																	theme.palette.primary.main,
																	0.5
																),
															}),
													"&:hover": {
														transform: "translateY(-2px)",
														boxShadow:
															expandedRepo === result.repoUrl
																? "0 4px 8px rgba(59, 130, 246, 0.25)"
																: "none",
														...(expandedRepo !== result.repoUrl
															? {
																	borderColor: alpha(
																		theme.palette.primary.main,
																		0.8
																	),
																	backgroundColor: alpha(
																		theme.palette.primary.main,
																		0.04
																	),
																}
															: {}),
													},
												}}
												variant={
													expandedRepo === result.repoUrl
														? "contained"
														: "outlined"
												}
												onClick={() => {
													handleToggleDetails(result.repoUrl);
												}}
											>
												{expandedRepo === result.repoUrl
													? "Hide Details"
													: "View Details"}
											</Button>
										</Stack>
									</Box>
								</Stack>

								{/* Repository details */}
								<Collapse
									unmountOnExit
									in={expandedRepo === result.repoUrl}
									timeout="auto"
								>
									<Divider sx={{ my: 2, opacity: 0.6 }} />
									<Box
										sx={{
											backgroundColor: alpha(theme.palette.primary.main, 0.02),
											backgroundImage:
												"radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.04) 2%, transparent 12%), radial-gradient(circle at 75px 75px, rgba(79, 70, 229, 0.03) 2%, transparent 12%)",
											backgroundSize: "100px 100px",
											borderRadius: "8px",
											p: 2,
										}}
									>
										<RepoResults data={result.data} />
									</Box>
								</Collapse>
							</CardContent>
						</Card>
					</Fade>
				))}
			</Stack>
		</Box>
	);
}

export default BatchResults;
