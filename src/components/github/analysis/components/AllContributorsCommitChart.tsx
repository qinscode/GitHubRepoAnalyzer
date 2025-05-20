import { useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Customized,
} from "recharts";

// Define the structure of contributor stats to avoid type errors
interface ContributorStat {
	author: {
		login: string;
		id: number;
		type: string;
	};
	total: number;
	weeks: Array<{
		w: number; // Unix timestamp for start of week
		a: number; // Additions
		d: number; // Deletions
		c: number; // Commits
	}>;
}

interface AllContributorsCommitChartProps {
	contributorStats: Array<ContributorStat> | undefined;
	primaryColor: string;
	maxContributors?: number;
}

// Material Design-inspired colors for better visual distinction
const MATERIAL_COLORS = [
	"#3f51b5", // indigo
	"#f44336", // red
	"#009688", // teal
	"#ff9800", // orange
	"#9c27b0", // purple
	"#2196f3", // blue
	"#ff5722", // deep orange
	"#4caf50", // green
	"#673ab7", // deep purple
	"#03a9f4", // light blue
	"#e91e63", // pink
	"#8bc34a", // light green
];

// Line dash patterns for additional visual distinction
const DASH_PATTERNS = ["", "5 5", "3 3", "5 2 2 2", "8 3 2 3"];

/**
 * Component to display a timeline of all contributors' commit activity
 */
