import { Box, Typography, useTheme } from "@mui/material";

interface NoDataDisplayProps {
	title: string;
	message: string;
	icon?: string;
	height?: number;
}

/**
 * A component to display when there is no data available
 */
const NoDataDisplay = ({
	title,
	message,
	icon = "📊",
	height = 200,
}: NoDataDisplayProps) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				alignItems: "center",
				display: "flex",
				flexDirection: "column",
				height,
				justifyContent: "center",
				my: 2,
				width: "100%",
				background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
				borderRadius: 2,
				boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
				p: 3,
			}}
		>
			<Box
				component="div"
				sx={{
					mb: 2,
					fontSize: "2rem",
					color: theme.palette.text.secondary,
				}}
			>
				{icon}
			</Box>
			<Typography
				color="text.secondary"
				sx={{ fontWeight: 500, cursor: "default" }}
				variant="body1"
			>
				{title}
			</Typography>
			<Typography
				color="text.secondary"
				sx={{ mt: 1, opacity: 0.7, cursor: "default" }}
				variant="body2"
			>
				{message}
			</Typography>
		</Box>
	);
};

export default NoDataDisplay;
