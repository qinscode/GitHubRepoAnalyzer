import React from "react";
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Chip,
	Collapse,
	Avatar,
	Tooltip,
} from "@mui/material";
import {
	Commit as CommitIcon,
	BugReport as IssueIcon,
	MergeType as PRIcon,
	Group as TeamIcon,
	KeyboardArrowDown as ExpandIcon,
	KeyboardArrowUp as CollapseIcon,
} from "@mui/icons-material";
import RepoResults from "./RepoResults";

interface RepoData {
	commits: Record<string, Array<{ message: string; id: string }>>;
	issues: Record<string, Array<{ title: string; body: string }>>;
	prs: Record<string, Array<{ title: string }>>;
	teamwork: {
		issueComments: Record<string, number>;
		prReviews: Record<string, number>;
	};
}

interface RepoResult {
	repoUrl: string;
	repoName: string;
	commits: number;
	issues: number;
	prs: number;
	contributors: number;
	data: RepoData;
}

interface BatchResultsProps {
	results: Array<RepoResult>;
}

function BatchResults({ results }: BatchResultsProps): JSX.Element {
	const [expandedRepo, setExpandedRepo] = React.useState<string | null>(null);

	const handleToggleDetails = (repoUrl: string): void => {
		setExpandedRepo(expandedRepo === repoUrl ? null : repoUrl);
	};

	return (
		<TableContainer
			className="rounded-md overflow-hidden shadow-sm"
			component={Paper}
			variant="outlined"
			sx={{
				borderColor: "rgba(0,0,0,0.06)",
				width: "100%",
				overflowX: "hidden",
			}}
		>
			<Table sx={{ tableLayout: "fixed", width: "100%" }}>
				<TableHead className="bg-gray-50">
					<TableRow>
						<TableCell className="font-medium text-gray-600 py-3" width="30%">
							Repository
						</TableCell>
						<TableCell
							align="center"
							className="font-medium text-gray-600"
							width="12%"
						>
							Commits
						</TableCell>
						<TableCell
							align="center"
							className="font-medium text-gray-600"
							width="12%"
						>
							Issues
						</TableCell>
						<TableCell
							align="center"
							className="font-medium text-gray-600"
							width="12%"
						>
							PRs
						</TableCell>
						<TableCell
							align="center"
							className="font-medium text-gray-600"
							width="14%"
						>
							Contributors
						</TableCell>
						<TableCell
							align="right"
							className="font-medium text-gray-600"
							width="20%"
						>
							Actions
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{results.map((result) => (
						<React.Fragment key={result.repoUrl}>
							<TableRow
								className={`hover:bg-blue-50/20 transition-colors ${expandedRepo === result.repoUrl ? "bg-blue-50/10" : ""}`}
								sx={{
									borderBottom:
										expandedRepo === result.repoUrl
											? "none"
											: "1px solid rgba(224, 224, 224, 1)",
								}}
							>
								<TableCell
									className="py-3 border-b border-gray-100"
									component="th"
									scope="row"
									sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
									width="30%"
								>
									<Box className="flex items-center">
										<Avatar
											className="w-8 h-8 mr-3 flex-shrink-0"
											sx={{
												background: "linear-gradient(135deg, #3b82f6, #6366f1)",
												fontSize: "0.9rem",
												fontWeight: "bold",
											}}
										>
											{result.repoName.charAt(0).toUpperCase()}
										</Avatar>
										<Box className="min-w-0 flex-grow">
											<Typography
												className="font-medium text-gray-800"
												sx={{
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}
											>
												{result.repoName}
											</Typography>
											<Typography
												className="text-xs text-gray-500 mt-0.5"
												sx={{
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}
											>
												{result.repoUrl.replace("https://github.com/", "")}
											</Typography>
										</Box>
									</Box>
								</TableCell>
								<TableCell
									align="center"
									className="border-b border-gray-100"
									width="12%"
								>
									<Tooltip title="Total number of commits">
										<Chip
											className="font-medium"
											label={result.commits}
											size="small"
											icon={
												<CommitIcon
													sx={{ fontSize: "0.9rem", color: "#2563eb" }}
												/>
											}
											sx={{
												backgroundColor: "rgba(37, 99, 235, 0.08)",
												color: "#2563eb",
												fontWeight: 600,
												borderRadius: "6px",
												border: "none",
											}}
										/>
									</Tooltip>
								</TableCell>
								<TableCell
									align="center"
									className="border-b border-gray-100"
									width="12%"
								>
									<Tooltip title="Total number of issues">
										<Chip
											className="font-medium"
											label={result.issues}
											size="small"
											icon={
												<IssueIcon
													sx={{ fontSize: "0.9rem", color: "#8e44ad" }}
												/>
											}
											sx={{
												backgroundColor: "rgba(155, 89, 182, 0.08)",
												color: "#8e44ad",
												fontWeight: 600,
												borderRadius: "6px",
												border: "none",
											}}
										/>
									</Tooltip>
								</TableCell>
								<TableCell
									align="center"
									className="border-b border-gray-100"
									width="12%"
								>
									<Tooltip title="Total number of pull requests">
										<Chip
											className="font-medium"
											label={result.prs}
											size="small"
											icon={
												<PRIcon sx={{ fontSize: "0.9rem", color: "#00acc1" }} />
											}
											sx={{
												backgroundColor: "rgba(0, 184, 212, 0.08)",
												color: "#00acc1",
												fontWeight: 600,
												borderRadius: "6px",
												border: "none",
											}}
										/>
									</Tooltip>
								</TableCell>
								<TableCell
									align="center"
									className="border-b border-gray-100"
									width="14%"
								>
									<Tooltip title="Total number of contributors">
										<Chip
											className="font-medium"
											label={result.contributors}
											size="small"
											icon={
												<TeamIcon
													sx={{ fontSize: "0.9rem", color: "#2e7d32" }}
												/>
											}
											sx={{
												backgroundColor: "rgba(68, 189, 50, 0.08)",
												color: "#2e7d32",
												fontWeight: 600,
												borderRadius: "6px",
												border: "none",
											}}
										/>
									</Tooltip>
								</TableCell>
								<TableCell
									align="right"
									className="border-b border-gray-100"
									width="20%"
								>
									<Button
										className="text-xs rounded-md"
										color="primary"
										size="small"
										variant="text"
										endIcon={
											expandedRepo === result.repoUrl ? (
												<CollapseIcon />
											) : (
												<ExpandIcon />
											)
										}
										sx={{
											fontWeight: 500,
											textTransform: "none",
										}}
										onClick={(): void => {
											handleToggleDetails(result.repoUrl);
										}}
									>
										{expandedRepo === result.repoUrl
											? "Hide Details"
											: "View Details"}
									</Button>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="p-0 border-b border-gray-100" colSpan={6}>
									<Collapse
										unmountOnExit
										in={expandedRepo === result.repoUrl}
										timeout="auto"
									>
										<Box className="p-5 ">
											<Typography className="font-semibold text-lg mb-4 text-gray-800">
												Details for {result.repoName}
											</Typography>
											<RepoResults data={result.data} />
										</Box>
									</Collapse>
								</TableCell>
							</TableRow>
						</React.Fragment>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default BatchResults;
