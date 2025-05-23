import { Container, Box, Typography } from "@mui/material";
import { RepoAnalysisForm } from "../features/github/analysis";
import RepoTabs from "../components/github/analysis/tabs/RepoTabs.tsx";

export const GitHub = () => {
	return (
		<Container className="!p-4 md:!p-8" maxWidth="xl">
			<Box className="mb-6 text-center">
				<Box className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-500/10">
					<img
						alt="Logo"
						src="/icon.png"
						style={{
							width: 150,
							height: 150,
							borderRadius: "50%",
							boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.2)",
						}}
					/>
				</Box>
				<Typography
					className="font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
					component="h1"
					variant="h2"
					sx={{
						fontWeight: "700 !important",
						fontSize: { xs: "2.5rem", md: "3.25rem" },
						textShadow:
							"0 2px 10px rgba(79,70,229,0.4), 0 0 20px rgba(59,130,246,0.12)",
						letterSpacing: "-0.5px",
						marginBottom: "0.5rem",
					}}
				>
					GitHub Repository Analyzer
				</Typography>
				<Typography
					color="text.secondary"
					variant="subtitle1"
					sx={{
						cursor: "default",

						fontSize: "0.9rem",
						opacity: 0.8,
						marginTop: "-0.5rem",
						marginBottom: "1rem",
					}}
				>
					v0.5.0
				</Typography>
			</Box>

			<Box
				className="max-w-8xl mx-auto"
				sx={{
					borderRadius: "16px",
					boxShadow:
						"0 10px 40px rgba(59, 130, 246, 0.13), 0 3px 12px rgba(59, 130, 246, 0.10)",

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

					borderColor: "transparent",

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
