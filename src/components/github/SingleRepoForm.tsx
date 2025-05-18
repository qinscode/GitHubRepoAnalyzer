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
import "./FormStyles.css";

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
		<Box className="form-container">
			<Grow in={true} timeout={800}>
				<Card className="form-card">
					<CardContent className="p-6">
						<form onSubmit={handleSubmit}>
							<Typography className="form-title">
								Repository Information
							</Typography>

							<Box className="mb-5 relative">
								<Typography className="form-subtitle">
									GitHub Repository URL
								</Typography>
								<TextField
									fullWidth
									placeholder="Enter repository URL (e.g., https://github.com/owner/repo)"
									value={repoUrl}
									variant="outlined"
									className="enhanced-input"
									InputProps={{
										className: "rounded-md bg-white",
										startAdornment: (
											<InputAdornment position="start">
												<div className="input-icon-container">
													<GitHubIcon color="primary" sx={{ opacity: 0.8, fontSize: "1.2rem" }} />
												</div>
											</InputAdornment>
										),
									}}
									onChange={(_error): void => {
										setRepoUrl(_error.target.value);
									}}
								/>
								<Typography className="text-xs text-gray-500 mt-2 ml-1">
									Enter URL in format https://github.com/owner/repo or simply
									owner/repo
								</Typography>
							</Box>

							<Box className="mb-5">
								<Typography className="form-subtitle">
									GitHub Personal Access Token
								</Typography>
								<TextField
									fullWidth
									disabled={false}
									placeholder="Enter your GitHub token"
									type="password"
									value={token}
									variant="outlined"
									className="enhanced-input"
									InputProps={{
										className: "rounded-md bg-white",
										startAdornment: (
											<InputAdornment position="start">
												<div className="input-icon-container">
													<KeyIcon color="primary" sx={{ opacity: 0.8, fontSize: "1.2rem" }} />
												</div>
											</InputAdornment>
										),
									}}
									onChange={(_error): void => {
										setToken(_error.target.value);
									}}
								/>
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
									{loading ? "Analyzing..." : "Analyze Repository"}
								</Button>
							</Box>
						</form>
					</CardContent>
				</Card>
			</Grow>

			{repoData && (
				<Zoom in={!!repoData} timeout={500} style={{ transitionDelay: '100ms' }}>
					<Box sx={{ mt: 4 }}>
						<RepoResults data={repoData} />
					</Box>
				</Zoom>
			)}

			<Snackbar
				autoHideDuration={5000}
				onClose={handleCloseSnackbar}
				open={success}
				TransitionComponent={Zoom}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity="success"
					className="custom-alert success"
					sx={{
						width: "100%",
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						color: "white",
						".MuiAlert-icon": {
							color: "white",
						},
					}}
				>
					Repository {extractRepoName()} analyzed successfully!
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default SingleRepoForm;
