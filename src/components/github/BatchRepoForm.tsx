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
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
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
			<Paper
				className="p-6 bg-white/50 rounded-xl border border-gray-100 !border-0"
				elevation={0}
			>
				<form onSubmit={handleSubmit}>
					<Typography className="font-bold mb-4 text-gray-800" variant="h6">
						Batch Analysis Configuration
					</Typography>

					<TextField
						fullWidth
						multiline
						className="mb-4"
						label="GitHub Repository URLs"
						rows={4}
						size="medium"
						value={repoUrls}
						variant="outlined"
						InputLabelProps={{
							shrink: true,
							className: "bg-white px-1",
						}}
						InputProps={{
							className: "rounded-lg bg-white shadow-sm",
						}}
						placeholder={`Enter each repository URL per line, e.g.:
https://github.com/owner/repo
https://github.com/owner/repo2`}
						onChange={(e) => {
							setRepoUrls(e.target.value);
						}}
					/>

					<TextField
						fullWidth
						className="mb-2"
						label="GitHub Token"
						margin="normal"
						placeholder="Enter your GitHub personal access token"
						type="password"
						value={token}
						variant="outlined"
						InputProps={{
							className: "rounded-lg bg-white shadow-sm",
						}}
						helperText={
							hasPresetToken
								? "Use preset token, you can modify it"
								: "Token is required for repo access"
						}
						onChange={(e) => {
							setToken(e.target.value);
						}}
					/>

					{error && (
						<Alert className="mt-4 mb-4 rounded-lg" severity="error">
							{error.split("\n").map((line, index) => (
								<div key={index}>{line}</div>
							))}
						</Alert>
					)}

					<Box className="mt-6 flex justify-center">
						<Button
							className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
							disabled={loading}
							size="large"
							type="submit"
							variant="contained"
							startIcon={
								loading ? (
									<CircularProgress color="inherit" size={20} />
								) : (
									<PlaylistAddCheckIcon />
								)
							}
						>
							{loading ? "Analyzing..." : "Analyze Repositories"}
						</Button>
					</Box>
				</form>
			</Paper>

			<Snackbar
				autoHideDuration={6000}
				open={success}
				onClose={handleCloseSnackbar}
			>
				<Alert
					className="rounded-lg shadow-lg"
					severity="success"
					onClose={handleCloseSnackbar}
				>
					Batch analysis completed!
				</Alert>
			</Snackbar>

			{results.length > 0 && (
				<>
					<Divider className="my-8" />
					<Typography className="mb-6 font-bold text-gray-800" variant="h5">
						Batch Analysis Results
					</Typography>
					<BatchResults results={results} />
				</>
			)}
		</Box>
	);
};

export default BatchRepoForm;
