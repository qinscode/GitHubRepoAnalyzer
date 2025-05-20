import { Tabs, Tab, Typography, Box, alpha, useMediaQuery, useTheme } from "@mui/material";
import {
	Commit as CommitIcon,
	BugReport as IssueIcon,
	MergeType as PRIcon,
	Group as TeamIcon,
	Assessment as SummaryIcon,
	EmojiEvents as BonusIcon,
} from "@mui/icons-material";

interface RepoTabBarProps {
	tabValue: number;
	handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
	counts: {
		commits: number;
		issues: number;
		prs: number;
	};
	isMobile: boolean;
}

function RepoTabBar({
	tabValue,
	handleTabChange,
	counts,
	isMobile,
}: RepoTabBarProps) {
	const theme = useTheme();
	const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
	const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
	
	// Theme colors
	const colors = {
		summary: "#3B82F6", // blue
		commits: "#10B981", // green
		issues: "#8B5CF6", // purple
		prs: "#F59E0B", // amber
		teamwork: "#EC4899", // pink
		bonus: "#06B6D4", // cyan
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
		bonus: <BonusIcon sx={{ fontSize: "1.25rem", color: colors.bonus }} />,
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
	}) => (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: isLargeScreen ? 1.5 : 0.5,
				flexWrap: "nowrap",
			}}
		>
			<Typography
				sx={{
					fontSize: {
						xs: "0.8rem",
						sm: "0.85rem", 
						md: "0.9rem",
						lg: "0.95rem",
					},
					whiteSpace: "nowrap",
				}}
			>
				{label}
			</Typography>
			{!isMediumScreen && (
				<Box
					sx={{
						backgroundColor: alpha(color, 0.1),
						color: color,
						border: `1px solid ${alpha(color, 0.2)}`,
						borderRadius: "12px",
						fontSize: isLargeScreen ? "0.75rem" : "0.7rem",
						fontWeight: "bold",
						padding: isLargeScreen ? "1px 8px" : "1px 6px",
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						minWidth: isLargeScreen ? "28px" : "24px",
						height: isLargeScreen ? "22px" : "20px",
						whiteSpace: "nowrap",
					}}
				>
					{count}
				</Box>
			)}
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
								: index === 4
									? `linear-gradient(90deg, ${colors.teamwork}, ${alpha(colors.teamwork, 0.7)})`
									: `linear-gradient(90deg, ${colors.bonus}, ${alpha(colors.bonus, 0.7)})`,
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
			marginRight: {
				xs: "4px",
				sm: "6px",
				md: "8px",
			}
		},
		"&:hover .MuiTab-iconWrapper": {
			transform: "translateY(-2px) scale(1.1)",
		},
	});

	// Helper function to get compact label based on screen size
	const getCompactLabel = (fullLabel: string, shortLabel: string) => {
		if (isMobile) return shortLabel;
		if (isMediumScreen) return shortLabel;
		return fullLabel;
	};

	return (
		<Box
			sx={{
				position: "relative",
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
										: tabValue === 4
											? `linear-gradient(90deg, ${colors.teamwork}, transparent)`
											: `linear-gradient(90deg, ${colors.bonus}, transparent)`,
					opacity: 0.8,
				},
			}}
		>
			<Tabs
				aria-label="repo analysis tabs"
				scrollButtons="auto"
				value={tabValue}
				variant={!isLargeScreen ? "scrollable" : "fullWidth"}
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
											: tabValue === 4
												? colors.teamwork
												: colors.bonus
						} 30%, ${alpha(
							tabValue === 0
								? colors.summary
								: tabValue === 1
									? colors.commits
									: tabValue === 2
										? colors.issues
										: tabValue === 3
											? colors.prs
											: tabValue === 4
												? colors.teamwork
												: colors.bonus,
							0.7
						)} 100%)`,
						height: 3,
						borderRadius: "3px 3px 0 0",
						transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
					},
				}}
				sx={{
					minHeight: {
						xs: "50px",
						sm: "55px",
						md: "58px",
						lg: "60px",
					},
					borderBottom: "1px solid rgba(0,0,0,0.04)",
					"& .MuiTab-root": {
						textTransform: "none",
						fontSize: {
							xs: "0.8rem",
							sm: "0.85rem",
							md: "0.9rem",
							lg: "0.95rem",
						},
						fontWeight: 500,
						minHeight: {
							xs: "50px",
							sm: "55px",
							md: "58px",
							lg: "60px",
						},
						color: "rgba(75, 85, 99, 0.7)",
						transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						zIndex: 1,
						minWidth: {
							xs: "90px",
							sm: "100px",
							md: "110px",
							lg: "0",
						},
						padding: {
							xs: "0 6px",
							sm: "0 8px",
							md: "0 10px",
							lg: "0 16px",
						},
					},
					"& .MuiTab-iconWrapper": {
						fontSize: {
							xs: "1rem",
							sm: "1.1rem",
							md: "1.15rem",
							lg: "1.25rem",
						},
						marginRight: {
							xs: "4px",
							sm: "5px",
							md: "6px",
							lg: "8px",
						}
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
											: tabValue === 4
												? colors.teamwork
												: colors.bonus,
						fontWeight: 600,
					},
				}}
				onChange={handleTabChange}
			>
				<Tab
					icon={tabIcons.summary}
					iconPosition="start"
					label={getCompactLabel("Summary", "Summary")}
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
							label={getCompactLabel("Commits", "Commits")}
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
							label={getCompactLabel("Issues", "Issues")}
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
							label={getCompactLabel("Pull Requests", "PRs")}
						/>
					}
				/>
				<Tab
					icon={tabIcons.teamwork}
					iconPosition="start"
					label={getCompactLabel("Team Work", "Team")}
					sx={getTabSx(4)}
				/>
				<Tab
					icon={tabIcons.bonus}
					iconPosition="start"
					label={getCompactLabel("Bonus Marks", "Bonus")}
					sx={getTabSx(5)}
				/>
			</Tabs>
		</Box>
	);
}

export default RepoTabBar;
