import type React from "react";
import { useState } from "react";

import { Container, Box, Typography, Paper } from "@mui/material";
import SingleRepoForm from "../components/github/SingleRepoForm";
import BatchRepoForm from "../components/github/BatchRepoForm";
import RepoTabs from "../components/github/RepoTabs";

export const GitHub = (): React.ReactElement => {
	const [activeTab, setActiveTab] = useState(0);

	const handleTabChange = (newValue: number): void => {
		setActiveTab(newValue);
	};

	return (
		<Container className="!p-0" maxWidth="lg">
			<Paper
				className="!shadow-none ![--Paper-shadow:none] !border-0 rounded-xl bg-white  bg-gradient-to-b from-white to-blue-50/30"
				elevation={3}
			>
				<Box className="mb-8 text-center">
					<Typography
						className="font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
						component="h1"
						variant="h3"
					>
						GitHub Repository Analyzer
					</Typography>
				</Box>

				<RepoTabs activeTab={activeTab} handleTabChange={handleTabChange} />

				<Box className="mt-6">
					{activeTab === 0 ? <SingleRepoForm /> : <BatchRepoForm />}
				</Box>
			</Paper>
		</Container>
	);
};
