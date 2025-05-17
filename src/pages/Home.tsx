import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CodeIcon from "@mui/icons-material/Code";
import type { FunctionComponent } from "../common/types";

export const Home = (): FunctionComponent => {
	const { t } = useTranslation();

	return (
		<Container maxWidth="lg">
			<Box className="text-center mt-16 mb-12">
				<Typography variant="h3" component="h1" className="font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
					{t("home.greeting")}
				</Typography>
				<Typography variant="h5" color="text.secondary" className="max-w-2xl mx-auto mb-6">
					Analyze GitHub repositories with ease using our powerful tools
				</Typography>
				<Button
					component={Link}
					to="/"
					variant="contained"
					size="large"
					startIcon={<GitHubIcon />}
					className="mt-6 py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
				>
					Get Started
				</Button>
			</Box>

			<Box className="flex flex-wrap gap-6 mt-8">
				<Box className="flex-1 basis-64 min-w-0">
					<Paper
						elevation={0}
						className="p-6 h-full border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50"
					>
						<GitHubIcon color="primary" className="text-5xl mb-4" />
						<Typography variant="h5" component="h2" className="font-bold mb-3">
							Repository Analysis
						</Typography>
						<Typography color="text.secondary" className="leading-relaxed">
							Analyze single GitHub repositories to get detailed insights about
							commits, issues, and pull requests.
						</Typography>
					</Paper>
				</Box>
				<Box className="flex-1 basis-64 min-w-0">
					<Paper
						elevation={0}
						className="p-6 h-full border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50"
					>
						<AnalyticsIcon color="secondary" className="text-5xl mb-4" />
						<Typography variant="h5" component="h2" className="font-bold mb-3">
							Batch Processing
						</Typography>
						<Typography color="text.secondary" className="leading-relaxed">
							Process multiple repositories at once to compare activity and
							identify patterns across projects.
						</Typography>
					</Paper>
				</Box>
				<Box className="flex-1 basis-64 min-w-0">
					<Paper
						elevation={0}
						className="p-6 h-full border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-cyan-50"
					>
						<CodeIcon color="info" className="text-5xl mb-4" />
						<Typography variant="h5" component="h2" className="font-bold mb-3">
							Developer Insights
						</Typography>
						<Typography color="text.secondary" className="leading-relaxed">
							Get detailed information about developer contributions, teamwork,
							and collaboration patterns.
						</Typography>
					</Paper>
				</Box>
			</Box>
		</Container>
	);
};
