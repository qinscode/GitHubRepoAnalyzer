import { useState, useEffect, useMemo, useCallback } from "react";
import {
	Box,
	Paper,
	Fade,
	Grow,
	useTheme,
	useMediaQuery,
	Typography,
} from "@mui/material";
import type { RepoResultsProps } from "@/types/github";
import TabPanel from "./TabPanel";
import SummaryTab from "@components/github/analysis/tabs/SummaryTab";
import CommitsTab from "@components/github/analysis/tabs/CommitsTab";
import IssuesTab from "@components/github/analysis/tabs/IssuesTab";
import PullRequestsTab from "@components/github/analysis/tabs/PullRequestsTab";
import TeamworkTab from "@components/github/analysis/tabs/TeamworkTab";
import BonusMarksTab from "@components/github/analysis/tabs/BonusMarksTab";
import RepoTabBar from "./RepoTabBar";
import RepoResultsContainer from "./RepoResultsContainer";

function RepoResults({ data }: RepoResultsProps) {
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

	const handleKeyNavigation = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowRight") {
				// Move to next tab (with circular navigation)
				const nextTab = tabValue < 5 ? tabValue + 1 : 0;
				setTabTransition(false);
				setTimeout(() => {
					setTabValue(nextTab);
					setTabTransition(true);
				}, 150);
			} else if (event.key === "ArrowLeft") {
				// Move to previous tab (with circular navigation)
				const previousTab = tabValue > 0 ? tabValue - 1 : 5;
				setTabTransition(false);
				setTimeout(() => {
					setTabValue(previousTab);
					setTabTransition(true);
				}, 150);
			}
		},
		[tabValue]
	);

	useEffect(() => {
		setTabTransition(true);
	}, []);

	useEffect(() => {
		// Add keyboard event listener when component mounts
		window.addEventListener("keydown", handleKeyNavigation);
		// Remove event listener when component unmounts
		return () => {
			window.removeEventListener("keydown", handleKeyNavigation);
		};
	}, [handleKeyNavigation]);

	return (
		<RepoResultsContainer>
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
					}}
				>
					<RepoTabBar
						counts={counts}
						handleTabChange={handleTabChange}
						isMobile={isMobile}
						tabValue={tabValue}
					/>
				</Paper>
			</Grow>
			<Typography
				color="grey.600"
				variant="caption"
				sx={{
					display: "block",
					textAlign: "left",
					fontSize: "0.75rem",
					fontStyle: "italic",
				}}
			>
				Use left and right arrow keys to navigate between tabs
			</Typography>
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

					<TabPanel index={5} value={tabValue}>
						<BonusMarksTab data={data} />
					</TabPanel>
				</Box>
			</Fade>
		</RepoResultsContainer>
	);
}

export default RepoResults;
