import { Typography } from "@mui/material";

interface ChartTipProps {
	text: string;
}

/**
 * A component to display tips for chart interaction
 */
const ChartTip = ({ text }: ChartTipProps) => {
	return (
		<Typography
			align="center"
			variant="caption"
			sx={{
				display: "block",
				color: "text.secondary",
				mt: 1,
				opacity: 0.7,
				cursor: "default",
				fontStyle: "italic",
			}}
		>
			{text}
		</Typography>
	);
};

export default ChartTip;
