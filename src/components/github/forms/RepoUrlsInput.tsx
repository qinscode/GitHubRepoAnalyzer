import {
	Box,
	TextField,
	Typography,
	InputAdornment,
	Switch,
	FormControlLabel,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useEffect } from "react";

interface RepoUrlsInputProps {
	repoUrls: string;
	onRepoUrlsChange: (repoUrls: string) => void;
	autoSave: boolean;
	onAutoSaveChange: (autoSave: boolean) => void;
	hasSavedUrls: boolean;
}

const RepoUrlsInput = ({
	repoUrls,
	onRepoUrlsChange,
	autoSave,
	onAutoSaveChange,
	hasSavedUrls,
}: RepoUrlsInputProps) => {
	// Effect for auto-saving when autoSave is enabled
	useEffect(() => {
		if (autoSave && repoUrls) {
			// Save URLs to local storage when autoSave is enabled and repoUrls changes
			localStorage.setItem("githubRepoUrls", repoUrls);
		}
	}, [repoUrls, autoSave]);

	// Handle autoSave toggle
	const handleAutoSaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newAutoSaveValue = event.target.checked;
		onAutoSaveChange(newAutoSaveValue);

		// If turning on autoSave, immediately save current URLs
		if (newAutoSaveValue && repoUrls) {
			localStorage.setItem("githubRepoUrls", repoUrls);
		}
	};

	return (
		<Box className="mb-5 relative">
			<Typography className="form-subtitle">GitHub Repository URLs</Typography>
			<TextField
				fullWidth
				multiline
				className="enhanced-input"
				placeholder="Enter GitHub repository URLs (one per line)"
				rows={4}
				value={repoUrls}
				variant="outlined"
				InputProps={{
					className: "rounded-md bg-white",
					startAdornment: (
						<InputAdornment position="start">
							<div className="input-icon-container">
								<GitHubIcon
									color="primary"
									sx={{ opacity: 0.8, fontSize: "1.2rem" }}
								/>
							</div>
						</InputAdornment>
					),
				}}
				onChange={(event) => {
					onRepoUrlsChange(event.target.value);
				}}
			/>
			<Typography className="text-xs text-gray-500 mt-2 ml-1 mb-2">
				{hasSavedUrls && "URLs loaded from browser storage"}
			</Typography>

			<Box sx={{ mt: 2 }}>
				<FormControlLabel
					label="Auto-save URLs"
					control={
						<Switch
							checked={autoSave}
							color="primary"
							onChange={handleAutoSaveChange}
						/>
					}
				/>
			</Box>
		</Box>
	);
};

export default RepoUrlsInput;
