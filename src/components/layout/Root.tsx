import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "@tanstack/react-router";

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
				{/* Light static background instead of heavy blur effect */}
				<div 
					className="absolute inset-0 -z-10"
					style={{
						background: "linear-gradient(135deg, #f5f7ff 0%, #f0f1fe 40%, #f8f1ff 100%)",
						opacity: 0.8,
					}}
				/>
				<main className="flex-grow px-4">
					<Outlet />
				</main>
			</div>
		</ThemeProvider>
	);
}
