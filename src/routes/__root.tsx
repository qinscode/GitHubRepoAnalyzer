import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "../components/layout/Navbar";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

// Root component with layout
const RootComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export const rootRoute = createRootRoute({
  component: RootComponent,
}); 