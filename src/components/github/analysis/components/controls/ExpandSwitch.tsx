import { alpha, FormControlLabel, Switch, Typography } from "@mui/material";
import type { ThemeConfig } from "../AnalysisThemes";

interface ExpandSwitchProps {
	isExpanded: boolean;
	toggleExpanded: () => void;
	showLessLabel?: string;
	showMoreLabel?: string;
	theme: ThemeConfig;
}

/**
 * Toggle switch for expanding/collapsing content with customizable labels
 */
const ExpandSwitch = ({
	isExpanded,
	toggleExpanded,
	showLessLabel = "Collapse All",
	showMoreLabel = "Expand All",
	theme,
}: ExpandSwitchProps) => {
	return (
		<FormControlLabel
			control={
				<Switch
					checked={isExpanded}
					sx={{
						"& .MuiSwitch-switchBase.Mui-checked": {
							color: theme.main,
							"&:hover": {
								backgroundColor: alpha(theme.main, 0.08),
							},
						},
						"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
							backgroundColor: theme.main,
						},
					}}
					onChange={toggleExpanded}
				/>
			}
			label={
				<Typography
					color="text.secondary"
					fontWeight={600}
					sx={{ fontSize: "0.9rem" }}
					variant="body1"
				>
					{isExpanded ? showLessLabel : showMoreLabel}
				</Typography>
			}
		/>
	);
};

export default ExpandSwitch;
