import { Box, Typography } from "@mui/material";
import type { ThemeConfig } from "./AnalysisThemes";

interface HeaderTitleProps {
  headerTitle: string;
  theme: ThemeConfig;
}

/**
 * Displays the header title with styling and animations
 */
const HeaderTitle = ({ headerTitle, theme }: HeaderTitleProps): JSX.Element => {
  return (
    <Typography
      sx={{
        fontSize: "1.15rem",
        fontWeight: 600,
        color: theme.textColor,
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
          background: theme.gradient,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -5,
          left: 16,
          width: "40%",
          height: "2px",
          background: theme.gradient,
          transition: "width 0.3s ease",
        },
        "&:hover::after": {
          width: "80%",
        },
      }}
    >
      {headerTitle}
    </Typography>
  );
};

export default HeaderTitle; 