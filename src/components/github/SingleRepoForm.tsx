import { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Button,
	Alert,
	CircularProgress,
	Typography,
	InputAdornment,
	Paper,
	Divider,
	Snackbar,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import SearchIcon from "@mui/icons-material/Search";
import type { FunctionComponent } from "../../common/types";
import RepoResults from "./RepoResults";
import {
	fetchRepositoryData,
	parseRepoUrl,
} from "../../services/githubGraphQLService";

interface RepoData {
	commits: Record<string, Array<{ message: string; id: string }>>;
	issues: Record<string, Array<{ title: string; body: string }>>;
	prs: Record<string, Array<{ title: string }>>;
	teamwork: {
		issueComments: Record<string, number>;
		prReviews: Record<string, number>;
	};
}

const SingleRepoForm = (): FunctionComponent => {
	const [repoUrl, setRepoUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [repoData, setRepoData] = useState<RepoData | null>(null);
	const [token, setToken] = useState<string>("");

	// Get the preset GitHub token from environment variables
	useEffect(() => {
		const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
		if (presetToken) {
			setToken(presetToken);
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!repoUrl.trim()) {
			setError("Please enter a GitHub repository URL or owner/repo format");
			return;
		}

		if (!token.trim()) {
			setError("Please enter a GitHub token");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// Use GraphQL service to fetch repository data
			const data = await fetchRepositoryData(repoUrl, token);
			setRepoData(data);
			setSuccess(true);
		} catch (error_) {
			setError(`Repository analysis failed: ${(error_ as Error).message}`);
			console.error(error_);
		} finally {
			setLoading(false);
		}
	};

	const handleCloseSnackbar = () => {
		setSuccess(false);
	};

	const extractRepoName = () => {
		if (!repoUrl) return "";

		const repoInfo = parseRepoUrl(repoUrl);
		if (repoInfo) {
			return `${repoInfo.owner}/${repoInfo.repo}`;
		}

		return repoUrl;
	};

	// Check if there's a preset token in environment variables
	const hasPresetToken = !!import.meta.env["VITE_GITHUB_API_TOKEN"];

	return (
		<Box>
			<Paper
				className="p-6 bg-white/50 rounded-xl border border-gray-100 !border-0"
				elevation={0}
			>
				<form onSubmit={handleSubmit}>
					<Typography className="font-bold mb-4 text-gray-800" variant="h6">
						Repository Information
					</Typography>

					<TextField
						fullWidth
						className="mb-4"
						label="GitHub Repository"
						margin="normal"
						placeholder="Example: https://github.com/owner/repo or owner/repo"
						value={repoUrl}
						variant="outlined"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<GitHubIcon color="action" />
								</InputAdornment>
							),
							className: "rounded-lg bg-white shadow-sm",
						}}
						onChange={(e) => {
							setRepoUrl(e.target.value);
						}}
					/>

					<TextField
						fullWidth
						className="mb-2"
						helperText={
							hasPresetToken
								? "Using preset token, you can modify it"
								: "Token needs repo access permission"
						}
						label="GitHub Token"
						margin="normal"
						placeholder="Enter your GitHub personal access token"
						type="password"
						value={token}
						variant="outlined"
						InputProps={{
							className: "rounded-lg bg-white shadow-sm",
						}}
						onChange={(e) => {
							setToken(e.target.value);
						}}
					/>

					{error && (
						<Alert className="mt-4 rounded-lg" severity="error">
							{error}
						</Alert>
					)}

					<Box className="mt-6 flex justify-center">
						<Button
							className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
							disabled={loading}
							size="large"
							startIcon={
								loading ? (
									<CircularProgress color="inherit" size={20} />
								) : (
									<SearchIcon />
								)
							}
							type="submit"
							variant="contained"
						>
							{loading ? "Analyzing..." : "Analyze Repository"}
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
					Repository analysis successful!
				</Alert>
			</Snackbar>

			{repoData && (
				<>
					<Divider className="my-8" />
					<Typography className="mb-6 font-bold text-gray-800" variant="h5">
						Analysis Results:{" "}
						<span className="text-blue-600">{extractRepoName()}</span>
					</Typography>
					<RepoResults data={repoData} />
				</>
			)}
		</Box>
	);
};

export default SingleRepoForm;
