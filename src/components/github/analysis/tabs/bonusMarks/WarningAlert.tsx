import { Alert, alpha } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { bonusMarksTheme } from "../../components/AnalysisThemes";
import { WarningAlertProps } from "./types";

const WarningAlert = ({ totalBonusMarks }: WarningAlertProps) => {
  if (totalBonusMarks <= 4) {
    return null;
  }

  return (
    <Alert
      icon={<WarningIcon sx={{ color: bonusMarksTheme.textColor }} />}
      severity="warning"
      sx={{
        mb: 2,
        borderRadius: "8px",
        backgroundColor: alpha(bonusMarksTheme.light, 0.5),
        "& .MuiAlert-message": {
          color: bonusMarksTheme.textColor,
          fontFamily: "inherit",
          fontSize: "0.95rem",
        },
      }}
    >
      Total bonus marks cannot exceed 4. Current total: {totalBonusMarks}
    </Alert>
  );
};

export default WarningAlert; 