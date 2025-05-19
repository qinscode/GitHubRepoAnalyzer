import type React from "react";
import { Box, Typography, Chip, CircularProgress } from "@mui/material";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import type { RepoStatusItemProps, RepoStatus } from "@/types/github";

const RepoStatusItem: React.FC<RepoStatusItemProps> = ({
	extractRepoName,
	item,
}) => {
	const getStatusColor = (status: RepoStatus): string => {
		switch (status) {
			case "pending":
				return "rgba(107, 114, 128, 0.7)";
			case "processing":
				return "#3B82F6";
			case "completed":
				return "#10B981";
			case "error":
				return "#EF4444";
			default:
				return "rgba(107, 114, 128, 0.7)";
		}
	};

	const getStatusIcon = (status: RepoStatus) => {
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
				return <HourglassTopIcon fontSize="small" />;
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				p: 1,
				borderRadius: "8px",
				backgroundColor: "rgba(255, 255, 255, 0.8)",
				border: "1px solid rgba(0, 0, 0, 0.04)",
				transition: "all 0.3s ease",
				"&:hover": {
					backgroundColor: "rgba(255, 255, 255, 0.95)",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
				},
			}}
		>
			<Typography
				variant="body2"
				sx={{
					fontWeight: item.status === "processing" ? 600 : 400,
					color: item.status === "error" ? "error.main" : "text.primary",
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					maxWidth: "70%",
				}}
			>
				{extractRepoName(item.url)}
			</Typography>
			<Chip
				icon={getStatusIcon(item.status)}
				label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
				size="small"
				sx={{
					backgroundColor: `${getStatusColor(item.status)}20`,
					color: getStatusColor(item.status),
					borderRadius: "8px",
					"& .MuiChip-icon": {
						color: "inherit",
					},
				}}
			/>
		</Box>
	);
};

export default RepoStatusItem;
