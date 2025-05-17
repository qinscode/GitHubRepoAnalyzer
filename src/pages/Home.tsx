import { Link } from "@tanstack/react-router";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CodeIcon from "@mui/icons-material/Code";
import type { FunctionComponent } from "../common/types";

export const Home = (): FunctionComponent => {

	return (
		<Container maxWidth="lg">
			<Box className="text-center mt-16 mb-12">
				<Typography className="max-w-2xl mx-auto mb-6" color="text.secondary" variant="h5">
					Analyze GitHub repositories with ease using our powerful tools
				</Typography>
				<Button
					className="mt-6 py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
					component={Link}
					size="large"
					startIcon={<GitHubIcon />}
					to="/"
					variant="contained"
				>
					Get Started
				</Button>
			</Box>

			<Box className="flex flex-wrap gap-6 mt-8">
				<Box className="flex-1 basis-64 min-w-0">
					<Paper
						className="p-6 h-full border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50"
						elevation={0}
					>
						<GitHubIcon className="text-5xl mb-4" color="primary" />
						<Typography className="font-bold mb-3" component="h2" variant="h5">
							Repository Analysis
						</Typography>
						<Typography className="leading-relaxed" color="text.secondary">
							Analyze single GitHub repositories to get detailed insights about
							commits, issues, and pull requests.
						</Typography>
					</Paper>
				</Box>
				<Box className="flex-1 basis-64 min-w-0">
					<Paper
						className="p-6 h-full border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50"
						elevation={0}
					>
						<AnalyticsIcon className="text-5xl mb-4" color="secondary" />
						<Typography className="font-bold mb-3" component="h2" variant="h5">
							Batch Processing
						</Typography>
						<Typography className="leading-relaxed" color="text.secondary">
							Process multiple repositories at once to compare activity and
							identify patterns across projects.
						</Typography>
					</Paper>
				</Box>
				<Box className="flex-1 basis-64 min-w-0">
					<Paper
						className="p-6 h-full border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-cyan-50"
						elevation={0}
					>
						<CodeIcon className="text-5xl mb-4" color="info" />
						<Typography className="font-bold mb-3" component="h2" variant="h5">
							Developer Insights
						</Typography>
						<Typography className="leading-relaxed" color="text.secondary">
							Get detailed information about developer contributions, teamwork,
							and collaboration patterns.
						</Typography>
					</Paper>
				</Box>
			</Box>
		</Container>
	);
};
