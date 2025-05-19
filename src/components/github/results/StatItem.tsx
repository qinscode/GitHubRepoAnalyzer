import { Box, Typography, alpha } from "@mui/material";
import { ReactNode } from "react";

interface StatItemProps {
	icon: ReactNode;
	label: string;
	value: number;
	color: string;
	isSmallScreen?: boolean;
	isMediumDown?: boolean;
	isLargeScreen?: boolean;
}

export const StatItem = ({
	icon,
	label,
	value,
	color,
	isSmallScreen = false,
	isMediumDown = false,
	isLargeScreen = false,
}: StatItemProps) => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: isSmallScreen ? 0.15 : isMediumDown ? 0.15 : 0.25,
				transition: "transform 0.2s ease",
				"&:hover": {
					transform: "translateY(-2px)",
				},
				m: 0,
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
					fontSize: isSmallScreen
						? "0.7rem"
						: isMediumDown
							? "0.75rem"
							: "1.1rem",
					color,
					mr: 0,
					lineHeight: 1,
				}}
			>
				{value}
			</Typography>
			<Typography
				variant="caption"
				sx={{
					color: alpha(color, 0.7),
					fontWeight: 500,
					fontSize: isSmallScreen
						? "0.7rem"
						: isMediumDown
							? "0.85rem"
							: isLargeScreen
								? "1rem"
								: "1.0rem",
					lineHeight: 1,
					mt: isSmallScreen ? "1px" : "2px",
				}}
			>
				{label}
			</Typography>
		</Box>
	);
};
