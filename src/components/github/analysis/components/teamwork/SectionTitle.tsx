import { Typography } from "@mui/material";
import { TeamworkColors } from "./TeamworkTheme";

interface SectionTitleProps {
	title: string;
}

/**
 * A styled section title component used in teamwork analysis tabs
 */
const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
	return (
		<Typography
			sx={{
				fontSize: "1.15rem",
				fontWeight: 600,
				color: "#BE185D",
				mb: 2.5,
				mt: 2,
				position: "relative",
				paddingLeft: "16px",
				display: "inline-block",
				transition: "transform 0.2s ease",
				"&:hover": {
					transform: "translateX(2px)",
				},
				"&::before": {
					content: '""',
					position: "absolute",
					left: 0,
					top: "50%",
					transform: "translateY(-50%)",
					width: "4px",
					height: "18px",
					borderRadius: "2px",
					background: TeamworkColors.gradient,
				},
				"&::after": {
					content: '""',
					position: "absolute",
					bottom: -5,
					left: 16,
					width: "40%",
					height: "2px",
					background: TeamworkColors.gradient,
					transition: "width 0.3s ease",
				},
				"&:hover::after": {
					width: "80%",
				},
			}}
		>
			{title}
		</Typography>
	);
};

export default SectionTitle; 