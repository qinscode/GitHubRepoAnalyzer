import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

interface AnalysisOptionsProps {
  hideMergeCommits: boolean;
  onHideMergeCommitsChange: (checked: boolean) => void;
}

const AnalysisOptions = ({
  hideMergeCommits,
  onHideMergeCommitsChange,
}: AnalysisOptionsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        mt: 2,
        mb: 0.5,
        p: 1.5,
        bgcolor: "rgba(59, 130, 246, 0.05)",
        borderRadius: "8px",
        border: "1px solid rgba(59, 130, 246, 0.1)",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          fontSize: "0.85rem",
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PlaylistAddCheckIcon
          sx={{
            mr: 1,
            color: "primary.main",
            fontSize: "1.1rem",
          }}
        />
        Analysis Options
      </Typography>
      <Box sx={{ ml: "auto" }}>
        <FormControlLabel
          sx={{ mr: 0 }}
          control={
            <Switch
              checked={hideMergeCommits}
              color="primary"
              size="small"
              onChange={(event) => onHideMergeCommitsChange(event.target.checked)}
            />
          }
          label={
            <Typography sx={{ fontSize: "0.85rem" }} variant="body2">
              Filter Merge Commits
            </Typography>
          }
        />
      </Box>
    </Box>
  );
};

export default AnalysisOptions; 