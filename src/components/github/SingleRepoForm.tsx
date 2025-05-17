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
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import SearchIcon from "@mui/icons-material/Search";
import KeyIcon from "@mui/icons-material/Key";
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

	const handleSubmit = async (_error: React.FormEvent): Promise<void> => {
		_error.preventDefault();

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

	const handleCloseSnackbar = (): void => {
		setSuccess(false);
	};

	const extractRepoName = (): string => {
		if (!repoUrl) return "";

		const repoInfo = parseRepoUrl(repoUrl);
		if (repoInfo) {
			return `${repoInfo.owner}/${repoInfo.repo}`;
		}

		return repoUrl;
	};

	return (
		<Box>
			<Card className="rounded-lg overflow-hidden border-0">
				<CardContent className="p-6">
					<form onSubmit={handleSubmit}>
						<Typography
							className="font-semibold mb-6 text-gray-800 text-lg"
							variant="h6"
						>
							Repository Information
						</Typography>

						<Box className="mb-5 relative">
							<Typography className="text-sm font-medium mb-2 text-gray-600">
								GitHub Repository URL
							</Typography>
							<TextField
								fullWidth
								placeholder="Enter repository URL (e.g., https://github.com/owner/repo)"
								value={repoUrl}
								variant="outlined"
								InputProps={{
									className: "rounded-md bg-white",
									sx: {
										"& fieldset": {
											borderColor: "rgba(0,0,0,0.08)",
										},
										"&:hover fieldset": {
											borderColor: "rgba(59, 130, 246, 0.3) !important",
										},
										"&.Mui-focused fieldset": {
											borderColor: "rgba(59, 130, 246, 0.6) !important",
											borderWidth: "1px !important",
										},
									},
									startAdornment: (
										<InputAdornment position="start">
											<GitHubIcon color="action" sx={{ opacity: 0.6 }} />
										</InputAdornment>
									),
								}}
								onChange={(_error): void => {
									setRepoUrl(_error.target.value);
								}}
							/>
							<Typography className="text-xs text-gray-500 mt-1">
								Enter URL in format https://github.com/owner/repo or simply
								owner/repo
							</Typography>
						</Box>

						<Box className="mb-5">
							<Typography className="text-sm font-medium mb-2 text-gray-600">
								GitHub Personal Access Token
							</Typography>
							<TextField
								fullWidth
								disabled={false}
								placeholder="Enter your GitHub token"
								type="password"
								value={token}
								variant="outlined"
								InputProps={{
									className: "rounded-md bg-white",
									sx: {
										"& fieldset": {
											borderColor: "rgba(0,0,0,0.08)",
										},
										"&:hover fieldset": {
											borderColor: "rgba(59, 130, 246, 0.3) !important",
										},
										"&.Mui-focused fieldset": {
											borderColor: "rgba(59, 130, 246, 0.6) !important",
											borderWidth: "1px !important",
										},
									},
									startAdornment: (
										<InputAdornment position="start">
											<KeyIcon color="action" sx={{ opacity: 0.6 }} />
										</InputAdornment>
									),
								}}
								onChange={(_error): void => {
									setToken(_error.target.value);
								}}
							/>
						</Box>

						<Box className="flex justify-end mt-8">
							<Button
								className="px-6 py-2 rounded-md font-medium text-[15px] transition-all shadow-sm hover:shadow"
								color="primary"
								disabled={loading}
								type="submit"
								variant="contained"
								startIcon={
									<SearchIcon fontSize="small" sx={{ marginRight: "4px" }} />
								}
								sx={{
									background: "linear-gradient(45deg, #2563eb, #4f46e5)",
									textTransform: "none",
									"&:hover": {
										background: "linear-gradient(45deg, #1d4ed8, #4338ca)",
									},
								}}
							>
								{loading ? (
									<>
										<CircularProgress
											size={20}
											sx={{ marginRight: "8px", color: "white" }}
											thickness={5}
										/>
										Analyzing...
									</>
								) : (
									"Analyze Repository"
								)}
							</Button>
						</Box>

						{error && (
							<Fade in={!!error}>
								<Alert
									className="mt-5 rounded-md font-medium text-sm shadow-sm"
									severity="error"
									onClose={(): void => {
										setError(null);
									}}
								>
									{error}
								</Alert>
							</Fade>
						)}
					</form>
				</CardContent>
			</Card>

			{/* Success message */}
			<Snackbar
				autoHideDuration={5000}
				open={success}
				onClose={handleCloseSnackbar}
			>
				<Alert
					className="font-medium shadow-lg rounded-md"
					severity="success"
					onClose={handleCloseSnackbar}
				>
					Successfully analyzed repository
				</Alert>
			</Snackbar>

			{/* Results Section */}
			{repoData && (
				<Box className="mt-8">
					<Typography className="font-semibold mb-4 text-xl text-gray-800">
						Analysis Results:{" "}
						<span className="text-blue-600">{extractRepoName()}</span>
					</Typography>
					<RepoResults data={repoData} />
				</Box>
			)}
		</Box>
	);
};

export default SingleRepoForm;
