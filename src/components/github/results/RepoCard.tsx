import { useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Avatar,
	Stack,
	Collapse,
	Divider,
	alpha,
	useTheme,
} from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import { RepoResult } from "../../../types/github";
import { RepoStats } from "./RepoStats";
import { RepoActions } from "./RepoActions";
import RepoResults from "../repo-analysis/RepoResults";

interface RepoCardProps {
	result: RepoResult;
	index: number;
}

export const RepoCard = ({ result }: RepoCardProps): JSX.Element => {
	const [expandedRepo, setExpandedRepo] = useState<string | null>(null);
	const theme = useTheme();

	const handleToggleDetails = (repoUrl: string): void => {
		setExpandedRepo(expandedRepo === repoUrl ? null : repoUrl);
	};

	return (
		<Card
			elevation={1}
			sx={{
				borderRadius: "12px",
				overflow: "hidden",
				background:
					"linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.95))",
				backdropFilter: "blur(10px)",
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				borderLeft: "1px solid rgba(59, 130, 246, 0.2)",
				borderTop: "1px solid rgba(255, 255, 255, 0.7)",
				boxShadow:
					expandedRepo === result.repoUrl
						? "0 15px 20px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
						: "0 2px 5px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)",
				"&:hover": {
					transform:
						expandedRepo === result.repoUrl ? "none" : "translateY(-3px)",
					boxShadow:
						"0 10px 15px -5px rgba(59, 130, 246, 0.08), 0 5px 10px -5px rgba(59, 130, 246, 0.05)",
				},
				position: "relative",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "3px",
					background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
					opacity: expandedRepo === result.repoUrl ? 1 : 0,
					transition: "opacity 0.3s ease",
				},
			}}
		>
			<CardContent sx={{ p: 2.5 }}>
				<Stack
					alignItems={{ xs: "flex-start", sm: "center" }}
					direction={{ xs: "column", sm: "row" }}
					spacing={2}
				>
					{/* Repository Info */}
					<Box sx={{ width: { xs: "100%", sm: "30%" }, mb: { xs: 1, sm: 0 } }}>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Avatar
								sx={{
									width: 42,
									height: 42,
									mr: 1.5,
									background: "linear-gradient(135deg, #3b82f6, #6366f1)",
									fontSize: "1rem",
									fontWeight: "bold",
									boxShadow: "0 3px 5px rgba(59, 130, 246, 0.25)",
									transition: "all 0.3s ease",
									"&:hover": {
										transform: "scale(1.05)",
										boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)",
									},
								}}
							>
								{result.repoName.charAt(0).toUpperCase()}
							</Avatar>
							<Box sx={{ overflow: "hidden" }}>
								<Typography
									variant="h6"
									sx={{
										fontWeight: 700,
										color: "text.primary",
										lineHeight: 1.3,
										fontSize: "1rem",
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										maxWidth: { xs: "200px", sm: "160px", md: "220px" },
									}}
								>
									{result.repoName.split("/")[1] || result.repoName}
								</Typography>
								<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
									<GitHubIcon sx={{ fontSize: 14, color: "text.secondary" }} />
									<Typography
										variant="body2"
										sx={{
											color: "text.secondary",
											fontSize: "0.8rem",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
											maxWidth: { xs: "190px", sm: "150px", md: "210px" },
										}}
									>
										{result.repoName}
									</Typography>
								</Box>
							</Box>
						</Box>
					</Box>

					{/* Stats */}
					<RepoStats result={result} />

					{/* Actions */}
					<RepoActions
						expandedRepo={expandedRepo}
						result={result}
						onToggleDetails={handleToggleDetails}
					/>
				</Stack>

				{/* Repository Details */}
				<Collapse
					unmountOnExit
					in={expandedRepo === result.repoUrl}
					timeout="auto"
				>
					<Divider sx={{ my: 2, opacity: 0.6 }} />
					<Box
						sx={{
							backgroundColor: alpha(theme.palette.primary.main, 0.02),
							backgroundImage:
								"radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.04) 2%, transparent 12%), radial-gradient(circle at 75px 75px, rgba(79, 70, 229, 0.03) 2%, transparent 12%)",
							backgroundSize: "100px 100px",
							borderRadius: "8px",
							p: 2,
						}}
					>
						<RepoResults data={result.data} />
					</Box>
				</Collapse>
			</CardContent>
		</Card>
	);
};
