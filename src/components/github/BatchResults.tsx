import React, { useState } from "react";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Button,
	Chip,
	Collapse,
	Avatar,
	Tooltip,
	Stack,
	Divider,
	alpha,
	IconButton,
	Fade,
	useTheme,
	Container,
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

// 自定义颜色配置
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

// 统计指标卡片组件
const StatCard = ({ 
	icon, 
	label, 
	value, 
	color, 
	iconColor,
	tooltipTitle 
}: { 
	icon: React.ReactNode; 
	label: string; 
	value: number; 
	color: string; 
	iconColor: string;
	tooltipTitle: string;
}) => {
	return (
		<Tooltip title={tooltipTitle} arrow placement="top">
			<Card
				elevation={0}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					p: 1,
					backgroundColor: alpha(color, 0.08),
					border: `1px solid ${alpha(color, 0.1)}`,
					borderRadius: "12px",
					minWidth: "80px",
					transition: "all 0.3s ease",
					"&:hover": {
						transform: "translateY(-2px)",
						backgroundColor: alpha(color, 0.12),
						boxShadow: `0 4px 12px ${alpha(color, 0.15)}`
					}
				}}
			>
				<Box 
					sx={{ 
						backgroundColor: alpha(color, 0.15),
						borderRadius: "50%",
						width: 36,
						height: 36,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						mb: 0.5,
						color: iconColor,
					}}
				>
					{icon}
				</Box>
				<Typography variant="h6" fontWeight={600} color={iconColor}>
					{value}
				</Typography>
				<Typography variant="caption" color={alpha(iconColor, 0.7)} fontWeight={500}>
					{label}
				</Typography>
			</Card>
		</Tooltip>
	);
};