const AllContributorsCommitChart = ({
	contributorStats,
	primaryColor,
	maxContributors = 7, // Default to 7 max contributors
}: AllContributorsCommitChartProps) => {
	const theme = useTheme();
	// State to track which contributors are visible
	const [hiddenContributors, setHiddenContributors] = useState<Set<string>>(
		new Set()
	);
	// State to track which contributor is currently hovered/highlighted
	const [highlightedContributor, setHighlightedContributor] = useState<
		string | null
	>(null);

	// Helper function to format date from Unix timestamp (seconds)
	const formatWeekDate = (timestamp: number): string => {
		const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
		return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
	};

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

	const chartData = useMemo<Array<Record<string, number | string>>>(() => {
		// If no stats are available, return empty array
		if (limitedContributorStats.length === 0) {
			return [];
		}

		// Get all timestamps from all contributors
		const allTimestamps = new Set<number>();
		limitedContributorStats.forEach((contributor) => {
			contributor.weeks.forEach((week) => {
				allTimestamps.add(week.w);
			});
		});

		// Sort timestamps chronologically
		const sortedTimestamps = Array.from(allTimestamps).sort();

		// Get the 16 most recent weeks with activity
		const recentTimestamps = sortedTimestamps.slice(-16);

		// Create a map of contributors data - here we can safely assert login is non-null
		// because we've filtered for valid contributors above
		const contributorsData: Record<string, Record<number, number>> = {};
		const additionsData: Record<string, Record<number, number>> = {};
		const deletionsData: Record<string, Record<number, number>> = {};

		// Initialize data structure for each contributor
		limitedContributorStats.forEach((contributor) => {
			// With the type guard above, TypeScript should know login exists
			const login = contributor.author.login;

			// Explicitly create the nested objects
			contributorsData[login] = {};
			additionsData[login] = {};
			deletionsData[login] = {};

			// Initialize all timestamps with 0 commits
			recentTimestamps.forEach((timestamp) => {
				// Now this access is safe - using non-null assertion since we've filtered for valid contributors
				contributorsData[login]![timestamp] = 0;
				additionsData[login]![timestamp] = 0;
				deletionsData[login]![timestamp] = 0;
			});

			// Fill in actual commit counts
			contributor.weeks.forEach((week) => {
				if (recentTimestamps.includes(week.w)) {
					// Using non-null assertion since we've filtered for valid contributors
					contributorsData[login]![week.w] = week.c;
					additionsData[login]![week.w] = week.a;
					deletionsData[login]![week.w] = week.d;
				}
			});
		});

		// Format data for the chart
		return recentTimestamps.map((timestamp) => {
			// 使用更具体的类型
			const dataPoint: Record<string, number | string> = {
				name: formatWeekDate(timestamp),
				timestamp: timestamp, // 确保是number类型
			};

			// Add commit count for each contributor
			Object.entries(contributorsData).forEach(([user, data]) => {
				// 确保插入的是number类型
				dataPoint[user] = data[timestamp] || 0;
				dataPoint[`${user}_additions`] = additionsData[user]?.[timestamp] || 0;
				dataPoint[`${user}_deletions`] = deletionsData[user]?.[timestamp] || 0;
			});

			return dataPoint;
		});
	}, [limitedContributorStats]);

	// Generate unique colors for each contributor
	const contributorColors = useMemo(() => {
		if (limitedContributorStats.length === 0) return {};

		const colors: Record<string, string> = {};

		// Use Material Design colors first, then fall back to generated colors if needed
		limitedContributorStats.forEach((contributor, index) => {
			// TypeScript类型保护已经确保这里的login是string
			const login = contributor.author.login;
			if (index < MATERIAL_COLORS.length) {
				colors[login] = MATERIAL_COLORS[index] || primaryColor;
			} else {
				// Fall back to the original color generation logic
				const hue = (index * 137.5) % 360; // Golden angle approximation for better distribution
				colors[login] = `hsl(${hue}, 70%, 60%)`;
			}
		});

		return colors;
	}, [limitedContributorStats, primaryColor]);

	// Get dash pattern for each contributor
	const contributorDashPatterns = useMemo(() => {
		if (limitedContributorStats.length === 0) return {};

		const patterns: Record<string, string> = {};

		// 使用类型过滤器确保login是string
		limitedContributorStats.forEach((contributor, index) => {
			// TypeScript类型保护已经确保这里的login是string
			const login = contributor.author.login;
			patterns[login] = DASH_PATTERNS[index % DASH_PATTERNS.length] || "";
		});

		return patterns;
	}, [limitedContributorStats]);

	// Handle legend click to toggle visibility
	const handleLegendClick = (data: any) => {
		const { dataKey } = data;
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
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					flexDirection: "column",
					height: 200,
					justifyContent: "center",
					my: 2,
					width: "100%",
					background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
					borderRadius: 2,
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
					p: 3,
				}}
			>
				<Box
					component="div"
					sx={{
						mb: 2,
						fontSize: "2rem",
						color: theme.palette.text.secondary,
					}}
				>
					📊
				</Box>
				<Typography
					color="text.secondary"
					sx={{ fontWeight: 500 }}
					variant="body1"
				>
					No commit timeline data available
				</Typography>
				<Typography
					color="text.secondary"
					sx={{ mt: 1, opacity: 0.7 }}
					variant="body2"
				>
					Contribution data will appear here once commits are made
				</Typography>
			</Box>
		);
	}

	// Find the max commit count to set a better Y-axis
	const maxCommitCount = Math.max(
		...chartData.flatMap((point) => {
			const commitCounts: Array<number> = [];

			limitedContributorStats
				.filter((c) => !hiddenContributors.has(c.author.login))
				.forEach((c) => {
					const login = c.author.login;
					const value = point[login];
					if (typeof value === "number") {
						commitCounts.push(value);
					} else {
						commitCounts.push(0); // 默认值
					}
				});

			return commitCounts;
		})
	);

	// Add a 20% buffer to the max commit count
	const yAxisMax = Math.ceil(maxCommitCount * 1.2);

	return (
		<Box
			sx={{
				height: 350,
				my: 2,
				width: "100%",
				background: `linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)`,
				borderRadius: 2,
				p: 2,
				boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
			}}
		>
			<ResponsiveContainer height="100%" width="100%">
				<LineChart
					data={chartData}
					margin={{ bottom: 20, left: 0, right: 20, top: 15 }}
					onMouseLeave={handleLineMouseLeave}
				>
					<defs>
						{limitedContributorStats.map((contributor) => (
							<linearGradient
								key={`gradient-${contributor.author.login}`}
								id={`colorGradient-${contributor.author.login}`}
								x1="0"
								x2="0"
								y1="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor={contributorColors[contributor.author.login]}
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor={contributorColors[contributor.author.login]}
									stopOpacity={0.1}
								/>
							</linearGradient>
						))}
					</defs>

					<CartesianGrid opacity={0.08} strokeDasharray="3 3" />

					<XAxis
						angle={-45}
						dataKey="name"
						height={50}
						textAnchor="end"
						tick={{ fill: "rgba(55, 65, 81, 0.8)", fontSize: 12 }}
						tickMargin={8}
					/>

					<YAxis
						allowDecimals={false}
						domain={[0, yAxisMax]}
						tick={{ fill: "rgba(55, 65, 81, 0.8)", fontSize: 12 }}
						label={{
							angle: -90,
							position: "insideLeft",
							style: {
								fill: "rgba(55, 65, 81, 0.8)",
								fontSize: 12,
								textAnchor: "middle",
							},
							value: "Commits",
						}}
					/>

					<Tooltip
						animationDuration={300}
						labelFormatter={(label: string) => `Week of ${label}`}
						contentStyle={{
							backgroundColor: "rgba(255, 255, 255, 0.35)",
							border: "none",
							borderRadius: "8px",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
							padding: "10px 14px",
							backdropFilter: "blur(6px)",
						}}
						formatter={(value: number, _name: string, entry: any) => {
							const dataKey = entry.dataKey;
							// Check if this is a regular contributor line
							if (
								!dataKey.includes("_additions") &&
								!dataKey.includes("_deletions")
							) {
								const additions = entry.payload[`${dataKey}_additions`] || 0;
								const deletions = entry.payload[`${dataKey}_deletions`] || 0;
								return [
									<div style={{ padding: "2px 0", fontSize: "0.8rem" }}>
										<div style={{ fontWeight: "bold" }}>
											<span style={{ fontSize: "0.75rem" }}>{dataKey}</span>:{" "}
											{value} Commits
										</div>
										<div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
											+{additions} / -{deletions} lines
										</div>
									</div>,
									<span
										style={{
											color: contributorColors[dataKey],
											fontWeight: "bold",
											display: "flex",
											alignItems: "center",
											fontSize: "0.75rem",
										}}
									>
										<span
											style={{
												display: "inline-block",
												width: "8px",
												height: "8px",
												borderRadius: "50%",
												backgroundColor: contributorColors[dataKey],
												marginRight: "5px",
											}}
										></span>
										{dataKey}
									</span>,
								];
							}
							return ["", ""];
						}}
					/>

					<Legend
						layout="horizontal"
						verticalAlign="bottom"
						wrapperStyle={{ paddingTop: "15px" }}
						formatter={(value, _entry) => {
							const isHidden = hiddenContributors.has(value);
							return (
								<span
									style={{
										color: isHidden
											? "rgba(55, 65, 81, 0.4)"
											: "rgba(55, 65, 81, 0.8)",
										textDecoration: isHidden ? "line-through" : "none",
										cursor: "pointer",
										fontWeight:
											highlightedContributor === value ? "bold" : "normal",
									}}
								>
									{value}
								</span>
							);
						}}
						onClick={handleLegendClick}
					/>

					{limitedContributorStats.map((contributor, _index) => {
						const login = contributor.author.login;
						const color = contributorColors[login] || primaryColor;
						const dashPattern = contributorDashPatterns[login];
						const isHighlighted = highlightedContributor === login;
						const isHidden = hiddenContributors.has(login);

						if (isHidden) return null;

						return (
							<Line
								key={login}
								connectNulls
								animationDuration={1000}
								dataKey={login}
								name={login}
								stroke={color}
								strokeDasharray={dashPattern}
								strokeWidth={isHighlighted ? 3 : 1.5}
								type="monotone"
								activeDot={{
									r: 6,
									stroke: color,
									strokeWidth: 2,
									fill: "white",
								}}
								dot={{
									r: isHighlighted ? 4 : 3,
									fill: color,
									strokeWidth: 0,
								}}
								strokeOpacity={
									highlightedContributor && !isHighlighted ? 0.3 : 1
								}
								onMouseLeave={handleLineMouseLeave}
								onMouseEnter={() => {
									handleLineMouseEnter(login);
								}}
							/>
						);
					})}

					{limitedContributorStats.map((contributor, _index) => {
						const login = contributor.author.login;
						const isHidden = hiddenContributors.has(login);

						if (isHidden) return null;

						return (
							<Customized
								key={`area-${login}`}
								component={(props: any) => {
									// Don't render the area if this contributor is not highlighted
									if (
										highlightedContributor &&
										highlightedContributor !== login
									) {
										return null;
									}

									// Get the points for this contributor's line
									const { points } = props;
									if (!points || points.length === 0) return null;

									// Create an area path under the line
									const firstPoint = points[0];
									const lastPoint = points[points.length - 1];

									const d = [
										// Start at the first point
										`M ${firstPoint.x},${firstPoint.y}`,
										// Add all line segments
										...points
											.slice(1)
											.map((point: any) => `L ${point.x},${point.y}`),
										// Go down to the bottom
										`L ${lastPoint.x},${props.yAxis.y}`,
										// Go left to the left edge
										`L ${firstPoint.x},${props.yAxis.y}`,
										// Close the path
										"Z",
									].join(" ");

									return (
										<path
											d={d}
											fill={`url(#colorGradient-${login})`}
											opacity={0.1}
											stroke="none"
										/>
									);
								}}
							/>
						);
					})}
				</LineChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default AllContributorsCommitChart;
