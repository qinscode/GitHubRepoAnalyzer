import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";

interface CommitBarChartProps {
	color: string;
	user: string;
	contributorStats: Array<any> | undefined;
}

/**
 * Component to display commit frequency chart
 */
const CommitBarChart = ({
	color,
	user,
	contributorStats,
}: CommitBarChartProps) => {
	// Helper function to format date from Unix timestamp (seconds)
	const formatWeekDate = (timestamp: number): string => {
		const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
		return `Week of ${date.getDate()} ${date.toLocaleString("default", { month: "short" })}, ${date.getFullYear()}`;
	};

	const weeklyData = useMemo(() => {
		// If no stats are available, return empty array
		if (!contributorStats || contributorStats.length === 0) {
			return [];
		}

		// Find stats for this contributor (by login name)
		const stats = contributorStats.find(
			(stat) => stat.author?.login?.toLowerCase() === user.toLowerCase()
		);

		// If no stats found for this contributor, return empty array
		if (!stats || !stats.weeks) {
			return [];
		}

		// Get the 10 most recent weeks with activity
		const activeWeeks = [...stats.weeks]
			.filter((week) => week.c > 0) // Only weeks with commits
			.slice(-10); // Most recent 10 weeks

		return activeWeeks
			.map((week) => ({
				name: formatWeekDate(week.w),
				commits: week.c,
				timestamp: week.w,
			}))
			.sort((a, b) => a.timestamp - b.timestamp);
	}, [user, contributorStats]);

	// If no weekly data available, show a message
	if (weeklyData.length === 0) {
		return (
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					flexDirection: "column",
					height: 100,
					justifyContent: "center",
					mt: 2,
					mb: 3,
					width: "100%",
				}}
			>
				<Typography color="text.secondary" variant="body2">
					No weekly commit data available for this contributor.
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ height: 250, mt: 2, mb: 3, width: "100%" }}>
			<ResponsiveContainer height="100%" width="100%">
				<BarChart
					data={weeklyData}
					margin={{ bottom: 5, left: 20, right: 30, top: 5 }}
				>
					<CartesianGrid opacity={0.15} strokeDasharray="3 3" />
					<XAxis
						dataKey="name"
						tick={{ fill: "rgba(55, 65, 81, 0.8)", fontSize: 12 }}
					/>
					<YAxis
						allowDecimals={false}
						tick={{ fill: "rgba(55, 65, 81, 0.8)", fontSize: 12 }}
					/>
					<Tooltip
						formatter={(value: number) => [`${value} Commits`, "Commits"]}
						labelFormatter={(label: string) => label}
						contentStyle={{
							backgroundColor: "rgba(255, 255, 255, 0.95)",
							border: "none",
							borderRadius: "8px",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
					/>
					<Legend wrapperStyle={{ paddingTop: "10px" }} />
					<Bar
						barSize={35}
						dataKey="commits"
						fill={color}
						name="Commits"
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default CommitBarChart;
