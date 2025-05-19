import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { ThemeConfig } from "../AnalysisThemes";

interface StatsFooterProps {
  title: string;
  totalCount: number;
  creatorCount: number;
  creatorLabel: string;
  statsIcon: ReactNode;
  theme: ThemeConfig;
}

/**
 * Displays statistics information in a footer section
 */
const StatsFooter = ({
  title,
  totalCount,
  creatorCount,
  creatorLabel,
  statsIcon,
  theme,
}: StatsFooterProps): JSX.Element => {
  return (
    <Box
      sx={{
        mt: 4,
        p: 2,
        borderRadius: "12px",
        border: `1px dashed ${theme.light.replace("0.1", "0.3")}`,
        backgroundColor: theme.lighter.replace("0.05", "0.03"),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {statsIcon}
        <Typography
          sx={{ color: theme.textColor, fontWeight: 500 }}
          variant="body2"
        >
          Total {title.split(" ")[0]}: {totalCount}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          ml: 3.5,
          mt: 0.5,
          color: "text.secondary",
          opacity: 0.8,
        }}
      >
        {creatorCount > 0
          ? `${creatorLabel} ${creatorCount} ${creatorCount === 1 ? "user" : "users"}`
          : "No data available"}
      </Typography>
    </Box>
  );
};

export default StatsFooter; 