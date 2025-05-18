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
	Grow,
	Zoom,
	LinearProgress,
	Stack,
	Chip,
	FormControlLabel,
	Switch,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import SearchIcon from "@mui/icons-material/Search";
import KeyIcon from "@mui/icons-material/Key";
import ViewListIcon from "@mui/icons-material/ViewList";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import {
	fetchRepositoryData,
	parseRepoUrl,
} from "../../../services/githubGraphQLService.ts";
import "../../../styles/FormStyles.css";

interface BatchRepoFormProps {
	onDataFetched: (results: Array<any>) => void;
}

interface RepoResult {
	repoUrl: string;
	repoName: string;
	commits: number;
	issues: number;
	prs: number;
	contributors: number;
	data: any;
}

type RepoStatus = "pending" | "processing" | "completed" | "error";

interface RepoListItem {
	id: string;
	url: string;
	status: RepoStatus;
	result?: RepoResult;
	error?: string;
}

const BatchRepoForm: React.FC<BatchRepoFormProps> = ({ onDataFetched }) => {
	// Form state
	const [repoUrls, setRepoUrls] = useState<string>("");
	const [token, setToken] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [hideMergeCommits, setHideMergeCommits] = useState<boolean>(false);

	// Batch processing state
	const [repoItems, setRepoItems] = useState<Array<RepoListItem>>([]);
	const [results, setResults] = useState<Array<RepoResult>>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const [progress, setProgress] = useState<number>(0);

	// Get the preset GitHub token from environment variables
	useEffect(() => {
		const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
		if (presetToken) {
			setToken(presetToken);
		}
	}, []);

	// Check if there's a preset token
	const hasPresetToken = !!import.meta.env["VITE_GITHUB_API_TOKEN"];

	const extractRepoName = (url: string): string => {
		const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
		if (match) {
			return `${match[1]}/${match[2]}`;
		}

		// Handle owner/repo format
		const parts = url.split("/");
		if (parts.length === 2) {
			return url;
		}

		return url;
	};

	const handleSubmit = async (event: React.FormEvent): Promise<void> => {
		event.preventDefault();

		if (!repoUrls.trim()) {
			setError("Please enter GitHub repository URLs");
			return;
		}

		if (!token.trim()) {
			setError("Please enter a GitHub token");
			return;
		}

		// Parse repository URLs
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
		setSuccess(false);
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

			if (invalidUrls.length > 0) {
				const errorMessage =
					invalidUrls.length <= 3
						? `Issues with some repositories: ${invalidUrls.join("; ")}`
						: `Issues with ${invalidUrls.length} repositories. First few: ${invalidUrls.slice(0, 3).join("; ")}...`;
				setError(errorMessage);

				if (items.length === 0) {
					setLoading(false);
					return;
				}
			}

			setRepoItems(items);
			const batchResults: Array<RepoResult> = [];

			// Process repositories sequentially
			for (let index = 0; index < items.length; index++) {
				setCurrentIndex(index);
				setProgress((index / items.length) * 100);

				// Update status to processing
				setRepoItems((previousItems) => {
					const updatedItems = [...previousItems];
					const item = updatedItems[index];
					if (item) {
						updatedItems[index] = { ...item, status: "processing" };
					}
					return updatedItems;
				});

				try {
					const currentItem = items[index];
					if (!currentItem) continue;

					// Pass filtering option to API
					const data = await fetchRepositoryData(currentItem.url, token, {
						hideMergeCommits,
					});

					const result: RepoResult = {
						repoUrl: currentItem.url,
						repoName: extractRepoName(currentItem.url),
						commits: Object.values(data.commits).flat().length,
						issues: Object.values(data.issues).flat().length,
						prs: Object.values(data.prs).flat().length,
						contributors: Object.keys(data.commits).length,
						data,
					};

					batchResults.push(result);

					// Update status to completed
					setRepoItems((previousItems) => {
						const updatedItems = [...previousItems];
						const item = updatedItems[index];
						if (item) {
							updatedItems[index] = {
								...item,
								status: "completed",
								result,
							};
						}
						return updatedItems;
					});
				} catch (error_) {
					console.error(
						`Error processing ${items[index]?.url || "unknown repository"}:`,
						error_
					);

					// Update status to error
					setRepoItems((previousItems) => {
						const updatedItems = [...previousItems];
						const item = updatedItems[index];
						if (item) {
							updatedItems[index] = {
								...item,
								status: "error",
								error: (error_ as Error).message,
							};
						}
						return updatedItems;
					});
				}
			}

			setProgress(100);
			setResults(batchResults);
			onDataFetched(batchResults);
			setSuccess(true);
		} catch (error_) {
			setError(`Batch analysis failed: ${(error_ as Error).message}`);
			console.error(error_);
		} finally {
			setLoading(false);
		}
	};

	const clearForm = (): void => {
		setRepoUrls("");
		setError(null);
		setSuccess(false);
		setResults([]);
		setRepoItems([]);
		setCurrentIndex(-1);
		setProgress(0);
	};

	const getStatusColor = (status: RepoStatus): string => {
		switch (status) {
			case "pending":
				return "rgba(107, 114, 128, 0.7)";
			case "processing":
				return "#3B82F6";
			case "completed":
				return "#10B981";
			case "error":
				return "#EF4444";
			default:
				return "rgba(107, 114, 128, 0.7)";
		}
	};

	const getStatusIcon = (status: RepoStatus): JSX.Element => {
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
				return <HourglassTopIcon fontSize="small" />;
		}
	};

	return (
		<Grow in timeout={500}>
			<Card className="form-card" elevation={0}>
				<CardContent sx={{ p: 3 }}>
					<Typography gutterBottom className="form-title" variant="h5">
						Analyze Multiple Repositories
					</Typography>

					<Box
						className="form-container"
						component="form"
						onSubmit={handleSubmit}
					>
						<Box sx={{ position: "relative", mb: 3 }}>
							<TextField
								fullWidth
								multiline
								className="enhanced-input"
								disabled={loading}
								label="GitHub Repositories"
								rows={4}
								value={repoUrls}
								variant="outlined"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Box className="input-icon-container">
												<ViewListIcon sx={{ color: "#3B82F6" }} />
											</Box>
										</InputAdornment>
									),
								}}
								error={
									!!error &&
									(error.includes("repository") || error.includes("URL"))
								}
								helperText={
									error &&
									(error.includes("repository") || error.includes("URL"))
										? error
										: "Enter one repository URL per line"
								}
								placeholder="Enter repository URLs (one per line)
