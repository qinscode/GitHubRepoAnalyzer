import { Container, Box, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { RepoAnalysisForm } from "../features/github/analysis";
import RepoTabs from "../components/github/analysis/tabs/RepoTabs.tsx";

export const GitHub = (): React.ReactElement => {
	return (
		<Container className="!p-4 md:!p-8" maxWidth="xl">
			<Box className="mb-10 text-center">
				<Box className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-500/10">
					<GitHubIcon
						sx={{
							color: "white",
							fontSize: "1.4rem",
							background: "linear-gradient(135deg, #3B82F6, #4F46E5)",
							borderRadius: "50%",
							width: 40,
							height: 40,
							padding: "8px",
							boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.2)",
							display: "inline-block",
						}}
					/>
				</Box>
				<Typography
					className="font-bold  mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
					component="h1"
					variant="h2"
					sx={{
						fontWeight: "700 !important",
						fontSize: { xs: "2.5rem", md: "3.25rem" },
						textShadow: "0 1px 1px rgba(0,0,0,0.03)",
						letterSpacing: "-0.5px",
					}}
				>
					GitHub Repository Analyzer v0.3
				</Typography>
			</Box>

			<Box
				className="max-w-8xl mx-auto"
				sx={{
					borderRadius: "16px",
					boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.10)",
					overflow: "hidden",
					mb: 10,
					background:
						"linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
					backdropFilter: "blur(22px)",
					border: "1.5px solid rgba(255,255,255,0.7)",
					"&:before": {
						content: '""',
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)",
						pointerEvents: "none",
						zIndex: 1,
					},
					position: "relative",
					"&:hover": {
						boxShadow:
							"0 10px 40px rgba(59, 130, 246, 0.13), 0 3px 12px rgba(59, 130, 246, 0.10)",
						borderColor: "rgba(255,255,255,0.9)",
					},
					transition: "all 0.3s ease-in-out",
				}}
			>
				<RepoTabs />

				<Box className="p-4 md:p-6">
					<RepoAnalysisForm />
				</Box>
			</Box>
		</Container>
	);
};
