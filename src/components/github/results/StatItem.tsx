import { Box, Typography, alpha } from "@mui/material";
import { ReactNode } from "react";

interface StatItemProps {
	icon: ReactNode;
	label: string;
	value: number;
	color: string;
}

export const StatItem = ({ icon, label, value, color }: StatItemProps) => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				transition: "transform 0.2s ease",
				"&:hover": {
					transform: "translateY(-2px)",
				},
			}}
		>
			<Box
				sx={{
					color,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{icon}
			</Box>
			<Typography
				variant="h6"
				sx={{
					fontWeight: 600,
					fontSize: "1.1rem",
					color,
				}}
			>
				{value}
			</Typography>
			<Typography
				variant="caption"
				sx={{
					color: alpha(color, 0.7),
					fontWeight: 500,
					fontSize: "0.75rem",
				}}
			>
				{label}
			</Typography>
		</Box>
	);
};
