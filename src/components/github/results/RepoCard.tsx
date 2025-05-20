import { useState, useEffect, useRef } from "react";
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
import { RepoResult } from "@/types/github";
import { RepoStats } from "./RepoStats";
import { RepoActions } from "./RepoActions";
import RepoResults from "../repo-analysis/RepoResults";
import "./RepoCard.css";

interface RepoCardProps {
	result: RepoResult;
	index: number;
}

export const RepoCard = ({ result }: RepoCardProps) => {
	const [expandedRepo, setExpandedRepo] = useState<string | null>(null);
	const theme = useTheme();
	// 不再需要跟踪上一个展开状态
	const lastExpandedRef = useRef<boolean>(false);

	const handleToggleDetails = (repoUrl: string): void => {
		// 简单地切换展开状态
		setExpandedRepo(expandedRepo === repoUrl ? null : repoUrl);
	};

	const isExpanded = expandedRepo === result.repoUrl;
	
	// 每个仓库现在都有自己的上下文，不需要重置全局状态
	useEffect(() => {
		// 更新展开状态引用
		if (isExpanded !== lastExpandedRef.current) {
			lastExpandedRef.current = isExpanded;
		}
	}, [isExpanded]);

	return (
		<Card
			className={`repo-card ${isExpanded ? "repo-card-expanded" : ""}`}
			elevation={0}
			sx={{
				borderRadius: { xs: "16px", sm: "18px", md: "20px" },
				overflow: "hidden",
				background:
					"linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.95))",
				backdropFilter: "blur(10px)",
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				border: "1px solid rgba(255, 255, 255, 0.7)",
				position: "relative",
				mb: { xs: 1.5, sm: 2, md: 2.5 },
				"&:hover": {
					transform: isExpanded ? "none" : "translateY(-5px)",
				},
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: { xs: "2px", sm: "2px", md: "3px" },
					background: "linear-gradient(90deg, #3B82F6, #4F46E5)",
					opacity: isExpanded ? 1 : 0,
					transition: "opacity 0.3s ease",
				},
			}}
		>
			<CardContent
				sx={{
					p: { xs: 1.5, sm: 2, md: 2.5 },
					"&:last-child": { pb: { xs: 1.5, sm: 2, md: 2.5 } },
				}}
			>
				<Stack
					alignItems={{ xs: "flex-start", sm: "center" }}
					direction={{ xs: "column", sm: "row" }}
					spacing={{ xs: 1, sm: 1.5, md: 2 }}
				>
					{/* Repository Info */}
					<Box
						sx={{ width: { xs: "100%", sm: "30%" }, mb: { xs: 0.5, sm: 0 } }}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Avatar
								sx={{
									width: { xs: 32, sm: 36, md: 42 },
									height: { xs: 32, sm: 36, md: 42 },
									mr: { xs: 1, sm: 1.25, md: 1.5 },
									background: "linear-gradient(135deg, #3b82f6, #6366f1)",
									fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
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
										fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										maxWidth: { xs: "180px", sm: "150px", md: "220px" },
									}}
								>
									{result.repoName.split("/")[1] || result.repoName}
								</Typography>
								<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
									<GitHubIcon
										sx={{
											fontSize: { xs: 12, sm: 13, md: 14 },
											color: "text.secondary",
										}}
									/>
									<Typography
										variant="body2"
										sx={{
											color: "text.secondary",
											fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
											maxWidth: { xs: "170px", sm: "140px", md: "210px" },
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
					<Divider sx={{ my: { xs: 1.5, sm: 1.75, md: 2 }, opacity: 0.6 }} />
					<Box
						sx={{
							backgroundColor: alpha(theme.palette.primary.main, 0.02),
							backgroundImage:
								"radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.04) 2%, transparent 12%), radial-gradient(circle at 75px 75px, rgba(79, 70, 229, 0.03) 2%, transparent 12%)",
							backgroundSize: {
								xs: "70px 70px",
								sm: "85px 85px",
								md: "100px 100px",
							},
							borderRadius: { xs: "6px", sm: "7px", md: "8px" },
							p: { xs: 1.25, sm: 1.5, md: 2 },
						}}
					>
						<RepoResults data={result.data} />
					</Box>
				</Collapse>
			</CardContent>
		</Card>
	);
};