// 主组件
function BatchResults({ results }: BatchResultsProps): JSX.Element {
	const [expandedRepo, setExpandedRepo] = useState<string | null>(null);
	const theme = useTheme();

	const handleToggleDetails = (repoUrl: string): void => {
		setExpandedRepo(expandedRepo === repoUrl ? null : repoUrl);
	};

	const copyRepoUrl = (url: string): void => {
		navigator.clipboard.writeText(url);
		// 可以添加复制成功的提示，但为了简洁暂不实现
	};

	const openInGitHub = (url: string): void => {
		window.open(url, "_blank");
	};

	return (
		<Box 
			sx={{
				animation: 'fadeIn 0.5s ease-out forwards',
				"@keyframes fadeIn": {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 }
				},
			}}
		>
			<Box sx={{ mb: 4 }}>
				<Typography 
					variant="h4" 
					component="h1" 
					sx={{ 
						fontWeight: 700, 
						color: "#1E40AF",
						mb: 1, 
						position: "relative",
						display: "inline-block",
						"&::after": {
							content: '""',
							position: "absolute",
							bottom: -8,
							left: 0,
							width: "60%",
							height: 4,
							borderRadius: 2,
							background: "linear-gradient(90deg, #3B82F6 0%, #4F46E5 100%)",
							transition: "width 0.3s ease",
						},
						"&:hover::after": {
							width: "100%"
						}
					}}
				>
					Repository Analysis Results
				</Typography>
				
				<Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: "800px" }}>
					Analyzed {results.length} repositories. Click on "View Details" to see comprehensive analysis for each repository.
				</Typography>
			</Box>

			<Stack spacing={3}>
				{results.map((result, index) => (
					<Fade key={result.repoUrl} in={true} style={{ transitionDelay: `${index * 50}ms` }}>
						<Card
							elevation={2}
							sx={{
								borderRadius: "16px",
								overflow: "hidden",
								background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
								backdropFilter: "blur(8px)",
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								borderLeft: "1px solid rgba(59, 130, 246, 0.2)",
								borderTop: "1px solid rgba(255, 255, 255, 0.7)",
								boxShadow: expandedRepo === result.repoUrl
									? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
									: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
								"&:hover": {
									transform: expandedRepo === result.repoUrl ? "none" : "translateY(-4px)",
									boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.05)"
								},
								position: "relative",
								"&::before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: "4px",
									background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
									opacity: expandedRepo === result.repoUrl ? 1 : 0,
									transition: "opacity 0.3s ease",
								},
							}}
						>
							<CardContent sx={{ p: 0 }}>
								{/* 仓库主信息 */}
								<Box sx={{ p: 3 }}>
									<Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between" }}>
										{/* 仓库标识和名称 */}
										<Box sx={{ display: "flex", alignItems: "center", width: { xs: "100%", md: "33%" } }}>
											<Avatar
												sx={{
													width: 48, 
													height: 48, 
													mr: 2,
													background: "linear-gradient(135deg, #3b82f6, #6366f1)",
													fontSize: "1.1rem",
													fontWeight: "bold",
													boxShadow: "0 4px 8px rgba(59, 130, 246, 0.25)",
												}}
											>
												{result.repoName.charAt(0).toUpperCase()}
											</Avatar>
											<Box>
												<Typography 
													variant="h6" 
													sx={{ 
														fontWeight: 700, 
														color: "text.primary",
														lineHeight: 1.3,
													}}
												>
													{result.repoName.split("/")[1] || result.repoName}
												</Typography>
												<Typography 
													variant="body2" 
													sx={{ 
														color: "text.secondary",
														display: "flex",
														alignItems: "center",
														gap: 0.5,
													}}
												>
													<GitHubIcon sx={{ fontSize: 14 }} />
													{result.repoName}
												</Typography>
											</Box>
										</Box>

										{/* 统计数据 */}
										<Box sx={{ width: { xs: "100%", md: "42%" } }}>
											<Box sx={{ display: "flex", gap: 1 }}>
												<Box sx={{ flex: 1 }}>
													<StatCard 
														icon={<CommitIcon />}
														label="Commits" 
														value={result.commits}
														color={statColors.commits.light}
														iconColor={statColors.commits.main}
														tooltipTitle="Total number of commits"
													/>
												</Box>
												<Box sx={{ flex: 1 }}>
													<StatCard 
														icon={<IssueIcon />}
														label="Issues" 
														value={result.issues}
														color={statColors.issues.light}
														iconColor={statColors.issues.main}
														tooltipTitle="Total number of issues"
													/>
												</Box>
												<Box sx={{ flex: 1 }}>
													<StatCard 
														icon={<PRIcon />}
														label="PRs" 
														value={result.prs}
														color={statColors.prs.light}
														iconColor={statColors.prs.main}
														tooltipTitle="Total number of pull requests"
													/>
												</Box>
												<Box sx={{ flex: 1 }}>
													<StatCard 
														icon={<TeamIcon />}
														label="Members" 
														value={result.contributors}
														color={statColors.contributors.light}
														iconColor={statColors.contributors.main}
														tooltipTitle="Total number of contributors"
													/>
												</Box>
											</Box>
										</Box>

										{/* 操作按钮 */}
										<Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, width: { xs: "100%", md: "25%" } }}>
											<Stack direction="row" spacing={1} alignItems="center">
												<Tooltip title="Copy Repository URL">
													<IconButton
														size="small"
														onClick={() => copyRepoUrl(result.repoUrl)}
														sx={{
															backgroundColor: alpha(theme.palette.primary.main, 0.1),
															color: theme.palette.primary.main,
															"&:hover": {
																backgroundColor: alpha(theme.palette.primary.main, 0.2),
																transform: "scale(1.05)",
															},
														}}
													>
														<CopyIcon fontSize="small" />
													</IconButton>
												</Tooltip>
												
												<Tooltip title="Open in GitHub">
													<IconButton
														size="small"
														onClick={() => openInGitHub(result.repoUrl)}
														sx={{
															backgroundColor: alpha(theme.palette.grey[700], 0.1),
															color: theme.palette.grey[700],
															"&:hover": {
																backgroundColor: alpha(theme.palette.grey[700], 0.2),
																transform: "scale(1.05)",
															},
														}}
													>
														<OpenInNewIcon fontSize="small" />
													</IconButton>
												</Tooltip>
												
												<Button
													variant="contained"
													color="primary"
													endIcon={expandedRepo === result.repoUrl ? <CollapseIcon /> : <ExpandIcon />}
													onClick={() => handleToggleDetails(result.repoUrl)}
													sx={{
														borderRadius: "10px",
														textTransform: "none",
														fontWeight: 600,
														boxShadow: "none",
														background: expandedRepo === result.repoUrl 
															? "linear-gradient(45deg, #3B82F6, #4F46E5)" 
															: "linear-gradient(45deg, #4F46E5, #3B82F6)",
														transition: "all 0.3s ease",
														"&:hover": {
															transform: "translateY(-2px)",
															boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)",
														},
													}}
												>
													{expandedRepo === result.repoUrl ? "Hide Details" : "View Details"}
												</Button>
											</Stack>
										</Box>
									</Box>
								</Box>

								{/* 仓库详情 */}
								<Collapse in={expandedRepo === result.repoUrl} timeout="auto" unmountOnExit>
									<Divider sx={{ opacity: 0.6 }} />
									<Box sx={{ p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
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
