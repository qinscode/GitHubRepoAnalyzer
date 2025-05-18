import React, { useMemo } from "react";
import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Avatar,
	Chip,
	Fade,
	Grow,
} from "@mui/material";
import {
	ExpandMore as ExpandMoreIcon,
	Commit as CommitIcon,
	BarChart as BarChartIcon,
} from "@mui/icons-material";
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
import type { RepoData } from "../../types/types.ts";
import DataTable from "../../utils/DataTable";

interface CommitsTabProps {
	data: RepoData;
}

// Helper function to format date from Unix timestamp (seconds)
const formatWeekDate = (timestamp: number): string => {
	const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
	return `Week of ${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}, ${date.getFullYear()}`;
};

// Component to display commit frequency chart
function CommitBarChart({
	color,
	user,
	contributorStats,
}: {
	color: string;
	user: string;
	contributorStats: Array<any> | undefined;
}): JSX.Element {
	const weeklyData = useMemo(() => {
		// If no stats are available, return empty array
		if (!contributorStats || contributorStats.length === 0) {
			return [];
		}
		
		// Find stats for this contributor (by login name)
		const stats = contributorStats.find(
			stat => stat.author?.login?.toLowerCase() === user.toLowerCase()
		);
		
		// If no stats found for this contributor, return empty array
		if (!stats || !stats.weeks) {
			return [];
		}
		
		// Get the 10 most recent weeks with activity
		const activeWeeks = [...stats.weeks]
			.filter(week => week.c > 0) // Only weeks with commits
			.slice(-10); // Most recent 10 weeks
		
		return activeWeeks.map(week => ({
			name: formatWeekDate(week.w),
			commits: week.c,
			timestamp: week.w,
		})).sort((a, b) => a.timestamp - b.timestamp);
	}, [user, contributorStats]);
	
	// If no weekly data available, show a message
	if (weeklyData.length === 0) {
		return (
			<Box sx={{ 
				alignItems: 'center',
				display: 'flex', 
				flexDirection: 'column',
				height: 100,
				justifyContent: 'center',
				mt: 2, 
				mb: 3,
				width: '100%' 
			}}>
				<Typography color="text.secondary" variant="body2">
					No weekly commit data available for this contributor.
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ height: 250, mt: 2, mb: 3, width: '100%' }}>
			<ResponsiveContainer height="100%" width="100%">
				<BarChart
					data={weeklyData}
					margin={{ bottom: 5, left: 20, right: 30, top: 5 }}
				>
					<CartesianGrid opacity={0.15} strokeDasharray="3 3" />
					<XAxis 
						dataKey="name" 
						tick={{ fill: 'rgba(55, 65, 81, 0.8)', fontSize: 12 }}
					/>
					<YAxis 
						allowDecimals={false}
						tick={{ fill: 'rgba(55, 65, 81, 0.8)', fontSize: 12 }}
					/>
					<Tooltip
						formatter={(value: number) => [`${value} Commits`, 'Commits']}
						labelFormatter={(label: string) => label}
						contentStyle={{
							backgroundColor: 'rgba(255, 255, 255, 0.95)',
							border: 'none',
							borderRadius: '8px',
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
						}}
					/>
					<Legend wrapperStyle={{ paddingTop: '10px' }} />
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
}

