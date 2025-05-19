import type React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import type { ProcessingProgressProps } from "@/types/github";

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
	currentIndex,
	loading,
	progress,
	repoItemsLength,
}) => {
	if (!loading || currentIndex < 0) return null;

	return (
		<Box sx={{ mb: 3 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					mb: 1,
				}}
			>
				<Typography color="text.secondary" variant="body2">
					Processing repository {currentIndex + 1} of {repoItemsLength}
				</Typography>
				<Typography color="text.secondary" variant="body2">
					{Math.round(progress)}%
				</Typography>
			</Box>
			<LinearProgress
				value={progress}
				variant="determinate"
				sx={{
					height: 8,
					borderRadius: 4,
					backgroundColor: "rgba(59, 130, 246, 0.1)",
					"& .MuiLinearProgress-bar": {
						background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
						borderRadius: 4,
					},
				}}
			/>
		</Box>
	);
};

export default ProcessingProgress;
