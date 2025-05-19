import { useMemo } from "react";
import {
	Box,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Avatar,
	LinearProgress,
} from "@mui/material";
import { RepoData } from "@/services/github/types";
import { ContributorStats } from "@/types/github";

interface SummaryTabProps {
	data: RepoData;
}

interface ColorMap {
	main: string;
	light: string;
	lighter: string;
	gradient: string;
}

interface ContributionTableProps {
	title: string;
	data: Array<ContributorStats>;
	color: "primary" | "secondary" | "info";
}

const ContributionTable: React.FC<ContributionTableProps> = ({ title, data, color }) => {
	const colorMap: Record<"primary" | "secondary" | "info", ColorMap> = {
		primary: {
			main: "#3B82F6",
			light: "rgba(59, 130, 246, 0.1)",
			lighter: "rgba(59, 130, 246, 0.05)",
			gradient: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)",
		},
		secondary: {
			main: "#8B5CF6",
			light: "rgba(139, 92, 246, 0.1)",
			lighter: "rgba(139, 92, 246, 0.05)",
			gradient: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
		},
		info: {
			main: "#0EA5E9",
			light: "rgba(14, 165, 233, 0.1)",
			lighter: "rgba(14, 165, 233, 0.05)",
			gradient: "linear-gradient(90deg, #0EA5E9 0%, #38BDF8 100%)",
		},
	};

	const bgHoverClass =
		color === "primary"
			? "hover:bg-blue-50/50"
			: color === "secondary"
				? "hover:bg-purple-50/50"
				: "hover:bg-cyan-50/50";

	const selectedColor = colorMap[color];

	return (
		<>
			<Typography
				className="font-medium mb-3"
				sx={{
					fontSize: "1.1rem",
					display: "inline-block",
					position: "relative",
					color: selectedColor.main,
					paddingLeft: "16px",
					"&::before": {
						content: '""',
						position: "absolute",
						left: 0,
						top: "50%",
						transform: "translateY(-50%)",
						width: "4px",
						height: "18px",
						borderRadius: "2px",
						background: selectedColor.gradient,
					},
				}}
			>
				{title}
			</Typography>
			<TableContainer
				className="mb-8 rounded-xl overflow-hidden"
				component={Paper}
				elevation={2}
				sx={{
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
					background: "rgba(255, 255, 255, 0.8)",
					backdropFilter: "blur(8px)",
					border: "1px solid rgba(255, 255, 255, 0.7)",
					transition: "all 0.2s ease",
					"&:hover": {
						boxShadow:
							"0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
					},
				}}
			>
				<Table size="small">
					<TableHead
						sx={{
							background: `linear-gradient(to right, ${selectedColor.lighter}, rgba(248, 250, 252, 0.8))`,
						}}
					>
						<TableRow>
							<TableCell
								className="font-medium"
								sx={{
									borderBottom: `2px solid ${selectedColor.light}`,
									py: 1.5,
									fontSize: "0.875rem",
									color: "rgba(55, 65, 81, 0.9)",
								}}
							>
								Contributor
							</TableCell>
							<TableCell
								align="right"
								className="font-medium"
								sx={{
									borderBottom: `2px solid ${selectedColor.light}`,
									py: 1.5,
									fontSize: "0.875rem",
									color: "rgba(55, 65, 81, 0.9)",
								}}
							>
								{title.split(" ")[0]}
							</TableCell>
							<TableCell
								align="right"
								className="font-medium"
								sx={{
									borderBottom: `2px solid ${selectedColor.light}`,
									py: 1.5,
									fontSize: "0.875rem",
									color: "rgba(55, 65, 81, 0.9)",
								}}
							>
								Percentage
							</TableCell>
							<TableCell
								className="font-medium"
								sx={{
									borderBottom: `2px solid ${selectedColor.light}`,
									py: 1.5,
									fontSize: "0.875rem",
									color: "rgba(55, 65, 81, 0.9)",
									width: "40%",
								}}
							>
								Distribution
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map(({ user, count, percentage }, index) => (
							<TableRow
								key={user}
								className={`${bgHoverClass}`}
								sx={{
									transition: "all 0.2s ease",
									animation: `fadeIn 0.4s ease-out forwards ${index * 0.05}s`,
									opacity: 0,
									"@keyframes fadeIn": {
										"0%": { opacity: 0, transform: "translateY(5px)" },
										"100%": { opacity: 1, transform: "translateY(0)" },
									},
									"&:last-child td, &:last-child th": {
										borderBottom: 0,
									},
								}}
							>
								<TableCell
									component="th"
									scope="row"
									sx={{
										borderBottom: "1px solid rgba(0,0,0,0.04)",
										py: 1.5,
									}}
								>
									<Box className="flex items-center">
										<Avatar
											className={`w-7 h-7 mr-2 text-[0.8rem]`}
											sx={{
												background: selectedColor.gradient,
												fontSize: "0.8rem",
												boxShadow: `0 2px 5px ${selectedColor.main}40`,
											}}
										>
											{user.charAt(0).toUpperCase()}
										</Avatar>
										<Typography
											sx={{
												fontWeight: 500,
												fontSize: "0.875rem",
												color: "rgba(55, 65, 81, 0.9)",
											}}
										>
											{user}
										</Typography>
									</Box>
								</TableCell>
								<TableCell
									align="right"
									sx={{
										borderBottom: "1px solid rgba(0,0,0,0.04)",
										py: 1.5,
										fontWeight: 600,
										color: selectedColor.main,
									}}
								>
									{count}
								</TableCell>
								<TableCell
									align="right"
									sx={{
										borderBottom: "1px solid rgba(0,0,0,0.04)",
										py: 1.5,
										fontWeight: 500,
									}}
								>
									{percentage}%
								</TableCell>
								<TableCell
									sx={{
										borderBottom: "1px solid rgba(0,0,0,0.04)",
										py: 1.5,
									}}
								>
									<LinearProgress
										className="h-2.5 rounded-full"
										color={color}
										value={Number(percentage)}
										variant="determinate"
										sx={{
											backgroundColor: selectedColor.lighter,
											"& .MuiLinearProgress-bar": {
												background: selectedColor.gradient,
												borderRadius: "4px",
											},
										}}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

const SummaryTab: React.FC<SummaryTabProps> = ({ data }) => {
	// Calculate statistics data
	const { commitsByUser, issuesByUser, prsByUser } = useMemo(() => {
		const totalCommits = Object.values(data.commits).reduce(
			(sum, commits) => sum + commits.length,
			0
		);

		const totalIssues = Object.values(data.issues).reduce(
			(sum, issues) => sum + issues.length,
			0
		);

		const totalPRs = Object.values(data.prs).reduce(
			(sum, prs) => sum + prs.length,
			0
		);

		const uniqueContributors = new Set([
			...Object.keys(data.commits),
			...Object.keys(data.issues),
			...Object.keys(data.prs),
			...Object.keys(data.teamwork.issueComments),
			...Object.keys(data.teamwork.prReviews),
		]).size;

		// Calculate contribution percentage for each user
		const commitsByUser = Object.entries(data.commits)
			.map(([user, commits]) => ({
				user,
				count: commits.length,
				percentage: ((commits.length / totalCommits) * 100).toFixed(1),
			}))
			.sort((a, b) => b.count - a.count);

		const issuesByUser = Object.entries(data.issues)
			.map(([user, issues]) => ({
				user,
				count: issues.length,
				percentage: ((issues.length / totalIssues) * 100).toFixed(1),
			}))
			.sort((a, b) => b.count - a.count);

		const prsByUser = Object.entries(data.prs)
			.map(([user, prs]) => ({
				user,
				count: prs.length,
				percentage: ((prs.length / totalPRs) * 100).toFixed(1),
			}))
			.sort((a, b) => b.count - a.count);

		return {
			totalCommits,
			totalIssues,
			totalPRs,
			uniqueContributors,
			commitsByUser,
			issuesByUser,
			prsByUser,
		};
	}, [data]);

	return (
		<Box className="flex flex-col gap-8">
			<Box>
				<ContributionTable
					color="primary"
					data={commitsByUser}
					title="Commits by Contributor"
				/>

				<ContributionTable
					color="secondary"
					data={issuesByUser}
					title="Issues by Contributor"
				/>

				<ContributionTable
					color="info"
					data={prsByUser}
					title="Pull Requests by Contributor"
				/>
			</Box>
		</Box>
	);
};

export default SummaryTab;
