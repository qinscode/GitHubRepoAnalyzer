import { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Typography,
	InputAdornment,
	Card,
	CardContent,
	Grow,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyIcon from "@mui/icons-material/Key";
import ViewListIcon from "@mui/icons-material/ViewList";

import {
	fetchRepositoryData,
	parseRepoUrl,
} from "../../../services/githubGraphQLService.ts";
import "../../../styles/FormStyles.css";
import type {
	RepoListItem,
	RepoResult,
	BatchRepoFormProps,
} from "../types/batchRepoTypes";
import RepoStatusList from "./RepoStatusList";
import ProcessingProgress from "./ProcessingProgress";
import AnalysisOptions from "./AnalysisOptions";
import FormActions from "./FormActions";

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
	// @ts-ignore
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

						<AnalysisOptions
							hideMergeCommits={hideMergeCommits}
							setHideMergeCommits={setHideMergeCommits}
						/>

						<ProcessingProgress
							currentIndex={currentIndex}
							loading={loading}
							progress={progress}
							repoItemsLength={repoItems.length}
						/>

						<RepoStatusList
							extractRepoName={extractRepoName}
							repoItems={repoItems}
						/>

						<FormActions
							error={error}
							loading={loading}
							repoItemsLength={repoItems.length}
							success={success}
							onClear={clearForm}
						/>

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
