import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
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
}

/**
 * Component to display a timeline of all contributors' commit activity
 */
const AllContributorsCommitChart = ({
	contributorStats,
	primaryColor,
}: AllContributorsCommitChartProps) => {
	// Helper function to format date from Unix timestamp (seconds)
	const formatWeekDate = (timestamp: number): string => {
		const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
		return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
	};

	const chartData = useMemo(() => {
		// If no stats are available, return empty array
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

		// If we have no valid contributors, return empty array
		if (validContributors.length === 0) {
			return [];
		}

		// Get all timestamps from all contributors
		const allTimestamps = new Set<number>();
		validContributors.forEach((contributor) => {
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

		// Initialize data structure for each contributor
		validContributors.forEach((contributor) => {
			// With the type guard above, TypeScript should know login exists
			const login = contributor.author.login;

			// Explicitly create the nested object
			contributorsData[login] = {};

			// Initialize all timestamps with 0 commits
			recentTimestamps.forEach((timestamp) => {
				// Now this access is safe - using non-null assertion since we've filtered for valid contributors
				contributorsData[login]![timestamp] = 0;
			});

			// Fill in actual commit counts
			contributor.weeks.forEach((week) => {
				if (recentTimestamps.includes(week.w)) {
					// Using non-null assertion since we've filtered for valid contributors
					contributorsData[login]![week.w] = week.c;
				}
			});
		});

		// Format data for the chart
		return recentTimestamps.map((timestamp) => {
			const dataPoint: Record<string, any> = {
				name: formatWeekDate(timestamp),
				timestamp,
			};

			// Add commit count for each contributor
			Object.entries(contributorsData).forEach(([user, data]) => {
				dataPoint[user] = data[timestamp];
			});

			return dataPoint;
		});
	}, [contributorStats]);

	// Generate unique colors for each contributor
	const contributorColors = useMemo(() => {
		if (!contributorStats) return {};

		// Filter out contributors without proper data
		const validContributors = contributorStats.filter(
			(contrib): contrib is ContributorStat & { author: { login: string } } =>
				Boolean(contrib && contrib.author && contrib.author.login)
		);

		const colors: Record<string, string> = {};
		const baseColor = primaryColor;

		// Color generation helper
		const generateColor = (index: number, total: number): string => {
			// Convert base color to HSL
			const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
				const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
				const fullHex = hex.replace(
					shorthandRegex,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					(_m, r, g, b) => r + r + g + g + b + b
				);
				const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
					fullHex
				);

				if (result && result[1] && result[2] && result[3]) {
					return {
						r: parseInt(result[1], 16),
						g: parseInt(result[2], 16),
						b: parseInt(result[3], 16),
					};
				}

				return { r: 0, g: 0, b: 0 };
			};

			const rgbToHsl = (
				r: number,
				g: number,
				b: number
			): { h: number; s: number; l: number } => {
				r /= 255;
				g /= 255;
				b /= 255;
				const max = Math.max(r, g, b);
				const min = Math.min(r, g, b);
				let h = 0;
				let s = 0;
				const l = (max + min) / 2;

				if (max !== min) {
					const d = max - min;
					s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
					switch (max) {
						case r:
							h = (g - b) / d + (g < b ? 6 : 0);
							break;
						case g:
							h = (b - r) / d + 2;
							break;
						case b:
							h = (r - g) / d + 4;
							break;
					}
					h /= 6;
				}

				return { h: h * 360, s: s * 100, l: l * 100 };
			};

			const hslToRgb = (
				h: number,
				s: number,
				l: number
			): { r: number; g: number; b: number } => {
				h /= 360;
				s /= 100;
				l /= 100;
				let r: number, g: number, b: number;

				if (s === 0) {
					r = g = b = l;
				} else {
					const hueToRgb = (p: number, q: number, t: number): number => {
						if (t < 0) t += 1;
						if (t > 1) t -= 1;
						if (t < 1 / 6) return p + (q - p) * 6 * t;
						if (t < 1 / 2) return q;
						if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
						return p;
					};

					const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
					const p = 2 * l - q;
					r = hueToRgb(p, q, h + 1 / 3);
					g = hueToRgb(p, q, h);
					b = hueToRgb(p, q, h - 1 / 3);
				}

				return {
					r: Math.round(r * 255),
					g: Math.round(g * 255),
					b: Math.round(b * 255),
				};
			};

			const rgbToHex = (r: number, g: number, b: number): string => {
				return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
			};

			// Get base color in HSL
			const rgb = hexToRgb(baseColor);
			const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

			// Distribute colors evenly around the hue circle
			const newHue = (hsl.h + (index * 360) / total) % 360;
			// Vary saturation and lightness slightly
			const newSat = Math.min(Math.max(hsl.s + (index % 3) * 5 - 5, 40), 90);
			const newLight = Math.min(Math.max(hsl.l + (index % 2) * 10 - 5, 30), 70);

			const newRgb = hslToRgb(newHue, newSat, newLight);
			return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
		};

		// Generate a color for each valid contributor
		validContributors.forEach((contributor, index) => {
			colors[contributor.author.login] = generateColor(
				index,
				validContributors.length
			);
		});

		return colors;
	}, [contributorStats, primaryColor]);

	// If no data available, show a message
	if (
		chartData.length === 0 ||
		!contributorStats ||
		contributorStats.length === 0
	) {
		return (
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					flexDirection: "column",
					height: 120,
					justifyContent: "center",
					my: 2,
					width: "100%",
				}}
			>
				<Typography color="text.secondary" variant="body2">
					No commit timeline data available for this repository.
				</Typography>
			</Box>
		);
	}

	// Filter out contributors without proper data
	const validContributors = contributorStats.filter(
		(contrib): contrib is ContributorStat & { author: { login: string } } =>
			Boolean(contrib && contrib.author && contrib.author.login)
	);

	return (
		<Box sx={{ height: 350, my: 2, width: "100%" }}>
			<ResponsiveContainer height="100%" width="100%">
				<LineChart
					data={chartData}
					margin={{ bottom: 5, left: 0, right: 30, top: 5 }}
				>
					<CartesianGrid opacity={0.15} strokeDasharray="3 3" />
					<XAxis
						dataKey="name"
						tick={{ fill: "rgba(55, 65, 81, 0.8)", fontSize: 12 }}
					/>
					<YAxis
						allowDecimals={false}
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
						labelFormatter={(label: string) => `Week of ${label}`}
						contentStyle={{
							backgroundColor: "rgba(255, 255, 255, 0.95)",
							border: "none",
							borderRadius: "8px",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
						formatter={(value: number, name: string) => [
							`${value} Commits`,
							name,
						]}
					/>
					<Legend
						layout="horizontal"
						verticalAlign="bottom"
						wrapperStyle={{ paddingTop: "10px" }}
					/>
					{validContributors.map((contributor) => (
						<Line
							key={contributor.author.login}
							activeDot={{ r: 5 }}
							dataKey={contributor.author.login}
							dot={{ r: 3 }}
							name={contributor.author.login}
							strokeWidth={2}
							type="monotone"
							stroke={
								contributorColors[contributor.author.login] || primaryColor
							}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default AllContributorsCommitChart;
