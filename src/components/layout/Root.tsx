import {
	CssBaseline,
	ThemeProvider,
	createTheme,
	Box,
	Typography,
	Link,
	Stack,
	Chip,
} from "@mui/material";
import { Outlet } from "@tanstack/react-router";
import GitHubIcon from "@mui/icons-material/GitHub";

// Create custom theme
const theme = createTheme({
	palette: {
		primary: {
			main: "#2563eb", // Blue - adjusted to Tailwind's blue-600
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#9333ea", // Purple - adjusted to Tailwind's purple-600
			contrastText: "#ffffff",
		},
	},
	typography: {
		fontFamily: [
			"Inter",
			"system-ui",
			"-apple-system",
			"BlinkMacSystemFont",
			"Segoe UI",
			"Roboto",
			"Helvetica Neue",
			"Arial",
			"sans-serif",
		].join(","),
	},
});

// Root component, contains the basic layout of the application
export default function Root(): React.ReactElement {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div className="relative min-h-screen flex flex-col">
				{/* Background image */}
				<div
					className="absolute inset-0 -z-10"
					style={{
						backgroundImage: "url('/background.jpg')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						opacity: 0.5,
					}}
				/>
				<main className="flex-grow px-4">
					<Outlet />
				</main>
				<footer className="mt-auto py-6 px-4">
					<Box
						className="max-w-7xl mx-auto"
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							borderTop: "1px solid rgba(0,0,0,0.05)",
							paddingTop: 3,
							gap: 2,
						}}
					>
						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={1}
							sx={{ mb: 1 }}
						>
							<Chip
								label="React 18"
								size="small"
								sx={{
									bgcolor: "rgba(97,218,251,0.1)",
									color: "#61DAFB",
									fontWeight: 500,
								}}
							/>
							<Chip
								label="Tauri 2.0"
								size="small"
								sx={{
									bgcolor: "rgba(255,193,49,0.1)",
									color: "#FFC131",
									fontWeight: 500,
								}}
							/>
							<Chip
								label="TypeScript 5.5"
								size="small"
								sx={{
									bgcolor: "rgba(49,120,198,0.1)",
									color: "#3178C6",
									fontWeight: 500,
								}}
							/>
							<Chip
								label="Vite 6.3"
								size="small"
								sx={{
									bgcolor: "rgba(100,108,255,0.1)",
									color: "#646CFF",
									fontWeight: 500,
								}}
							/>
						</Stack>

						<Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
							<Link
								color="text.secondary"
								href="https://github.com/qinscode/GitHubRepoAnalyzer"
								sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
								underline="hover"
							>
								<GitHubIcon fontSize="small" />
								GitHub
							</Link>
							<Link
								color="text.secondary"
								href="https://github.com/qinscode/GitHubRepoAnalyzer/issues"
								underline="hover"
							>
								Issues
							</Link>
							<Link
								color="text.secondary"
								href="https://github.com/qinscode/GitHubRepoAnalyzer/blob/main/LICENSE"
								underline="hover"
							>
								MIT License
							</Link>
						</Box>

						<Typography
							color="text.secondary"
							sx={{ mt: 1, opacity: 0.7 }}
							variant="body2"
						>
							© {new Date().getFullYear()} GitHub Repository Analyzer v0.4.7
							Created with ❤️ by Jack Qin
						</Typography>
					</Box>
				</footer>
			</div>
		</ThemeProvider>
	);
}
