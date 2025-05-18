import { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Button,
	Alert,
	CircularProgress,
	Typography,
	InputAdornment,
	Card,
	CardContent,
	Fade,
	Snackbar,
	Grow,
	Zoom,
	FormControlLabel,
	Switch,
	LinearProgress,
	Stack,
	Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyIcon from "@mui/icons-material/Key";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import type { FunctionComponent } from "../../common/types";
import BatchResults from "./BatchResults";
import {
	fetchRepositoryData,
	parseRepoUrl,
} from "../../services/githubGraphQLService";
import "./FormStyles.css";
import GitHubIcon from "@mui/icons-material/GitHub";

interface RepoData {
	commits: Record<string, Array<{ message: string; id: string }>>;
	issues: Record<string, Array<{ title: string; body: string }>>;
	prs: Record<string, Array<{ title: string; body: string }>>;
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

type RepoStatus = "pending" | "processing" | "completed" | "error";

interface RepoListItem {
	id: string;
	url: string;
	status: RepoStatus;
	result?: RepoResult;
	error?: string;
}

const RepoAnalysisForm = (): FunctionComponent => {
	// Form state
	const [token, setToken] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	// Filtering options
	const [hideMergeCommits, setHideMergeCommits] = useState<boolean>(false);

	// Repository state
	const [repoUrls, setRepoUrls] = useState<string>("");
	const [results, setResults] = useState<Array<RepoResult>>([]);
	const [repoItems, setRepoItems] = useState<Array<RepoListItem>>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const [progress, setProgress] = useState<number>(0);

	// Get the preset GitHub token from environment variables
	useEffect(() => {
		const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
		if (presetToken) {
			setToken(presetToken);
		}
	}, []);

	// Check if there's a preset token in environment variables
	const hasPresetToken = !!import.meta.env["VITE_GITHUB_API_TOKEN"];

	const handleRepoSubmit = async (event: React.FormEvent): Promise<void> => {
		event.preventDefault();

		if (!repoUrls.trim()) {
			setError("Please enter GitHub repository URLs");
			return;
		}

		if (!token.trim()) {
			setError("Please enter a GitHub token");
			return;
		}

		// Parse repository URLs directly
		const urlList = repoUrls
			.trim()
			.split("\n")
			.filter((url) => url.trim() !== "");

		if (urlList.length === 0) {
			setError("Please enter at least one valid GitHub repository URL");
			return;
		}

		setLoading(true);
		setError(null);
		setResults([]);
		setCurrentIndex(-1);
		setProgress(0);

		try {
			// Process each URL
			const items: Array<RepoListItem> = [];
			const invalidUrls: Array<string> = [];

			// Validate URLs first
			for (const url of urlList) {
				const trimmedUrl = url.trim();
				const repoInfo = parseRepoUrl(trimmedUrl);

				if (!repoInfo) {
					invalidUrls.push(`Invalid repository URL format: ${trimmedUrl}`);
					continue;
				}

				// Check for duplicates
				if (
					items.some(
						(repo) => repo.url.toLowerCase() === trimmedUrl.toLowerCase()
					)
				) {
					invalidUrls.push(`Duplicate repository URL: ${trimmedUrl}`);
					continue;
				}

				items.push({
					id:
						Date.now().toString() + Math.random().toString(36).substring(2, 9),
					url: trimmedUrl,
					status: "pending",
				});
			}

			if (items.length === 0) {
				setError("No valid repository URLs found. Please check your input.");
				setLoading(false);
				return;
			}

			if (invalidUrls.length > 0) {
				setError(
					`Some URLs were invalid and will be skipped:\n${invalidUrls.join("\n")}`
				);
			}

			setRepoItems(items);

			// Process each repository sequentially
			const analysisResults: Array<RepoResult> = [];

			for (let index = 0; index < items.length; index++) {
				// Update current processing repository index
				setCurrentIndex(index);

				// Update progress percentage
				const progressPercent = Math.round((index / items.length) * 100);
				setProgress(progressPercent);

				// Update status to processing
				setRepoItems((previousItems) => {
					return previousItems.map((item, index_) =>
						index_ === index ? { ...item, status: "processing" } : item
					);
				});

				try {
					// Use GraphQL API to get repository data
					const currentItem = items[index];
					if (!currentItem) continue;

					const currentUrl = currentItem.url;
					const repoData = await fetchRepositoryData(currentUrl, token, {
						hideMergeCommits,
					});

					// Calculate repository statistics
					const totalCommits = Object.values(repoData.commits).reduce(
						(sum, commits) => sum + commits.length,
						0
					);
					const totalIssues = Object.values(repoData.issues).reduce(
						(sum, issues) => sum + issues.length,
						0
					);
					const totalPRs = Object.values(repoData.prs).reduce(
						(sum, prs) => sum + prs.length,
						0
					);
					const contributors = new Set([
						...Object.keys(repoData.commits),
						...Object.keys(repoData.issues),
						...Object.keys(repoData.prs),
					]).size;

					// Get repository name
					const repoInfo = parseRepoUrl(currentUrl);
					const repoName = repoInfo
						? repoInfo.repo
						: currentUrl.split("/").pop() || currentUrl;

					// Create result object
					const result: RepoResult = {
						repoUrl: currentUrl,
						repoName,
						commits: totalCommits,
						issues: totalIssues,
						prs: totalPRs,
						contributors,
						data: repoData,
					};

					analysisResults.push(result);

					// Update status to completed and add result
					setRepoItems((previousItems) => {
						return previousItems.map((item, index_) =>
							index_ === index ? { ...item, status: "completed", result } : item
						);
					});

					// Update results as they complete
					setResults([...analysisResults]);
				} catch (error_) {
					const currentItem = items[index];
					if (currentItem) {
						console.error(`Error analyzing ${currentItem.url}:`, error_);
					}

					// Update status to error
					setRepoItems((previousItems) => {
						return previousItems.map((item, index_) =>
							index_ === index
								? {
										...item,
										status: "error",
										error: `Failed to analyze: ${(error_ as Error).message}`,
									}
								: item
						);
					});
				}

				// Short delay to make progress visible
				await new Promise((resolve) => {
					setTimeout(resolve, 300);
				});
			}

			// Set final progress
			setProgress(100);

			if (analysisResults.length === 0) {
				setError(
					"Failed to analyze any repositories. Please check your input or token."
				);
			} else {
				setSuccess(true);
			}
		} catch (error_) {
			setError(`Batch analysis failed: ${(error_ as Error).message}`);
			console.error(error_);
		} finally {
			setLoading(false);
		}
	};

	const handleCloseSnackbar = (): void => {
		setSuccess(false);
	};

	const getStatusColor = (status: RepoStatus): any => {
		switch (status) {
			case "pending":
				return "default";
			case "processing":
				return "primary";
			case "completed":
				return "success";
			case "error":
				return "error";
			default:
				return "default";
		}
	};

	const getStatusIcon = (status: RepoStatus): JSX.Element | null => {
		switch (status) {
			case "pending":
				return <HourglassTopIcon fontSize="small" />;
			case "processing":
				return <CircularProgress size={16} />;
			case "completed":
				return <CheckCircleIcon fontSize="small" />;
			case "error":
				return <ErrorIcon fontSize="small" />;
			default:
				return null;
		}
	};

	return (
		<Box className="form-container">
			<Grow in timeout={800}>
				<Card className="form-card">
					<CardContent className="p-6">
						<form onSubmit={handleRepoSubmit}>
							<Typography className="form-title">
								Repository Analysis
							</Typography>

							<Box className="mb-5 relative">
								<Typography className="form-subtitle">
									GitHub Repository URLs
								</Typography>
								<TextField
									fullWidth
									multiline
									className="enhanced-input"
									placeholder="Enter GitHub repository URLs (one per line)"
									rows={4}
									value={repoUrls}
									variant="outlined"
									InputProps={{
										className: "rounded-md bg-white",
										startAdornment: (
											<InputAdornment position="start">
												<div className="input-icon-container">
													<GitHubIcon
														color="primary"
														sx={{ opacity: 0.8, fontSize: "1.2rem" }}
													/>
												</div>
											</InputAdornment>
										),
									}}
									onChange={(event_): void => {
										setRepoUrls(event_.target.value);
									}}
								/>
							</Box>

							<Box className="mb-5">
								<Typography className="form-subtitle">
									GitHub Personal Access Token
								</Typography>
								<TextField
									fullWidth
									className="enhanced-input"
									disabled={false}
									placeholder="Enter your GitHub token"
									type="password"
									value={token}
									variant="outlined"
									InputProps={{
										className: "rounded-md bg-white",
										startAdornment: (
											<InputAdornment position="start">
												<div className="input-icon-container">
													<KeyIcon
														color="primary"
														sx={{ opacity: 0.8, fontSize: "1.2rem" }}
													/>
												</div>
											</InputAdornment>
										),
									}}
									onChange={(event_): void => {
										setToken(event_.target.value);
									}}
								/>
								<Typography className="text-xs text-gray-500 mt-2 ml-1">
									{hasPresetToken
										? "Preset token from environment variables is loaded, but you can modify it"
										: "Required for API access (needs repo scope permissions)"}
								</Typography>
							</Box>

							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-start",
									alignItems: "center",
									mt: 2,
									mb: 0.5,
									p: 1.5,
									bgcolor: "rgba(59, 130, 246, 0.05)",
									borderRadius: "8px",
									border: "1px solid rgba(59, 130, 246, 0.1)",
								}}
							>
								<Typography
									variant="body2"
									sx={{
										fontWeight: 500,
										fontSize: "0.85rem",
										color: "text.secondary",
										display: "flex",
										alignItems: "center",
									}}
								>
									<PlaylistAddCheckIcon
										sx={{
											mr: 1,
											color: "primary.main",
											fontSize: "1.1rem",
										}}
									/>
									Analysis Options
								</Typography>
								<Box sx={{ ml: "auto" }}>
									<FormControlLabel
										sx={{ mr: 0 }}
										control={
											<Switch
												checked={hideMergeCommits}
												color="primary"
												size="small"
												onChange={(event_) => {
													setHideMergeCommits(event_.target.checked);
												}}
											/>
										}
										label={
											<Typography sx={{ fontSize: "0.85rem" }} variant="body2">
												Filter Merge Commits
											</Typography>
										}
									/>
								</Box>
							</Box>

							{error && (
								<Fade in={!!error} timeout={{ enter: 300, exit: 200 }}>
									<Alert
										className="mb-5 rounded-lg custom-alert error"
										severity="error"
										sx={{
											borderRadius: "12px",
											boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
											".MuiAlert-icon": {
												color: "white",
											},
											".MuiAlert-message": {
												color: "white",
												fontWeight: "500",
											},
										}}
									>
										{error}
									</Alert>
								</Fade>
							)}

							<Box className="flex justify-end mt-8">
								<Button
									className="submit-button"
									color="primary"
									disabled={loading}
									type="submit"
									variant="contained"
									startIcon={
										loading ? (
											<div className="process-indicator">
												<CircularProgress size={20} sx={{ color: "white" }} />
											</div>
										) : (
											<SearchIcon sx={{ fontSize: "1.2rem" }} />
										)
									}
								>
									{loading ? "Analyzing..." : "Analyze Repositories"}
								</Button>
							</Box>
						</form>
					</CardContent>
				</Card>
			</Grow>

			{/* Progress Section */}
			{loading && repoItems.length > 0 && (
				<Zoom
					in={loading && repoItems.length > 0}
					style={{ transitionDelay: "100ms" }}
					timeout={500}
				>
					<Box className="mt-8">
						<Card className="form-card">
							<CardContent className="p-5">
								<Box className="flex justify-between items-center mb-3">
									<Typography className="font-semibold text-gray-700">
										Analysis Progress
									</Typography>
									<Typography className="text-sm text-gray-600">
										{`${currentIndex + 1} of ${repoItems.length} repositories (${progress}%)`}
									</Typography>
								</Box>

								<LinearProgress
									value={progress}
									variant="determinate"
									sx={{
										height: 8,
										borderRadius: 4,
										mb: 3,
										backgroundColor: "rgba(59, 130, 246, 0.1)",
										"& .MuiLinearProgress-bar": {
											background: "linear-gradient(45deg, #2563eb, #4f46e5)",
											borderRadius: 4,
										},
									}}
								/>

								<Stack maxHeight="200px" spacing={1} sx={{ overflowY: "auto" }}>
									{repoItems.map((repo, index) => (
										<Box
											key={repo.id}
											className={`p-2 rounded-md flex items-center justify-between ${
												index === currentIndex && repo.status === "processing"
													? "bg-blue-50"
													: repo.status === "completed"
														? "bg-green-50"
														: repo.status === "error"
															? "bg-red-50"
															: ""
											}`}
										>
											<Box className="flex items-center">
												<Box
													sx={{
														width: 24,
														mr: 1.5,
														display: "flex",
														justifyContent: "center",
													}}
												>
													{getStatusIcon(repo.status)}
												</Box>
												<Typography
													noWrap
													className="text-sm text-gray-700 font-medium"
													sx={{ maxWidth: 250 }}
												>
													{repo.url.replace("https://github.com/", "")}
												</Typography>
											</Box>
											<Chip
												className="min-w-[90px]"
												color={getStatusColor(repo.status)}
												size="small"
												sx={{ fontWeight: 500 }}
												variant="outlined"
												label={
													repo.status.charAt(0).toUpperCase() +
													repo.status.slice(1)
												}
											/>
										</Box>
									))}
								</Stack>
							</CardContent>
						</Card>
					</Box>
				</Zoom>
			)}

			{/* Results Section */}
			{results.length > 0 && (
				<Zoom in={results.length > 0} timeout={500}>
					<Box className="mt-8">
						<Typography className="form-title mb-4">
							Repository Analysis Results
						</Typography>
						<BatchResults results={results} />
					</Box>
				</Zoom>
			)}

			{/* Success Notifications */}
			<Snackbar
				TransitionComponent={Zoom}
				autoHideDuration={5000}
				open={success}
				onClose={handleCloseSnackbar}
			>
				<Alert
					className="custom-alert success"
					severity="success"
					sx={{
						width: "100%",
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						color: "white",
						".MuiAlert-icon": {
							color: "white",
						},
					}}
					onClose={handleCloseSnackbar}
				>
					Repositories analyzed successfully!
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default RepoAnalysisForm;
