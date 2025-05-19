import { useState, useEffect } from "react";
import {
	Box,
	Button,
	CircularProgress,
	Typography,
	Card,
	CardContent,
	Grow,
	Zoom,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BatchResults from "./results/BatchResults.tsx";
import { fetchRepositoryData, parseRepoUrl } from "../../services/github";
import "../../styles/FormStyles.css";

// Components
import RepoUrlsInput from "./forms/RepoUrlsInput";
import GitHubTokenInput from "./forms/GitHubTokenInput";
import AnalysisOptions from "./forms/AnalysisOptions";
import ErrorNotification from "./notifications/ErrorNotification";
import SuccessNotification from "./notifications/SuccessNotification";
import TokenNotification from "./notifications/TokenNotification";
import ProgressTracker from "./progress/ProgressTracker";

// Types
import { RepoResult, RepoListItem } from "./types";

const RepoAnalysisForm = (): JSX.Element => {
	// Form state
	const [token, setToken] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [tokenMessage, setTokenMessage] = useState<{
		message: string;
		severity: "success" | "error" | "info";
	} | null>(null);

	// Filtering options
	const [hideMergeCommits, setHideMergeCommits] = useState<boolean>(true);

	// Repository state
	const [repoUrls, setRepoUrls] = useState<string>("");
	const [results, setResults] = useState<Array<RepoResult>>([]);
	const [repoItems, setRepoItems] = useState<Array<RepoListItem>>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const [progress, setProgress] = useState<number>(0);

	// Get the GitHub token from localStorage first, then fallback to environment variables
	useEffect(() => {
		const savedToken = localStorage.getItem("githubToken");
		if (savedToken) {
			setToken(savedToken);
		} else {
			const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
			if (presetToken) {
				setToken(presetToken);
			}
		}
	}, []);

	// Check if there's a saved token in localStorage
	const hasSavedToken = !!localStorage.getItem("githubToken");
	// Check if there's a preset token in environment variables
	const hasPresetToken = !!import.meta.env["VITE_GITHUB_API_TOKEN"];

	// Save token to localStorage
	const saveToken = (): void => {
		if (token.trim()) {
			localStorage.setItem("githubToken", token);
			setTokenMessage({
				message: "GitHub token saved to browser storage",
				severity: "success",
			});
		} else {
			setTokenMessage({
				message: "Please enter a token to save",
				severity: "error",
			});
		}
	};

	// Delete token from localStorage
	const deleteToken = (): void => {
		localStorage.removeItem("githubToken");
		setTokenMessage({
			message: "GitHub token removed from browser storage",
			severity: "success",
		});

		// Fallback to environment variable token if available
		const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
		if (presetToken) {
			setToken(presetToken);
		} else {
			setToken("");
		}
	};

	const handleTokenMessageClose = (): void => {
		setTokenMessage(null);
	};

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

	const handleErrorClose = (): void => {
		setError("");
	};

	const handleTokenChange = (newToken: string): void => {
		setToken(newToken);
	};

	const handleRepoUrlsChange = (newUrls: string): void => {
		setRepoUrls(newUrls);
	};

	const handleHideMergeCommitsChange = (checked: boolean): void => {
		setHideMergeCommits(checked);
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

							{/* Repository URLs Input */}
							<RepoUrlsInput
								repoUrls={repoUrls}
								onRepoUrlsChange={handleRepoUrlsChange}
							/>

							{/* GitHub Token Input */}
							<GitHubTokenInput
								hasPresetToken={hasPresetToken}
								hasSavedToken={hasSavedToken}
								token={token}
								onTokenChange={handleTokenChange}
								onTokenDelete={deleteToken}
								onTokenSave={saveToken}
							/>

							{/* Analysis Options */}
							<AnalysisOptions
								hideMergeCommits={hideMergeCommits}
								onHideMergeCommitsChange={handleHideMergeCommitsChange}
							/>

							{/* Error Notification */}
							<ErrorNotification error={error} onClose={handleErrorClose} />

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
			<ProgressTracker
				currentIndex={currentIndex}
				loading={loading}
				progress={progress}
				repoItems={repoItems}
			/>

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

			{/* Success Notification */}
			<SuccessNotification open={success} onClose={handleCloseSnackbar} />

			{/* Token Management Notification */}
			<TokenNotification
				tokenMessage={tokenMessage}
				onClose={handleTokenMessageClose}
			/>
		</Box>
	);
};

export default RepoAnalysisForm;
