import { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Button,
	Alert,
	CircularProgress,
	Typography,
	Paper,
	Divider,
	Snackbar,
	Card,
	CardContent,
	InputAdornment,
	Fade,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyIcon from "@mui/icons-material/Key";
import type { FunctionComponent } from "../../common/types";
import BatchResults from "./BatchResults";
import {
	fetchRepositoryData,
	parseRepoUrl,
} from "../../services/githubGraphQLService";

// Define repository data types
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

interface RepoListItem {
	id: string;
	url: string;
	status?: "pending" | "processing" | "completed" | "error";
	result?: RepoResult;
	error?: string;
}

const BatchRepoForm = (): FunctionComponent => {
	const [repoUrls, setRepoUrls] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [token, setToken] = useState<string>("");
	const [success, setSuccess] = useState<boolean>(false);
	const [results, setResults] = useState<Array<RepoResult>>([]);

	// Get preset GitHub token from environment variables
	useEffect(() => {
		const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
		if (presetToken) {
			setToken(presetToken);
		}
	}, []);

	// Check if there's a preset token in environment variables
	const hasPresetToken = !!import.meta.env["VITE_GITHUB_API_TOKEN"];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

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

		try {
			// Process each URL
			const repoItems: Array<RepoListItem> = [];
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
					repoItems.some(
						(repo) => repo.url.toLowerCase() === trimmedUrl.toLowerCase()
					)
				) {
					invalidUrls.push(`Duplicate repository URL: ${trimmedUrl}`);
					continue;
				}

				repoItems.push({
					id:
						Date.now().toString() + Math.random().toString(36).substring(2, 9),
					url: trimmedUrl,
					status: "processing",
				});
			}

			if (repoItems.length === 0) {
				setError("No valid repository URLs found. Please check your input.");
				setLoading(false);
				return;
			}

			if (invalidUrls.length > 0) {
				setError(
					`Some URLs were invalid and will be skipped:\n${invalidUrls.join("\n")}`
				);
			}

			const analysisResults: Array<RepoResult> = [];

			// Process each repository sequentially
			for (let index = 0; index < repoItems.length; index++) {
				const currentRepo = repoItems[index];
				if (!currentRepo) continue; // Skip if undefined (shouldn't happen)

				try {
					// Use GraphQL API to get repository data
					const repoData = await fetchRepositoryData(currentRepo.url, token);

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
					const repoInfo = parseRepoUrl(currentRepo.url);
					const repoName = repoInfo
						? repoInfo.repo
						: currentRepo.url.split("/").pop() || currentRepo.url;

					// Create result object
					const result: RepoResult = {
						repoUrl: currentRepo.url,
						repoName,
						commits: totalCommits,
						issues: totalIssues,
						prs: totalPRs,
						contributors,
						data: repoData,
					};

					analysisResults.push(result);
				} catch (error_) {
					console.error(`Error analyzing ${currentRepo.url}:`, error_);
				}
			}

			if (analysisResults.length === 0) {
				setError(
					"Failed to analyze any repositories. Please check your input or token."
				);
			} else {
				setResults(analysisResults);
				setSuccess(true);
			}
		} catch (error_) {
			setError(`Batch analysis failed: ${(error_ as Error).message}`);
			console.error(error_);
		} finally {
			setLoading(false);
		}
	};

	const handleCloseSnackbar = () => {
		setSuccess(false);
	};

	return (
		<Box>
			<Card className="rounded-lg overflow-hidden border-0">
				<CardContent className="p-6">
					<form onSubmit={handleSubmit}>
						<Typography className="font-semibold mb-6 text-gray-800 text-lg" variant="h6">
							Batch Analysis Configuration
						</Typography>

						<Box className="mb-5 relative">
							<Typography className="text-sm font-medium mb-2 text-gray-600">
								GitHub Repository URLs
							</Typography>
							<TextField
								fullWidth
								multiline
								className="mb-2"
								placeholder="Enter GitHub repository URLs (one per line)"
								rows={4}
								variant="outlined"
								value={repoUrls}
								InputLabelProps={{
									shrink: true,
								}}
								InputProps={{
									className: "rounded-md bg-white",
									sx: {
										'& fieldset': {
											borderColor: 'rgba(0,0,0,0.08)',
										},
										'&:hover fieldset': {
											borderColor: 'rgba(59, 130, 246, 0.3) !important',
										},
										'&.Mui-focused fieldset': {
											borderColor: 'rgba(59, 130, 246, 0.6) !important',
											borderWidth: '1px !important',
										},
									},
									startAdornment: (
										<InputAdornment position="start">
											<GitHubIcon color="action" sx={{ opacity: 0.6 }} />
										</InputAdornment>
									),
								}}
								onChange={(e): void => setRepoUrls(e.target.value)}
							/>
							<Typography className="text-xs text-gray-500 mt-1">
								Enter one repository URL per line (e.g., https://github.com/facebook/react)
							</Typography>
						</Box>

						<Box className="mb-5">
							<Typography className="text-sm font-medium mb-2 text-gray-600">
								GitHub Personal Access Token
							</Typography>
							<TextField
								fullWidth
								type="password"
								variant="outlined"
								value={token}
								placeholder="Enter your GitHub token"
								disabled={hasPresetToken}
								InputProps={{
									className: "rounded-md bg-white",
									sx: {
										'& fieldset': {
											borderColor: 'rgba(0,0,0,0.08)',
										},
										'&:hover fieldset': {
											borderColor: 'rgba(59, 130, 246, 0.3) !important',
										},
										'&.Mui-focused fieldset': {
											borderColor: 'rgba(59, 130, 246, 0.6) !important',
											borderWidth: '1px !important',
										},
									},
									startAdornment: (
										<InputAdornment position="start">
											<KeyIcon color="action" sx={{ opacity: 0.6 }} />
										</InputAdornment>
									),
								}}
								onChange={(e): void => setToken(e.target.value)}
							/>
							<Typography className="text-xs text-gray-500 mt-1">
								{hasPresetToken
									? "Using preset token from environment variables"
									: "Required for API access (needs repo scope permissions)"}
							</Typography>
						</Box>

						<Box className="flex justify-end mt-8">
							<Button
								className="px-6 py-2 rounded-md font-medium text-[15px] transition-all shadow-sm hover:shadow"
								color="primary"
								variant="contained"
								type="submit"
								disabled={loading}
								startIcon={
									<PlaylistAddCheckIcon
										fontSize="small"
										sx={{ marginRight: '4px' }}
									/>
								}
								sx={{
									background: 'linear-gradient(45deg, #2563eb, #4f46e5)',
									textTransform: 'none',
									'&:hover': {
										background: 'linear-gradient(45deg, #1d4ed8, #4338ca)',
									},
								}}
							>
								{loading ? (
									<>
										<CircularProgress
											size={20}
											thickness={5}
											sx={{ marginRight: '8px', color: 'white' }}
										/>
										Analyzing...
									</>
								) : (
									'Analyze Repositories'
								)}
							</Button>
						</Box>

						{error && (
							<Fade in={!!error}>
								<Alert
									className="mt-5 rounded-md font-medium text-sm shadow-sm"
									severity="error"
									onClose={(): void => setError(null)}
								>
									{error}
								</Alert>
							</Fade>
						)}
					</form>
				</CardContent>
			</Card>

			{/* Results Section */}
			{results.length > 0 && (
				<Box className="mt-8">
					<Typography className="font-semibold mb-4 text-xl text-gray-800">
						Repository Analysis Results
					</Typography>
					<BatchResults results={results} />
				</Box>
			)}

			{/* Success message */}
			<Snackbar
				open={success}
				autoHideDuration={5000}
				onClose={handleCloseSnackbar}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity="success"
					className="font-medium shadow-lg rounded-md"
				>
					Successfully analyzed repositories
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default BatchRepoForm;
