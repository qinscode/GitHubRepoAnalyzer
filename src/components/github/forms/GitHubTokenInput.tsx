import {
	Box,
	TextField,
	Typography,
	InputAdornment,
	Button,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

interface GitHubTokenInputProps {
	token: string;
	onTokenChange: (token: string) => void;
	onTokenSave: (token: string) => void;
	onTokenDelete: () => void;
	hasSavedToken: boolean;
	hasPresetToken: boolean;
	rateLimitRemaining: number | null;
	rateLimitResetAt: number | null;
	rateLimitLoading: boolean;
}

const GitHubTokenInput = ({
	token,
	onTokenChange,
	onTokenSave,
	onTokenDelete,
	hasSavedToken,
	rateLimitRemaining,
	rateLimitResetAt,
	rateLimitLoading,
}: GitHubTokenInputProps) => {
	const getResetCountdownText = (): string => {
		if (rateLimitResetAt === null) {
			return "resets soon";
		}

		const nowInSeconds = Math.floor(Date.now() / 1000);
		const remainingSeconds = Math.max(0, rateLimitResetAt - nowInSeconds);
		const remainingMinutes = Math.ceil(remainingSeconds / 60);

		return `resets in ${remainingMinutes}m`;
	};

	const renderRateLimitCounter = (): string => {
		if (!token.trim()) {
			return "Hourly calls remaining: —";
		}

		if (rateLimitLoading) {
			return "Hourly calls remaining: loading...";
		}

		if (rateLimitRemaining === null) {
			return "Hourly calls remaining: unavailable";
		}

		return `Hourly calls remaining: ${rateLimitRemaining} • ${getResetCountdownText()}`;
	};

	return (
		<Box className="mb-5">
			<Typography className="form-subtitle" sx={{ cursor: "default" }}>
				GitHub Personal Access Token
			</Typography>
			<TextField
				fullWidth
				className="enhanced-input"
				disabled={false}
				placeholder="Enter your GitHub token"
				type="password"
				value={token}
				variant="outlined"
				InputProps={{
					className: "rounded-md bg-white",
					startAdornment: (
						<InputAdornment position="start">
							<div className="input-icon-container">
								<KeyIcon
									color="primary"
									sx={{ opacity: 0.8, fontSize: "1.2rem" }}
								/>
							</div>
						</InputAdornment>
					),
				}}
				onChange={(event) => {
					onTokenChange(event.target.value);
				}}
			/>
			<Typography
				className="text-xs text-gray-500 mt-2 ml-1 mb-2"
				sx={{ cursor: "default" }}
			>
				{hasSavedToken && "Token loaded from browser storage"}
			</Typography>

			<Box sx={{ display: "flex", gap: 3, mt: 2 }}>
				<Typography
					className="text-xs text-gray-500"
					sx={{
						display: "flex",
						alignItems: "center",
						whiteSpace: "nowrap",
					}}
				>
					{renderRateLimitCounter()}
				</Typography>
				<Button
					className="submit-button"
					color="primary"
					size="small"
					startIcon={<SaveIcon />}
					variant="contained"
					onClick={() => {
						onTokenSave(token);
					}}
				>
					Save Token
				</Button>
				{hasSavedToken && (
					<Button
						className="submit-button"
						color="error"
						size="small"
						startIcon={<DeleteIcon />}
						variant="contained"
						onClick={onTokenDelete}
					>
						Delete Token
					</Button>
				)}
			</Box>
		</Box>
	);
};

export default GitHubTokenInput;
