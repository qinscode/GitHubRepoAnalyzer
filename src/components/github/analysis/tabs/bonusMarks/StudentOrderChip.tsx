import { Box, Typography, Chip, alpha } from "@mui/material";
import { bonusMarksTheme } from "../../components/AnalysisThemes";
import { StudentOrderChipProps } from "./types";

const StudentOrderChip = ({ orderIndex }: StudentOrderChipProps) => {
  // If the user is in the student order, display their position (1-based)
  if (orderIndex !== -1) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Chip
          label={orderIndex + 1}
          sx={{
            backgroundColor: alpha(bonusMarksTheme.main, 0.1),
            color: bonusMarksTheme.main,
            fontWeight: 600,
            fontSize: "0.95rem",
            minWidth: "32px",
            height: "28px",
            borderRadius: "6px",
            border: `1px solid ${alpha(bonusMarksTheme.main, 0.2)}`,
          }}
        />
      </Box>
    );
  }

  // If not in student order, show a dash
  return (
    <Typography
      sx={{
        color: "text.secondary",
        fontStyle: "italic",
        textAlign: "center",
      }}
    >
      -
    </Typography>
  );
};

export default StudentOrderChip; 