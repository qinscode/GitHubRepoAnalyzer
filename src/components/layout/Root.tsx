import { Outlet } from "@tanstack/react-router";
import Navbar from "./Navbar";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// 创建自定义主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // 蓝色调整为Tailwind的blue-600
    },
    secondary: {
      main: '#9333ea', // 紫色调整为Tailwind的purple-600
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

// 根组件，包含应用的基本布局
export const RootComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Navbar />
        <Box className="flex-grow py-4" component="main">
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}; 