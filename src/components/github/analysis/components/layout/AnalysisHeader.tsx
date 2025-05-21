import { Box, Tooltip, Typography } from "@mui/material";
import type { ThemeConfig } from "../AnalysisThemes";

interface AnalysisHeaderProps {
	title: string;
	description?: string;
	headerTitle?: string;
	theme: ThemeConfig;
}

/**
 * Displays the analysis header with title and description
 */
const AnalysisHeader = ({
	title,
	description,
	headerTitle,
	theme,
}: AnalysisHeaderProps) => {
	const hasContent = Boolean(description || headerTitle);
	if (!hasContent) return null;

	return (
		<Tooltip
			arrow
			enterDelay={500}
			leaveDelay={200}
			placement="top"
			sx={{ cursor: "default" }}
			title={`${title}${description ? ` - ${description}` : ""}${headerTitle ? ` (${headerTitle})` : ""}`}
		>
			<Box
				className="shine-effect"
				sx={{
					p: 2,
					mb: 4,
					borderRadius: "14px",
					background: `linear-gradient(135deg, ${theme.light}, ${theme.lighter.replace("0.05", "0.04")})`,
					border: `1px solid ${theme.light.replace("0.1", "0.15")}`,
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
					position: "relative",
					overflow: "hidden",
					"&::before": {
						content: '""',
						position: "absolute",
						top: -30,
						right: -30,
						width: 120,
						height: 120,
						borderRadius: "50%",
						background: `radial-gradient(circle, ${theme.light} 0%, ${theme.light.replace("0.1", "0")} 70%)`,
						zIndex: 0,
					},
				}}
			>
				{title && (
					<Typography
						variant="h6"
						sx={{
							fontWeight: 600,
							color: theme.textColor,
							mb: description ? 1 : 0,
							position: "relative",
							zIndex: 1,
							cursor: "default",
						}}
					>
						{title}
					</Typography>
				)}
				{description && (
					<Typography
						variant="body2"
						sx={{
							color: "rgba(107, 114, 128, 0.9)",
							position: "relative",
							zIndex: 1,
							cursor: "default",
						}}
					>
						{description}
					</Typography>
				)}
			</Box>
		</Tooltip>
	);
};

export default AnalysisHeader;
