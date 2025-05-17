import type React from "react";
import { useState } from "react";
import { Container, Box, Typography, useTheme } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SingleRepoForm from "../components/github/SingleRepoForm";
import BatchRepoForm from "../components/github/BatchRepoForm";
import RepoTabs from "../components/github/RepoTabs";

export const GitHub = (): React.ReactElement => {
	const [activeTab, setActiveTab] = useState(0);
	const theme = useTheme();

	const handleTabChange = (newValue: number): void => {
		setActiveTab(newValue);
	};

	return (
		<Container className="!p-4 md:!p-8" maxWidth="lg">
			<Box className="mb-10 text-center">
				<Box className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-500/10">
					<GitHubIcon
						className="text-4xl text-blue-600"
						sx={{
							fontSize: "2.5rem",
							filter: "drop-shadow(0 2px 3px rgba(37, 99, 235, 0.2))",
						}}
					/>
					<AnalyticsIcon
						className="text-3xl ml-1 text-indigo-600"
						sx={{
							fontSize: "2rem",
							filter: "drop-shadow(0 2px 3px rgba(79, 70, 229, 0.2))",
						}}
					/>
				</Box>
				<Typography
					className="font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
					component="h1"
					variant="h2"
					sx={{
						fontSize: { xs: "2.5rem", md: "3.25rem" },
						textShadow: "0 1px 1px rgba(0,0,0,0.03)",
						letterSpacing: "-0.5px",
					}}
				>
					GitHub Repository Analyzer
				</Typography>
			</Box>

			<Box
				className="max-w-4xl mx-auto"
				sx={{
					borderRadius: "16px",
					boxShadow: "0 4px 20px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)",
					overflow: "hidden",
					mb: 10,
					backgroundColor: "white",
					border: "1px solid rgba(0,0,0,0.03)",
				}}
			>
				<RepoTabs activeTab={activeTab} handleTabChange={handleTabChange} />

				<Box className="p-4 md:p-6">
					{activeTab === 0 ? <SingleRepoForm /> : <BatchRepoForm />}
				</Box>
			</Box>
		</Container>
	);
};
