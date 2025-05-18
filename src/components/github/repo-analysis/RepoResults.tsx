import { useState, useEffect, useMemo } from "react";
import {
	Box,
	Paper,
	Tabs,
	Tab,
	useTheme,
	useMediaQuery,
	alpha,
	Fade,
	Grow,
	Typography,
} from "@mui/material";
import {
	Commit as CommitIcon,
	BugReport as IssueIcon,
	MergeType as PRIcon,
	Group as TeamIcon,
	Assessment as SummaryIcon,
} from "@mui/icons-material";
import type { RepoResultsProps } from "./types";
import TabPanel from "./TabPanel";
import SummaryTab from "../analysis/tabs/SummaryTab.tsx";
import CommitsTab from "../analysis/tabs/CommitsTab.tsx";
import IssuesTab from "../analysis/tabs/IssuesTab.tsx";
import PullRequestsTab from "../analysis/tabs/PullRequestsTab.tsx";
import TeamworkTab from "../analysis/tabs/TeamworkTab.tsx";

function RepoResults({ data }: RepoResultsProps): JSX.Element {
	const [tabValue, setTabValue] = useState(0);
	const [tabTransition, setTabTransition] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	// Calculate total counts for each category
	const counts = useMemo(() => {
		return {
			commits: Object.values(data.commits).reduce(
				(sum, array) => sum + array.length,
				0
			),
			issues: Object.values(data.issues).reduce(
				(sum, array) => sum + array.length,
				0
			),
			prs: Object.values(data.prs).reduce(
				(sum, array) => sum + array.length,
				0
			),
		};
	}, [data]);

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: number
	): void => {
		setTabTransition(false);
		setTimeout(() => {
			setTabValue(newValue);
			setTabTransition(true);
		}, 150);
	};

	useEffect(() => {
		setTabTransition(true);
	}, []);

	// Theme colors
	const colors = {
		summary: "#3B82F6", // blue
		commits: "#10B981", // green
		issues: "#8B5CF6", // purple
		prs: "#F59E0B", // amber
		teamwork: "#EC4899", // pink
	};

	// Tab icons with customized colors
	const tabIcons = {
		summary: (
			<SummaryIcon sx={{ fontSize: "1.25rem", color: colors.summary }} />
		),
		commits: <CommitIcon sx={{ fontSize: "1.25rem", color: colors.commits }} />,
		issues: <IssueIcon sx={{ fontSize: "1.25rem", color: colors.issues }} />,
		prs: <PRIcon sx={{ fontSize: "1.25rem", color: colors.prs }} />,
		teamwork: <TeamIcon sx={{ fontSize: "1.25rem", color: colors.teamwork }} />,
	};

	// Custom tab label with count
	const TabLabelWithCount = ({
		label,
		count,
		color,
	}: {
		label: string;
		count: number;
		color: string;
	}): JSX.Element => (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				flexWrap: "nowrap",
			}}
		>
			<Typography
				sx={{
					fontSize: "0.95rem",
					whiteSpace: "nowrap",
				}}
			>
				{label}
			</Typography>
			<Box
				sx={{
					backgroundColor: alpha(color, 0.1),
					color: color,
					border: `1px solid ${alpha(color, 0.2)}`,
					borderRadius: "12px",
					fontSize: "0.75rem",
					fontWeight: "bold",
					padding: "1px 8px",
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					minWidth: "28px",
					height: "22px",
					whiteSpace: "nowrap",
				}}
			>
				{count}
			</Box>
		</Box>
	);

	// Tab hover effects
	const getTabSx = (index: number): Record<string, unknown> => ({
		overflow: "hidden",
		position: "relative",
		"&::after": {
			content: '""',
			position: "absolute",
			bottom: 0,
			left: "50%",
			width: tabValue === index ? "100%" : "0%",
			height: "3px",
			transform: "translateX(-50%)",
			transition: "width 0.3s ease-in-out",
			borderRadius: "3px 3px 0 0",
			background:
				index === 0
					? `linear-gradient(90deg, ${colors.summary}, ${alpha(colors.summary, 0.7)})`
					: index === 1
						? `linear-gradient(90deg, ${colors.commits}, ${alpha(colors.commits, 0.7)})`
						: index === 2
							? `linear-gradient(90deg, ${colors.issues}, ${alpha(colors.issues, 0.7)})`
							: index === 3
								? `linear-gradient(90deg, ${colors.prs}, ${alpha(colors.prs, 0.7)})`
								: `linear-gradient(90deg, ${colors.teamwork}, ${alpha(colors.teamwork, 0.7)})`,
			opacity: 0.8,
			zIndex: 1,
		},
		"&:hover::after": {
			width: "70%",
		},
		"&.Mui-selected::after": {
			width: "100%",
		},
		"&::before": {
			content: '""',
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: "rgba(0, 0, 0, 0.03)",
			opacity: 0,
			transition: "opacity 0.3s ease",
			zIndex: 0,
		},
		"&:hover::before": {
			opacity: 1,
		},
		"&.Mui-selected::before": {
			opacity: 0,
		},
		// Icon and label styling
		"& .MuiTab-iconWrapper": {
			transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
			marginRight: "8px",
		},
		"&:hover .MuiTab-iconWrapper": {
			transform: "translateY(-2px) scale(1.1)",
		},
	});

	return (
		<Box
			sx={{
				position: "relative",
				pt: 2,
				"&::before": {
					content: '""',
					position: "absolute",
					top: -100,
					left: -150,
					width: 300,
					height: 300,
					background:
						"radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)",
					borderRadius: "50%",
					zIndex: -1,
					animation: "pulse 15s infinite alternate ease-in-out",
				},
				"&::after": {
					content: '""',
					position: "absolute",
					bottom: -50,
					right: -100,
					width: 250,
					height: 250,
					background:
						"radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, rgba(236, 72, 153, 0) 70%)",
					borderRadius: "50%",
					zIndex: -1,
					animation: "pulse 12s infinite alternate-reverse ease-in-out",
				},
				"@keyframes pulse": {
					"0%": { opacity: 0.5, transform: "scale(1)" },
					"100%": { opacity: 0.7, transform: "scale(1.1)" },
				},
			}}
		>
			<Grow in timeout={800}>
				<Paper
					elevation={2}
					sx={{
						mb: 6,
						borderRadius: "16px",
						overflow: "hidden",
						background:
							"linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
						backdropFilter: "blur(8px)",
						transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
						borderTop: "1px solid rgba(255, 255, 255, 0.5)",
						boxShadow:
							"0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow:
								"0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 10px -5px rgba(0, 0, 0, 0.03)",
						},
						position: "relative",
						// Glowing accent based on active tab
						"&::before": {
							content: '""',
							position: "absolute",
							bottom: 0,
							left: 0,
							width: "100%",
							height: "3px",
							background:
								tabValue === 0
									? `linear-gradient(90deg, ${colors.summary}, transparent)`
									: tabValue === 1
										? `linear-gradient(90deg, ${colors.commits}, transparent)`
										: tabValue === 2
											? `linear-gradient(90deg, ${colors.issues}, transparent)`
											: tabValue === 3
												? `linear-gradient(90deg, ${colors.prs}, transparent)`
												: `linear-gradient(90deg, ${colors.teamwork}, transparent)`,
							opacity: 0.8,
						},
					}}
				>
					<Tabs
						aria-label="repo analysis tabs"
						scrollButtons={isMobile ? "auto" : false}
						value={tabValue}
						variant={isMobile ? "scrollable" : "fullWidth"}
						TabIndicatorProps={{
							sx: {
								background: `linear-gradient(90deg, ${
									tabValue === 0
										? colors.summary
										: tabValue === 1
											? colors.commits
											: tabValue === 2
												? colors.issues
												: tabValue === 3
													? colors.prs
													: colors.teamwork
								} 30%, ${alpha(
									tabValue === 0
										? colors.summary
										: tabValue === 1
											? colors.commits
											: tabValue === 2
												? colors.issues
												: tabValue === 3
													? colors.prs
													: colors.teamwork,
									0.7
								)} 100%)`,
								height: 3,
								borderRadius: "3px 3px 0 0",
								transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
							},
						}}
						sx={{
							minHeight: "60px",
							borderBottom: "1px solid rgba(0,0,0,0.04)",
							"& .MuiTab-root": {
								textTransform: "none",
								fontSize: "0.95rem",
								fontWeight: 500,
								minHeight: "60px",
								color: "rgba(75, 85, 99, 0.7)",
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								zIndex: 1,
								minWidth: {
									xs: "120px", // Increased min width on mobile
									sm: "0",
								},
								padding: {
									xs: "0 10px",
									sm: "0 16px",
								},
							},
							"& .Mui-selected": {
								color:
									tabValue === 0
										? colors.summary
										: tabValue === 1
											? colors.commits
											: tabValue === 2
												? colors.issues
												: tabValue === 3
													? colors.prs
													: colors.teamwork,
								fontWeight: 600,
							},
						}}
						onChange={handleTabChange}
					>
						<Tab
							icon={tabIcons.summary}
							iconPosition="start"
							label="Summary"
							sx={getTabSx(0)}
						/>
						<Tab
							icon={tabIcons.commits}
							iconPosition="start"
							sx={getTabSx(1)}
							label={
								<TabLabelWithCount
									color={colors.commits}
									count={counts.commits}
									label="Commits"
								/>
							}
						/>
						<Tab
							icon={tabIcons.issues}
							iconPosition="start"
							sx={getTabSx(2)}
							label={
								<TabLabelWithCount
									color={colors.issues}
									count={counts.issues}
									label="Issues"
								/>
							}
						/>
						<Tab
							icon={tabIcons.prs}
							iconPosition="start"
							sx={getTabSx(3)}
							label={
								<TabLabelWithCount
									color={colors.prs}
									count={counts.prs}
									label={isMobile ? "PRs" : "Pull Requests"}
								/>
							}
						/>
						<Tab
							icon={tabIcons.teamwork}
							iconPosition="start"
							label="Teamwork"
							sx={getTabSx(4)}
						/>
					</Tabs>
				</Paper>
			</Grow>

			<Fade in={tabTransition} timeout={400}>
				<Box
					sx={{
						position: "relative",
						minHeight: "300px",
					}}
				>
					<TabPanel index={0} value={tabValue}>
						<SummaryTab data={data} />
					</TabPanel>

					<TabPanel index={1} value={tabValue}>
						<CommitsTab data={data} />
					</TabPanel>

					<TabPanel index={2} value={tabValue}>
						<IssuesTab data={data} />
					</TabPanel>

					<TabPanel index={3} value={tabValue}>
						<PullRequestsTab data={data} />
					</TabPanel>

					<TabPanel index={4} value={tabValue}>
						<TeamworkTab data={data} />
					</TabPanel>
				</Box>
			</Fade>
		</Box>
	);
}

export default RepoResults;
