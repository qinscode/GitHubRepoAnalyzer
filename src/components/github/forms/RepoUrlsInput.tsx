import {
	Box,
	TextField,
	Typography,
	InputAdornment,
	Button,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

interface RepoUrlsInputProps {
	repoUrls: string;
	onRepoUrlsChange: (repoUrls: string) => void;
	onRepoUrlsSave: () => void;
	onRepoUrlsDelete: () => void;
	hasSavedUrls: boolean;
}

const RepoUrlsInput = ({
	repoUrls,
	onRepoUrlsChange,
	onRepoUrlsSave,
	onRepoUrlsDelete,
	hasSavedUrls,
}: RepoUrlsInputProps) => {
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

			<Box sx={{ display: "flex", gap: 1, mt: 2 }}>
				<Button
					className="submit-button"
					color="primary"
					size="small"
					startIcon={<SaveIcon />}
					variant="contained"
					onClick={onRepoUrlsSave}
				>
					Save URLs
				</Button>
				{hasSavedUrls && (
					<Button
						className="submit-button"
						color="error"
						size="small"
						startIcon={<DeleteIcon />}
						variant="contained"
						onClick={onRepoUrlsDelete}
					>
						Delete URLs
					</Button>
				)}
			</Box>
		</Box>
	);
};

export default RepoUrlsInput;
