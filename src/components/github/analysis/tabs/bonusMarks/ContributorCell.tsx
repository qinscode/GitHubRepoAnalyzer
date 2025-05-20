import { Typography, Box } from "@mui/material";
import { DragIndicator as DragIcon } from "@mui/icons-material";
import { ContributorCellProps } from "./types";
import { bonusMarksTheme } from "../../components/AnalysisThemes";
import { alpha } from "@mui/material/styles";

const ContributorCell = ({ value, isDragging, dragAttributes, dragListeners }: ContributorCellProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "100%",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px",
          borderRadius: "4px",
          cursor: "grab",
          "&:active": {
            cursor: "grabbing",
          },
          backgroundColor: isDragging 
            ? alpha(bonusMarksTheme.main, 0.1)
            : "transparent",
          "&:hover": {
            backgroundColor: alpha(bonusMarksTheme.main, 0.1),
          },
        }}
        {...dragAttributes}
        {...dragListeners}
      >
        <DragIcon
          sx={{
            color: bonusMarksTheme.main,
            opacity: isDragging ? 1 : 0.7,
            fontSize: "1.2rem",
            transition: "opacity 0.2s",
            "&:hover": {
              opacity: 1,
            },
          }}
        />
      </Box>
      <Typography
        sx={{
          fontWeight: 500,
          color: "rgba(55, 65, 81, 0.9)",
          fontFamily: "inherit",
          fontSize: "0.95rem",
          flexGrow: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default ContributorCell; 