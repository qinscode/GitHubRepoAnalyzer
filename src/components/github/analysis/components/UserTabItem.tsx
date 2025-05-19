import { useState, type ReactElement, type ReactNode } from "react";
import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Avatar,
	Chip,
	Grow,
	alpha,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import type { ThemeConfig } from "./AnalysisThemes";

interface UserTabItemProps {
	user: string;
	itemCount: number;
	chipLabel: string;
	icon: ReactElement;
	index: number;
	children: ReactNode;
	theme: ThemeConfig;
}

/**
 * A reusable accordion component for user items across different tabs
 */
const UserTabItem = ({
	user,
	itemCount,
	chipLabel,
	icon,
	index,
	children,
	theme,
}: UserTabItemProps) => {
	const [expanded, setExpanded] = useState(false);

	const handleChange = (): void => {
		setExpanded(!expanded);
	};

	return (
		<Grow in timeout={800 + index * 150}>
			<Accordion
				expanded={expanded}
				sx={{
					mb: 2.5,
					borderRadius: "12px !important",
					overflow: "hidden",
					boxShadow: expanded
						? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
						: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)",
					border: "1px solid rgba(255, 255, 255, 0.7)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					background:
						"linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9))",
					backdropFilter: "blur(8px)",
					"&:before": {
						display: "none",
					},
					"&:hover": {
						boxShadow: `0 10px 15px -3px ${alpha(theme.main, 0.1)}, 0 4px 6px -2px ${alpha(theme.main, 0.05)}`,
					},
				}}
				onChange={handleChange}
			>
				<AccordionSummary
					expandIcon={
						<ExpandMoreIcon
							sx={{
								color: theme.main,
								transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
								transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
							}}
						/>
					}
					sx={{
						background: expanded
							? `linear-gradient(to right, ${theme.lighter}, rgba(249, 250, 251, 0.8))`
							: "transparent",
						borderLeft: `4px solid ${theme.main}`,
						transition: "all 0.3s ease",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							width: "100%",
							justifyContent: "space-between",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Avatar
								sx={{
									width: 36,
									height: 36,
									mr: 2,
									background: theme.gradient,
									fontSize: "0.9rem",
									boxShadow: `0 2px 5px ${alpha(theme.main, 0.4)}`,
								}}
							>
								{user.charAt(0).toUpperCase()}
							</Avatar>
							<Typography
								variant="subtitle1"
								sx={{
									fontWeight: 600,
									color: "rgba(55, 65, 81, 0.9)",
								}}
							>
								{user}
							</Typography>
						</Box>
						<Chip
							icon={icon}
							label={`${itemCount} ${chipLabel}`}
							size="small"
							sx={{
								ml: 2,
								background: theme.gradient,
								color: "white",
								fontWeight: 500,
								boxShadow: `0 2px 5px ${alpha(theme.main, 0.2)}`,
								"& .MuiChip-icon": {
									color: "white",
								},
							}}
						/>
					</Box>
				</AccordionSummary>
				<AccordionDetails sx={{ p: 0 }}>
					{expanded && (
						<Box
							sx={{ width: "100%", opacity: 1, transition: "opacity 500ms" }}
						>
							{children}
						</Box>
					)}
				</AccordionDetails>
			</Accordion>
		</Grow>
	);
};

export default UserTabItem;
