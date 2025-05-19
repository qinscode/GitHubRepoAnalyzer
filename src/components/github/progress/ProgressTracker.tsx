import React from "react";
import {
	Zoom,
	Box,
	Card,
	CardContent,
	Typography,
	LinearProgress,
	Stack,
	Chip,
	CircularProgress,
} from "@mui/material";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

interface RepoListItem {
	id: string;
	url: string;
	status: "pending" | "processing" | "completed" | "error";
	result?: any;
	error?: string;
}

interface ProgressTrackerProps {
	loading: boolean;
	repoItems: Array<RepoListItem>;
	currentIndex: number;
	progress: number;
}

const ProgressTracker = ({
	loading,
	repoItems,
	currentIndex,
	progress,
}: ProgressTrackerProps) => {
	if (!loading || repoItems.length === 0) return null;

	const getStatusColor = (status: string): any => {
		switch (status) {
			case "pending":
				return "default";
			case "processing":
				return "primary";
			case "completed":
				return "success";
			case "error":
				return "error";
			default:
				return "default";
		}
	};

	const getStatusIcon = (status: string): React.ReactNode => {
		switch (status) {
			case "pending":
				return <HourglassTopIcon fontSize="small" />;
			case "processing":
				return <CircularProgress size={16} />;
			case "completed":
				return <CheckCircleIcon fontSize="small" />;
			case "error":
				return <ErrorIcon fontSize="small" />;
			default:
				return null;
		}
	};

	return (
		<Zoom in style={{ transitionDelay: "100ms" }} timeout={500}>
			<Box className="mt-8">
				<Card className="form-card">
					<CardContent className="p-5">
						<Box className="flex justify-between items-center mb-3">
							<Typography className="font-semibold text-gray-700">
								Analysis Progress
							</Typography>
							<Typography className="text-sm text-gray-600">
								{`${currentIndex + 1} of ${repoItems.length} repositories (${progress}%)`}
							</Typography>
						</Box>

						<LinearProgress
							value={progress}
							variant="determinate"
							sx={{
								height: 8,
								borderRadius: 4,
								mb: 3,
								backgroundColor: "rgba(59, 130, 246, 0.1)",
								"& .MuiLinearProgress-bar": {
									background: "linear-gradient(45deg, #2563eb, #4f46e5)",
									borderRadius: 4,
								},
							}}
						/>

						<Stack maxHeight="200px" spacing={1} sx={{ overflowY: "auto" }}>
							{repoItems.map((repo, index) => (
								<Box
									key={repo.id}
									className={`p-2 rounded-md flex items-center justify-between ${
										index === currentIndex && repo.status === "processing"
											? "bg-blue-50"
											: repo.status === "completed"
												? "bg-green-50"
												: repo.status === "error"
													? "bg-red-50"
													: ""
									}`}
								>
									<Box className="flex items-center">
										<Box
											sx={{
												width: 24,
												mr: 1.5,
												display: "flex",
												justifyContent: "center",
											}}
										>
											{getStatusIcon(repo.status)}
										</Box>
										<Typography
											noWrap
											className="text-sm text-gray-700 font-medium"
											sx={{ maxWidth: 250 }}
										>
											{repo.url.replace("https://github.com/", "")}
										</Typography>
									</Box>
									<Chip
										className="min-w-[90px]"
										color={getStatusColor(repo.status)}
										size="small"
										sx={{ fontWeight: 500 }}
										variant="outlined"
										label={
											repo.status.charAt(0).toUpperCase() + repo.status.slice(1)
										}
									/>
								</Box>
							))}
						</Stack>
					</CardContent>
				</Card>
			</Box>
		</Zoom>
	);
};

export default ProgressTracker;
