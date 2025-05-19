import { Container, Box, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import RepoAnalysisForm from "../components/github/RepoAnalysisForm";
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
					GitHub Repository Analyzer v0.2.1
				</Typography>
			</Box>

			<Box
				className="max-w-8xl mx-auto"
				sx={{
					borderRadius: "16px",
					boxShadow: "0 4px 20px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)",
					overflow: "hidden",
					mb: 10,
					backgroundColor: "white",
					border: "1px solid rgba(0,0,0,0.03)",
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
