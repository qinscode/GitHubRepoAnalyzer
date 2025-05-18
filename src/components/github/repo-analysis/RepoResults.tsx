import { useState, useEffect } from "react";
import { 
	Box, 
	Paper, 
	Tabs, 
	Tab, 
	useTheme, 
	useMediaQuery, 
	alpha, 
	Fade,
	Grow
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
import SummaryTab from "./SummaryTab";
import CommitsTab from "./CommitsTab";
import IssuesTab from "./IssuesTab";
import PullRequestsTab from "./PullRequestsTab";
import TeamworkTab from "./TeamworkTab";

function RepoResults({ data }: RepoResultsProps): JSX.Element {
	const [tabValue, setTabValue] = useState(0);
	const [tabTransition, setTabTransition] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	
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
		prs: "#F59E0B",     // amber
		teamwork: "#EC4899", // pink
	};

	// Tab icons with customized colors
	const tabIcons = {
		summary: <SummaryIcon sx={{ fontSize: '1.25rem', color: colors.summary }} />,
		commits: <CommitIcon sx={{ fontSize: '1.25rem', color: colors.commits }} />,
		issues: <IssueIcon sx={{ fontSize: '1.25rem', color: colors.issues }} />,
		prs: <PRIcon sx={{ fontSize: '1.25rem', color: colors.prs }} />,
		teamwork: <TeamIcon sx={{ fontSize: '1.25rem', color: colors.teamwork }} />,
	};

	return (
		<Box sx={{ 
			position: 'relative',
			pt: 2,
			'&::before': {
				content: '""',
				position: 'absolute',
				top: -100,
				left: -150,
				width: 300,
				height: 300,
				background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)',
				borderRadius: '50%',
				zIndex: -1,
				animation: 'pulse 15s infinite alternate ease-in-out',
			},
			'&::after': {
				content: '""',
				position: 'absolute',
				bottom: -50,
				right: -100,
				width: 250,
				height: 250,
				background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, rgba(236, 72, 153, 0) 70%)',
				borderRadius: '50%',
				zIndex: -1,
				animation: 'pulse 12s infinite alternate-reverse ease-in-out',
			},
			'@keyframes pulse': {
				'0%': { opacity: 0.5, transform: 'scale(1)' },
				'100%': { opacity: 0.7, transform: 'scale(1.1)' },
			},
		}}>
			<Grow in timeout={800}>
				<Paper
					className="mb-6 rounded-xl overflow-hidden"
					elevation={2}
					sx={{ 
						background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))',
						backdropFilter: 'blur(8px)',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
						borderTop: '1px solid rgba(255, 255, 255, 0.5)',
						boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
						'&:hover': {
							transform: 'translateY(-2px)',
							boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
						}
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
									tabValue === 0 ? colors.summary :
									tabValue === 1 ? colors.commits :
									tabValue === 2 ? colors.issues :
									tabValue === 3 ? colors.prs :
									colors.teamwork
								} 30%, ${alpha(
									tabValue === 0 ? colors.summary :
									tabValue === 1 ? colors.commits :
									tabValue === 2 ? colors.issues :
									tabValue === 3 ? colors.prs :
									colors.teamwork, 0.7
								)} 100%)`,
								height: 3,
								borderRadius: '3px 3px 0 0',
								transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
							}
						}}
						sx={{
							minHeight: '60px',
							borderBottom: '1px solid rgba(0,0,0,0.04)',
							'& .MuiTab-root': {
								textTransform: 'none',
								fontSize: '0.95rem',
								fontWeight: 500,
								minHeight: '60px',
								color: 'rgba(75, 85, 99, 0.7)',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								position: 'relative',
								overflow: 'hidden',
								'&::after': {
									content: '""',
									position: 'absolute',
									bottom: 0,
									left: '50%',
									width: '0%',
									height: '100%',
									background: 'linear-gradient(to top, rgba(0, 0, 0, 0.01), transparent)',
									transition: 'all 0.3s ease',
									transform: 'translateX(-50%)',
									zIndex: -1,
									opacity: 0,
								},
								'&:hover': {
									color: 'rgba(75, 85, 99, 0.9)',
									backgroundColor: 'rgba(0, 0, 0, 0.01)',
									'&::after': {
										width: '100%',
										opacity: 1,
									}
								},
								'&.Mui-selected': {
									color: tabValue === 0 ? colors.summary :
										   tabValue === 1 ? colors.commits :
										   tabValue === 2 ? colors.issues :
										   tabValue === 3 ? colors.prs :
										   colors.teamwork,
									fontWeight: 600,
								},
								'& .MuiSvgIcon-root': {
									transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
									marginRight: '8px',
									opacity: 0.9,
								},
								'&:hover .MuiSvgIcon-root': {
									transform: 'translateY(-2px)',
									opacity: 1,
								}
							}
						}}
						onChange={handleTabChange}
					>
						<Tab
							icon={tabIcons.summary}
							iconPosition="start"
							label="Summary"
						/>
						<Tab 
							icon={tabIcons.commits}
							iconPosition="start" 
							label="Commits" 
						/>
						<Tab 
							icon={tabIcons.issues}
							iconPosition="start" 
							label="Issues" 
						/>
						<Tab 
							icon={tabIcons.prs} 
							iconPosition="start" 
							label="Pull Requests" 
						/>
						<Tab 
							icon={tabIcons.teamwork}
							iconPosition="start" 
							label="Teamwork" 
						/>
					</Tabs>
				</Paper>
			</Grow>

			<Fade in={tabTransition} timeout={400}>
				<Box sx={{ 
					position: 'relative', 
					minHeight: '300px',
				}}>
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
