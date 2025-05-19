import { useState } from "react";
import { fetchRepositoryData, parseRepoUrl } from "../../services/github";
import type { RepoListItem, RepoResult } from "../../types";

export interface UseRepoAnalysisReturn {
	loading: boolean;
	error: string | null;
	success: boolean;
	repoItems: Array<RepoListItem>;
	results: Array<RepoResult>;
	currentIndex: number;
	progress: number;
	hideMergeCommits: boolean;
	setHideMergeCommits: (value: boolean) => void;
	handleRepoSubmit: (event: React.FormEvent) => Promise<void>;
	handleCloseSnackbar: () => void;
	handleErrorClose: () => void;
	extractRepoName: (url: string) => string;
}

export function useRepoAnalysis(
	repoUrls: string,
	token: string
): UseRepoAnalysisReturn {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [repoItems, setRepoItems] = useState<Array<RepoListItem>>([]);
	const [results, setResults] = useState<Array<RepoResult>>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const [progress, setProgress] = useState<number>(0);
	const [hideMergeCommits, setHideMergeCommits] = useState<boolean>(true);

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

	return {
		loading,
		error,
		success,
		repoItems,
		results,
		currentIndex,
		progress,
		hideMergeCommits,
		setHideMergeCommits,
		handleRepoSubmit,
		handleCloseSnackbar,
		handleErrorClose,
		extractRepoName,
	};
}
