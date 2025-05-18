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
	FormControlLabel,
	Switch,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import SearchIcon from "@mui/icons-material/Search";
import KeyIcon from "@mui/icons-material/Key";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { fetchRepositoryData } from "../../services/githubGraphQLService";
import "./FormStyles.css";

interface SingleRepoFormProps {
	onDataFetched: (data: any, repoUrl: string) => void;
}

const SingleRepoForm: React.FC<SingleRepoFormProps> = ({ onDataFetched }) => {
	// Form state
	const [repoUrl, setRepoUrl] = useState<string>("");
	const [token, setToken] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [hideMergeCommits, setHideMergeCommits] = useState<boolean>(false);

	// Get the preset GitHub token from environment variables
	useEffect(() => {
		const presetToken = import.meta.env["VITE_GITHUB_API_TOKEN"];
		if (presetToken) {
			setToken(presetToken);
		}
	}, []);

	// Check if there's a preset token
	const hasPresetToken = !!import.meta.env["VITE_GITHUB_API_TOKEN"];

	const handleSubmit = async (event: React.FormEvent): Promise<void> => {
		event.preventDefault();

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
		setSuccess(false);

		try {
			// Use GraphQL service to fetch repository data with filtering option
			const data = await fetchRepositoryData(repoUrl, token, { hideMergeCommits });
			onDataFetched(data, repoUrl);
			setSuccess(true);

			// Reset form
			setRepoUrl("");
		} catch (error_) {
			const errorMessage = (error_ as Error).message;
			// Make error messages more specific and user-friendly
			if (errorMessage.includes("Invalid repository URL format")) {
				setError(`Repository format error: ${errorMessage}`);
			} else if (errorMessage.includes("404")) {
				setError("Repository not found. Please check the URL and try again.");
			} else if (errorMessage.includes("401") || errorMessage.includes("403")) {
				setError("Authentication error: Invalid or expired GitHub token.");
			} else {
				setError(`Repository analysis failed: ${errorMessage}`);
			}
			console.error(error_);
		} finally {
			setLoading(false);
		}
	};

	const clearForm = (): void => {
		setRepoUrl("");
		setError(null);
		setSuccess(false);
	};

	return (
		<Grow in timeout={500}>
			<Card className="form-card" elevation={0}>
				<CardContent sx={{ p: 3 }}>
					<Typography gutterBottom className="form-title" variant="h5">
						Analyze Single Repository
					</Typography>

					<Box
						className="form-container"
						component="form"
						onSubmit={handleSubmit}
					>
						<Box sx={{ position: "relative", mb: 3 }}>
							<TextField
								fullWidth
								className="enhanced-input"
								disabled={loading}
								error={!!error && error.includes("repository")}
								label="GitHub Repository"
								placeholder="Enter repository URL or owner/repo (e.g. facebook/react)"
								value={repoUrl}
								variant="outlined"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Box className="input-icon-container">
												<GitHubIcon sx={{ color: "#3B82F6" }} />
											</Box>
										</InputAdornment>
									),
									endAdornment: loading && (
										<InputAdornment position="end">
											<CircularProgress size={20} />
										</InputAdornment>
									),
								}}
								helperText={
									error && error.includes("repository")
										? error
										: "Repository URL or owner/repo format"
								}
								onChange={(event_) => {
									setRepoUrl(event_.target.value);
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

						<Box sx={{ 
							display: "flex", 
							justifyContent: "flex-start", 
							alignItems: "center", 
							mt: 2, 
							mb: 2,
							p: 1.5,
							bgcolor: "rgba(59, 130, 246, 0.05)",
							borderRadius: "8px",
							border: "1px solid rgba(59, 130, 246, 0.1)"
						}}>
							<Typography 
								variant="body2" 
								sx={{ 
									fontWeight: 500, 
									fontSize: "0.85rem", 
									color: "text.secondary", 
									display: "flex", 
									alignItems: "center" 
								}}
							>
								<PlaylistAddCheckIcon 
									sx={{ 
										mr: 1, 
										color: "primary.main", 
										fontSize: "1.1rem" 
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
											onChange={(event_) => { setHideMergeCommits(event_.target.checked); }}
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
								{loading ? "Analyzing Repository..." : "Analyze Repository"}
							</Button>

							{(error || success) && (
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
									sx={{ mt: 2 }}
								>
									{error}
								</Alert>
							</Zoom>
						)}

						{success && (
							<Zoom in={success} timeout={300}>
								<Alert
									className="custom-alert success"
									icon={<CheckCircleIcon />}
									severity="success"
									sx={{ mt: 2 }}
								>
									Repository analyzed successfully!
								</Alert>
							</Zoom>
						)}
					</Box>
				</CardContent>
			</Card>
		</Grow>
	);
};

export default SingleRepoForm;
