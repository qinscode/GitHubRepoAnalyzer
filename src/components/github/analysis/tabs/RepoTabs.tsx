import { Box, Grow } from "@mui/material";
import "@/styles/FormStyles.css";

const RepoTabs = () => {
	return (
		<Grow in timeout={700}>
			<Box className="tab-container">
				{/*<Box*/}
				{/*	sx={{*/}
				{/*		padding: "1.75rem",*/}
				{/*		background:*/}
				{/*			"linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",*/}
				{/*		borderBottom: "1px solid rgba(0, 0, 0, 0.04)",*/}
				{/*		position: "relative",*/}
				{/*		overflow: "hidden",*/}
				{/*	}}*/}
				{/*>*/}
				{/*	<Box*/}
				{/*		className="shine-effect"*/}
				{/*		sx={{*/}
				{/*			display: "flex",*/}
				{/*			alignItems: "center",*/}
				{/*			gap: 2,*/}
				{/*			position: "relative",*/}
				{/*			zIndex: 2,*/}
				{/*		}}*/}
				{/*	>*/}
				{/*		<Box*/}
				{/*			sx={{*/}
				{/*				display: "flex",*/}
				{/*				alignItems: "center",*/}
				{/*				justifyContent: "center",*/}
				{/*				width: 40,*/}
				{/*				height: 40,*/}
				{/*				borderRadius: "50%",*/}
				{/*				background: "linear-gradient(135deg, #3B82F6, #4F46E5)",*/}
				{/*				boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.2)",*/}
				{/*			}}*/}
				{/*		>*/}
				{/*			<GitHubIcon sx={{ color: "white", fontSize: "1.4rem" }} />*/}
				{/*		</Box>*/}
				{/*		<Box>*/}
				{/*			<Typography*/}
				{/*				className="text-2xl font-bold text-gray-800 mb-1"*/}
				{/*				variant="h1"*/}
				{/*				sx={{*/}
				{/*					fontSize: "1.5rem !important",*/}
				{/*					fontWeight: "700 !important",*/}
				{/*					background: "linear-gradient(90deg, #1E40AF, #3B82F6)",*/}
				{/*					WebkitBackgroundClip: "text",*/}
				{/*					WebkitTextFillColor: "transparent",*/}
				{/*					letterSpacing: "-0.01em",*/}
				{/*				}}*/}
				{/*			>*/}
				{/*				GitHub Repository Analysis1*/}
				{/*			</Typography>*/}
				{/*			<Typography*/}
				{/*				className="text-gray-600"*/}
				{/*				variant="body2"*/}
				{/*				sx={{*/}
				{/*					fontSize: "0.95rem",*/}
				{/*					opacity: 0.85,*/}
				{/*				}}*/}
				{/*			>*/}
				{/*				Analyze single repositories or multiple repositories in batch*/}
				{/*				mode*/}
				{/*			</Typography>*/}
				{/*		</Box>*/}
				{/*	</Box>*/}

				{/*	/!* 背景装饰元素 *!/*/}
				{/*	<Box*/}
				{/*		sx={{*/}
				{/*			position: "absolute",*/}
				{/*			top: -20,*/}
				{/*			right: -20,*/}
				{/*			width: 120,*/}
				{/*			height: 120,*/}
				{/*			borderRadius: "50%",*/}
				{/*			background:*/}
				{/*				"radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, rgba(59, 130, 246, 0) 70%)",*/}
				{/*			zIndex: 1,*/}
				{/*		}}*/}
				{/*	/>*/}
				{/*	<Box*/}
				{/*		sx={{*/}
				{/*			position: "absolute",*/}
				{/*			bottom: -30,*/}
				{/*			left: -30,*/}
				{/*			width: 160,*/}
				{/*			height: 160,*/}
				{/*			borderRadius: "50%",*/}
				{/*			background:*/}
				{/*				"radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, rgba(79, 70, 229, 0) 70%)",*/}
				{/*			zIndex: 1,*/}
				{/*		}}*/}
				{/*	/>*/}
				{/*</Box>*/}
			</Box>
		</Grow>
	);
};

export default RepoTabs;
