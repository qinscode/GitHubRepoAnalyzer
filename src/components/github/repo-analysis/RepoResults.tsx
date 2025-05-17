import { useState } from "react";
import { Box, Paper, Tabs, Tab } from "@mui/material";
import {
	Commit as CommitIcon,
	BugReport as IssueIcon,
	MergeType as PRIcon,
	Group as TeamIcon,
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
				className="!shadow-none ![--Paper-shadow:none]"
				elevation={0}
				sx={{ mb: 4 }}
			>
				<Tabs
					aria-label="repo analysis tabs"
					scrollButtons="auto"
					value={tabValue}
					variant="scrollable"
					onChange={handleTabChange}
				>
					<Tab
						icon={<Box sx={{ display: "flex" }}>📊</Box>}
						iconPosition="start"
						label="Summary"
					/>
					<Tab icon={<CommitIcon />} iconPosition="start" label="Commits" />
					<Tab icon={<IssueIcon />} iconPosition="start" label="Issues" />
					<Tab icon={<PRIcon />} iconPosition="start" label="Pull Requests" />
					<Tab icon={<TeamIcon />} iconPosition="start" label="Teamwork" />
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
