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
}: ExpandSwitchProps): JSX.Element => {
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
          sx={{
            fontSize: "0.875rem",
            color: theme.textColor,
          }}
        >
          {isExpanded ? showLessLabel : showMoreLabel}
        </Typography>
      }
    />
  );
};

export default ExpandSwitch; 