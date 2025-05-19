import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Alert, Zoom } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import type { FormActionsProps } from "@/types/github";

const FormActions: React.FC<FormActionsProps> = ({
	error,
	loading,
	onClear,
	repoItemsLength,
	success,
}) => {
	const [showError, setShowError] = useState(!!error);
	const [showSuccess, setShowSuccess] = useState(!!success);

	// Update show states when props change
	useEffect(() => {
		setShowError(!!error);
		setShowSuccess(!!success);
	}, [error, success]);

	const handleCloseError = (): void => {
		setShowError(false);
	};

	const handleCloseSuccess = (): void => {
		setShowSuccess(false);
	};

	return (
		<>
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
					{loading ? "Analyzing Repositories..." : "Analyze Repositories"}
				</Button>

				{(error || success || repoItemsLength > 0) && (
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
						onClick={onClear}
					>
						Clear
					</Button>
				)}
			</Box>

			{error && showError && (
				<Zoom in={!!error && showError} timeout={300}>
					<Alert
						className="custom-alert error"
						icon={<ErrorIcon />}
						severity="error"
						sx={{ mt: 3 }}
						onClose={handleCloseError}
					>
						{error}
					</Alert>
				</Zoom>
			)}

			{success && !error && showSuccess && (
				<Zoom in={success && showSuccess} timeout={300}>
					<Alert
						className="custom-alert success"
						icon={<CheckCircleIcon />}
						severity="success"
						sx={{ mt: 3 }}
						onClose={handleCloseSuccess}
					>
						Successfully analyzed {repoItemsLength} repositories!
					</Alert>
				</Zoom>
			)}
		</>
	);
};

export default FormActions;
