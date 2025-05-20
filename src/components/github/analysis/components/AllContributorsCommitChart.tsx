import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { ContributorStat } from "./chart-types";
import NoDataDisplay from "./NoDataDisplay";
import ChartTip from "./ChartTip";
import CommitLineChart from "./CommitLineChart";
import {
	prepareChartData,
	generateContributorColors,
	generateContributorDashPatterns,
	calculateYAxisMax,
} from "../utils/chart-utils";

interface AllContributorsCommitChartProps {
	contributorStats: Array<ContributorStat> | undefined;
	primaryColor: string;
	maxContributors?: number;
}

/**
 * Component to display a timeline of all contributors' commit activity
 */
const AllContributorsCommitChart = ({
	contributorStats,
	primaryColor,
	maxContributors = 7, // Default to 7 max contributors
}: AllContributorsCommitChartProps) => {
	// State to track which contributors are visible
	const [hiddenContributors, setHiddenContributors] = useState<Set<string>>(
		new Set()
	);
	// State to track which contributor is currently hovered/highlighted
	const [highlightedContributor, setHighlightedContributor] = useState<
		string | null
	>(null);

	// Limit the number of contributors to display
	const limitedContributorStats = useMemo(() => {
		if (!contributorStats || contributorStats.length === 0) {
			return [];
		}

		// Filter out any contributors with missing data and ensure login is defined
		const validContributors = contributorStats.filter(
			(contrib): contrib is ContributorStat & { author: { login: string } } =>
				Boolean(
					contrib && contrib.author && contrib.author.login && contrib.weeks
				)
		);

		// Sort contributors by total commits (most active first)
		const sortedContributors = [...validContributors].sort(
			(a, b) => b.total - a.total
		);

		// Limit to the maximum number of contributors
		return sortedContributors.slice(0, maxContributors);
	}, [contributorStats, maxContributors]);

	// Prepare chart data from contributor stats
	const chartData = useMemo(() => {
		return prepareChartData(limitedContributorStats);
	}, [limitedContributorStats]);

	// Generate unique colors for each contributor
	const contributorColors = useMemo(() => {
		return generateContributorColors(limitedContributorStats, primaryColor);
	}, [limitedContributorStats, primaryColor]);

	// Get dash pattern for each contributor
	const contributorDashPatterns = useMemo(() => {
		return generateContributorDashPatterns(limitedContributorStats);
	}, [limitedContributorStats]);

	// Handle legend click to toggle visibility
	const handleLegendClick = (dataKey: string) => {
		setHiddenContributors((previousHidden) => {
			const newHidden = new Set(previousHidden);
			if (newHidden.has(dataKey)) {
				newHidden.delete(dataKey);
			} else {
				newHidden.add(dataKey);
			}
			return newHidden;
		});
	};

	// Handle mouse enter/leave for highlighting
	const handleLineMouseEnter = (dataKey: string) => {
		setHighlightedContributor(dataKey);
	};

	const handleLineMouseLeave = () => {
		setHighlightedContributor(null);
	};

	// If no data available, show a message with a nice illustration
	if (chartData.length === 0 || limitedContributorStats.length === 0) {
		return (
			<NoDataDisplay
				message="Contribution data will appear here once commits are made"
				title="No commit timeline data available"
			/>
		);
	}

	// Calculate the max Y-axis value based on visible contributors
	const yAxisMax = calculateYAxisMax(
		chartData,
		limitedContributorStats,
		hiddenContributors
	);

	return (
		<Box
			sx={{
				my: 2,
				width: "100%",
				background: `linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)`,
				borderRadius: 2,
				p: 2,
				boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
			}}
		>
			<Box sx={{ height: 350 }}>
				<CommitLineChart
					chartData={chartData}
					contributorColors={contributorColors}
					contributorDashPatterns={contributorDashPatterns}
					contributorStats={limitedContributorStats}
					hiddenContributors={hiddenContributors}
					highlightedContributor={highlightedContributor}
					yAxisMax={yAxisMax}
					onLegendClick={handleLegendClick}
					onLineMouseEnter={handleLineMouseEnter}
					onLineMouseLeave={handleLineMouseLeave}
				/>
			</Box>
			<ChartTip text="Tips: Click on the legend to hide contributor. Hover over lines for details." />
		</Box>
	);
};

export default AllContributorsCommitChart;
