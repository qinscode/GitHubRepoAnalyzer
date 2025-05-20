import { alpha } from "@mui/material";
import { bonusMarksTheme } from "../../components/AnalysisThemes";

export const selectStyles = {
  fontFamily: "inherit",
  fontSize: "0.95rem",
  color: bonusMarksTheme.main,
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(bonusMarksTheme.main, 0.2),
    borderWidth: "1px",
    transition: "all 0.2s ease-in-out",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: bonusMarksTheme.main,
    borderWidth: "1px",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: bonusMarksTheme.main,
    borderWidth: "1px",
  },
  "& .MuiSelect-select": {
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiSelect-icon": {
    color: bonusMarksTheme.main,
    right: "12px",
  },
};

export const menuProps = {
  PaperProps: {
    sx: {
      marginTop: "4px",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "& .MuiMenuItem-root": {
        fontSize: "0.95rem",
        fontFamily: "inherit",
        padding: "8px 16px",
        "&:hover": {
          backgroundColor: alpha(bonusMarksTheme.light, 0.5),
        },
        "&.Mui-selected": {
          backgroundColor: alpha(bonusMarksTheme.main, 0.1),
          "&:hover": {
            backgroundColor: alpha(bonusMarksTheme.main, 0.15),
          },
        },
        "&.Mui-disabled": {
          opacity: 0.5,
        },
      },
    },
  },
}; 