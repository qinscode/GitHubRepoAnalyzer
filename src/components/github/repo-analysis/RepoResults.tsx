import { useState } from "react";
import { Box, Paper, Tabs, Tab } from "@mui/material";
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

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: number
	): void => {
		setTabValue(newValue);
	};

	return (
		<Box>
			<Paper
				className="mb-5 rounded-md overflow-hidden"
				variant="outlined"
				sx={{ 
					boxShadow: 'none',
					borderColor: 'rgba(0,0,0,0.06)'
				}}
			>
				<Tabs
					aria-label="repo analysis tabs"
					scrollButtons="auto"
					value={tabValue}
					variant="scrollable"
					TabIndicatorProps={{
						sx: {
							backgroundColor: '#3b82f6',
							height: 3,
							borderRadius: '3px 3px 0 0',
						}
					}}
					sx={{
						'& .MuiTab-root': {
							textTransform: 'none',
							fontSize: '0.95rem',
							fontWeight: 500,
							minHeight: '48px',
							color: 'rgba(75, 85, 99, 0.9)',
							'&.Mui-selected': {
								color: '#3b82f6',
								fontWeight: 600,
							}
						}
					}}
					onChange={handleTabChange}
				>
					<Tab
						icon={<SummaryIcon sx={{ fontSize: '1.1rem' }} />}
						iconPosition="start"
						label="Summary"
					/>
					<Tab 
						icon={<CommitIcon sx={{ fontSize: '1.1rem' }} />} 
						iconPosition="start" 
						label="Commits" 
					/>
					<Tab 
						icon={<IssueIcon sx={{ fontSize: '1.1rem' }} />} 
						iconPosition="start" 
						label="Issues" 
					/>
					<Tab 
						icon={<PRIcon sx={{ fontSize: '1.1rem' }} />} 
						iconPosition="start" 
						label="Pull Requests" 
					/>
					<Tab 
						icon={<TeamIcon sx={{ fontSize: '1.1rem' }} />} 
						iconPosition="start" 
						label="Teamwork" 
					/>
				</Tabs>
			</Paper>

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
	);
}

export default RepoResults;
