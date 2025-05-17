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
			<div className=" flex flex-col">
				<main className="flex-grow px-4">
					<Outlet />
				</main>
			</div>
		</ThemeProvider>
	);
}