Example:
https://github.com/facebook/react
microsoft/typescript"
								onChange={(event_) => {
									setRepoUrls(event_.target.value);
									if (error) setError(null);
								}}
							/>
						</Box>

						{!hasPresetToken && (
							<Box sx={{ position: "relative", mb: 3 }}>
								<TextField
									fullWidth
									className="enhanced-input"
									disabled={loading}
									error={!!error && error.includes("token")}
									label="GitHub Token"
									placeholder="Enter your GitHub personal access token"
									type="password"
									value={token}
									variant="outlined"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Box className="input-icon-container">
													<KeyIcon sx={{ color: "#4F46E5" }} />
												</Box>
											</InputAdornment>
										),
									}}
									helperText={
										error && error.includes("token")
											? error
											: "GitHub personal access token with repo scope"
									}
									onChange={(event_) => {
										setToken(event_.target.value);
										if (error) setError(null);
									}}
								/>
							</Box>
						)}

						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-start",
								alignItems: "center",
								mt: 2,
								mb: 2,
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

						{loading && currentIndex >= 0 && (
							<Box sx={{ mb: 3 }}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										mb: 1,
									}}
								>
									<Typography color="text.secondary" variant="body2">
										Processing repository {currentIndex + 1} of{" "}
										{repoItems.length}
									</Typography>
									<Typography color="text.secondary" variant="body2">
										{Math.round(progress)}%
									</Typography>
								</Box>
								<LinearProgress
									value={progress}
									variant="determinate"
									sx={{
										height: 8,
										borderRadius: 4,
										backgroundColor: "rgba(59, 130, 246, 0.1)",
										"& .MuiLinearProgress-bar": {
											background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
											borderRadius: 4,
										},
									}}
								/>
							</Box>
						)}

						{repoItems.length > 0 && (
							<Box
								sx={{
									mb: 3,
									p: 2,
									borderRadius: "12px",
									border: "1px solid rgba(0, 0, 0, 0.08)",
									backgroundColor: "rgba(255, 255, 255, 0.5)",
									maxHeight: "200px",
									overflowY: "auto",
								}}
							>
								<Typography
									sx={{ mb: 1.5, fontWeight: 600, color: "text.primary" }}
									variant="subtitle2"
								>
									Repository Status
								</Typography>
								<Stack spacing={1}>
									{repoItems.map((item) => (
										<Box
											key={item.id}
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												p: 1,
												borderRadius: "8px",
												backgroundColor: "rgba(255, 255, 255, 0.8)",
												border: "1px solid rgba(0, 0, 0, 0.04)",
												transition: "all 0.3s ease",
												"&:hover": {
													backgroundColor: "rgba(255, 255, 255, 0.95)",
													boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
												},
											}}
										>
											<Typography
												variant="body2"
												sx={{
													fontWeight: item.status === "processing" ? 600 : 400,
													color:
														item.status === "error"
															? "error.main"
															: "text.primary",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													maxWidth: "70%",
												}}
											>
												{extractRepoName(item.url)}
											</Typography>
											<Chip
												icon={getStatusIcon(item.status)}
												size="small"
												label={
													item.status.charAt(0).toUpperCase() +
													item.status.slice(1)
												}
												sx={{
													backgroundColor: `${getStatusColor(item.status)}20`,
													color: getStatusColor(item.status),
													borderRadius: "8px",
													"& .MuiChip-icon": {
														color: "inherit",
													},
												}}
											/>
										</Box>
									))}
								</Stack>
							</Box>
						)}

						<Box sx={{ display: "flex", gap: 2, mt: 4 }}>
							<Button
								fullWidth
								className="submit-button"
								disabled={loading}
								type="submit"
								variant="contained"
								startIcon={
									loading ? (
										<CircularProgress color="inherit" size={20} />
									) : (
										<SearchIcon />
									)
								}
							>
								{loading ? "Analyzing Repositories..." : "Analyze Repositories"}
							</Button>

							{(error || success || repoItems.length > 0) && (
								<Button
									variant="outlined"
									sx={{
										borderRadius: "12px",
										minWidth: "120px",
										transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
										borderColor: "rgba(0, 0, 0, 0.12)",
										color: "rgba(0, 0, 0, 0.6)",
										"&:hover": {
											borderColor: "rgba(0, 0, 0, 0.24)",
											background: "rgba(0, 0, 0, 0.04)",
										},
									}}
									onClick={clearForm}
								>
									Clear
								</Button>
							)}
						</Box>

						{error && (
							<Zoom in={!!error} timeout={300}>
								<Alert
									className="custom-alert error"
									icon={<ErrorIcon />}
									severity="error"
									sx={{ mt: 3 }}
								>
									{error}
								</Alert>
							</Zoom>
						)}

						{success && !error && (
							<Zoom in={success} timeout={300}>
								<Alert
									className="custom-alert success"
									icon={<CheckCircleIcon />}
									severity="success"
									sx={{ mt: 3 }}
								>
									Successfully analyzed {results.length} repositories!
								</Alert>
							</Zoom>
						)}

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								mt: 2,
								color: "text.secondary",
								fontSize: "0.875rem",
								opacity: 0.7,
								transition: "opacity 0.3s ease",
								"&:hover": { opacity: 1 },
							}}
						>
							<GitHubIcon sx={{ fontSize: "1rem" }} />
							<Typography variant="caption">
								Batch processing allows you to analyze multiple repositories at
								once.
							</Typography>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</Grow>
	);
};

export default BatchRepoForm;