function UserCommits({
	commits,
	index,
	user,
	contributorStats,
}: {
	commits: Array<{ message: string; id: string; commitDate: string }>;
	index: number;
	user: string;
	contributorStats?: Array<any>;
}): JSX.Element {
	const [expanded, setExpanded] = React.useState(false);

	const handleChange = (): void => {
		setExpanded(!expanded);
	};

	// Define colors for the component
	const colors = {
		main: "#10B981", // green
		light: "rgba(16, 185, 129, 0.1)",
		lighter: "rgba(16, 185, 129, 0.05)",
		gradient: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
	};

	// Format date from ISO string to DD/MM/YYYY HH:MM format
	const formatCommitDate = (dateString: string): string => {
		if (!dateString) return "No date";
		
		try {
			const date = new Date(dateString);
			const day = date.getDate().toString().padStart(2, '0');
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const year = date.getFullYear();
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			
			return `${day}/${month}/${year} ${hours}:${minutes}`;
		} catch (error) {
			console.error('Date formatting error:', error);
			return "18/05/2025 14:30"; // Default date format matching other tabs
		}
	};

	// Prepare data for DataTable component
	const tableData = commits.map((commit, index_) => ({
		number: index_ + 1,
		message: commit.message,
		date: formatCommitDate(commit.commitDate),
		id: commit.id || `commit-${index_}`
	}));

	// Define columns for DataTable
	const columns = [
		{ id: 'number', label: '#', width: '8%' },
		{ id: 'message', label: 'Commit Message', width: '55%' },
		{ id: 'date', label: 'Date', width: '15%' }
	];

	return (
		<Grow in timeout={800 + index * 150}>
			<Accordion
				expanded={expanded}
				sx={{
					mb: 2.5,
					borderRadius: "12px !important",
					overflow: "hidden",
					boxShadow: expanded
						? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
						: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
					border: "1px solid rgba(255, 255, 255, 0.7)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					background:
						"linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
					backdropFilter: "blur(8px)",
					"&:before": {
						display: "none",
					},
					"&:hover": {
						boxShadow:
							"0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)",
					},
				}}
				onChange={handleChange}
			>
				<AccordionSummary
					expandIcon={
						<ExpandMoreIcon
							sx={{
								color: colors.main,
								transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
								transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
							}}
						/>
					}
					sx={{
						background: expanded
							? `linear-gradient(to right, ${colors.lighter}, rgba(249, 250, 251, 0.8))`
							: "transparent",
						borderLeft: `4px solid ${colors.main}`,
						transition: "all 0.3s ease",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							width: "100%",
							justifyContent: "space-between",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Avatar
								sx={{
									width: 36,
									height: 36,
									mr: 2,
									background: colors.gradient,
									fontSize: "0.9rem",
									boxShadow: `0 2px 5px ${colors.main}40`,
								}}
							>
								{user.charAt(0).toUpperCase()}
							</Avatar>
							<Typography
								variant="subtitle1"
								sx={{
									fontWeight: 600,
									color: "rgba(55, 65, 81, 0.9)",
								}}
							>
								{user}
							</Typography>
						</Box>
						<Chip
							icon={<CommitIcon style={{ fontSize: "0.9rem" }} />}
							label={`${commits.length} commits`}
							size="small"
							sx={{
								ml: 2,
								background: colors.gradient,
								color: "white",
								fontWeight: 500,
								boxShadow: "0 2px 5px rgba(16, 185, 129, 0.2)",
								"& .MuiChip-icon": {
									color: "white",
								},
							}}
						/>
					</Box>
				</AccordionSummary>
				<AccordionDetails sx={{ p: 0 }}>
					<Fade in={expanded} timeout={500}>
						<Box>
							{/* Commit Frequency Chart */}
							<Box sx={{ 
								px: 3, 
								pt: 3, 
								borderBottom: '1px solid rgba(0,0,0,0.04)',
								background: 'rgba(249, 250, 251, 0.5)'
							}}>
								<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
									<BarChartIcon sx={{ color: colors.main, mr: 1, fontSize: '1.1rem' }} />
									<Typography sx={{ color: 'rgba(55, 65, 81, 0.9)', fontWeight: 600 }} variant="subtitle2">
										Weekly Commit Frequency
									</Typography>
								</Box>
								<CommitBarChart 
									color={colors.main} 
									contributorStats={contributorStats}
									user={user} 
								/>
							</Box>
							
							{/* Commit List Table - Using reusable DataTable component */}
							<Box sx={{ position: 'relative', overflow: 'auto' }}>
								<DataTable 
									columns={columns}
									data={tableData}
									emptyMessage="No commits available for this contributor."
									getRowKey={(row): string => row.id as string}
									lightColor={colors.light}
									lighterColor={colors.lighter}
									primaryColor={colors.main}
								/>
							</Box>
						</Box>
					</Fade>
				</AccordionDetails>
			</Accordion>
		</Grow>
	);
}

function CommitsTab({ data }: CommitsTabProps): JSX.Element {
	// Transform commits data for display
	const commitsByUser = useMemo(() => {
		type Commit = { message: string; id: string; commitDate: string };
		const users: Record<string, Array<Commit>> = {};

		Object.entries(data.commits).forEach(([user, commits]) => {
			users[user] = commits;
		});

		return Object.entries(users).sort(
			([, commitsA], [, commitsB]) => commitsB.length - commitsA.length
		);
	}, [data.commits]);

	return (
		<Fade in timeout={500}>
			<Box
				sx={{
					position: "relative",
					animation: "fadeIn 0.5s ease-out forwards",
					opacity: 0,
					"@keyframes fadeIn": {
						"0%": { opacity: 0 },
						"100%": { opacity: 1 },
					},
				}}
			>
				<Box
					className="shine-effect"
					sx={{
						p: 2,
						mb: 4,
						borderRadius: "14px",
						background:
							"linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.04))",
						border: "1px solid rgba(16, 185, 129, 0.15)",
						boxShadow:
							"0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
						position: "relative",
						overflow: "hidden",
						"&::before": {
							content: '""',
							position: "absolute",
							top: -30,
							right: -30,
							width: 120,
							height: 120,
							borderRadius: "50%",
							background:
								"radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)",
							zIndex: 0,
						},
					}}
				>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 600,
							color: "#065F46",
							mb: 1,
							position: "relative",
							zIndex: 1,
						}}
					>
						Commit Activity Analysis
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: "rgba(107, 114, 128, 0.9)",
							position: "relative",
							zIndex: 1,
						}}
					>
						This analysis shows commit activity by contributor, with detailed
						commit messages and weekly statistics.
					</Typography>
				</Box>

				<Box sx={{ mb: 2 }}>
					<Typography
						sx={{
							fontSize: "1.15rem",
							fontWeight: 600,
							color: "#065F46",
							mb: 2.5,
							position: "relative",
							paddingLeft: "16px",
							display: "inline-block",
							transition: "transform 0.2s ease",
							"&:hover": {
								transform: "translateX(2px)",
							},
							"&::before": {
								content: '""',
								position: "absolute",
								left: 0,
								top: "50%",
								transform: "translateY(-50%)",
								width: "4px",
								height: "18px",
								borderRadius: "2px",
								background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
							},
							"&::after": {
								content: '""',
								position: "absolute",
								bottom: -5,
								left: 16,
								width: "40%",
								height: "2px",
								background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
								transition: "width 0.3s ease",
							},
							"&:hover::after": {
								width: "80%",
							},
						}}
					>
						Commits by Contributor
					</Typography>
				</Box>

				{commitsByUser.length === 0 ? (
					<Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
						<Typography>
							No commit data available for this repository.
						</Typography>
					</Box>
				) : (
					commitsByUser.map(([user, commits], index) => (
						<UserCommits
							key={user}
							commits={commits}
							contributorStats={data.contributorStats}
							index={index}
							user={user}
						/>
					))
				)}

				<Box
					sx={{
						mt: 4,
						p: 2,
						borderRadius: "12px",
						border: "1px dashed rgba(16, 185, 129, 0.3)",
						backgroundColor: "rgba(16, 185, 129, 0.03)",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1.5,
						}}
					>
						<CommitIcon sx={{ color: "#10B981", fontSize: "1.1rem" }} />
						<Typography
							sx={{ color: "#065F46", fontWeight: 500 }}
							variant="body2"
						>
							Total Commits: {Object.values(data.commits).flat().length}
						</Typography>
					</Box>
					<Typography
						variant="caption"
						sx={{
							display: "block",
							ml: 3.5,
							mt: 0.5,
							color: "text.secondary",
							opacity: 0.8,
						}}
					>
						From {Object.keys(data.commits).length} contributors
					</Typography>
				</Box>
			</Box>
		</Fade>
	);
}

export default CommitsTab;
