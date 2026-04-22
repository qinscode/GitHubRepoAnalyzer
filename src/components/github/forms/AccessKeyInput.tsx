import {
	Box,
	TextField,
	Typography,
	InputAdornment,
	Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

interface AccessKeyInputProps {
	accessKey: string;
	hasSavedAccessKey: boolean;
	onAccessKeyChange: (value: string) => void;
	onAccessKeySave: () => void;
	onAccessKeyDelete: () => void;
}

const AccessKeyInput = ({
	accessKey,
	hasSavedAccessKey,
	onAccessKeyChange,
	onAccessKeySave,
	onAccessKeyDelete,
}: AccessKeyInputProps) => {
	return (
		<Box className="mb-5">
			<Typography className="form-subtitle" sx={{ cursor: "default" }}>
				Access Key
			</Typography>
			<TextField
				fullWidth
				className="enhanced-input"
				placeholder="Enter access key"
				type="password"
				value={accessKey}
				variant="outlined"
				InputProps={{
					className: "rounded-md bg-white",
					startAdornment: (
						<InputAdornment position="start">
							<div className="input-icon-container">
								<LockOutlinedIcon
									color="primary"
									sx={{ opacity: 0.8, fontSize: "1.2rem" }}
								/>
							</div>
						</InputAdornment>
					),
				}}
				onChange={(event) => {
					onAccessKeyChange(event.target.value);
				}}
			/>
			<Typography
				className="text-xs text-gray-500 mt-2 ml-1 mb-2"
				sx={{ cursor: "default" }}
			>
				{hasSavedAccessKey && "Access key loaded from browser storage"}
			</Typography>

			<Box sx={{ display: "flex", gap: 3, mt: 2 }}>
				<Button
					className="submit-button"
					color="primary"
					size="small"
					startIcon={<SaveIcon />}
					variant="contained"
					onClick={onAccessKeySave}
				>
					Save Key
				</Button>
				{hasSavedAccessKey && (
					<Button
						className="submit-button"
						color="error"
						size="small"
						startIcon={<DeleteIcon />}
						variant="contained"
						onClick={onAccessKeyDelete}
					>
						Delete Key
					</Button>
				)}
			</Box>
		</Box>
	);
};

export default AccessKeyInput;
