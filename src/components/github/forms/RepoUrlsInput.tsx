import {
  Box,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

interface RepoUrlsInputProps {
  repoUrls: string;
  onRepoUrlsChange: (repoUrls: string) => void;
}

const RepoUrlsInput = ({ repoUrls, onRepoUrlsChange }: RepoUrlsInputProps) => {
  return (
    <Box className="mb-5 relative">
      <Typography className="form-subtitle">
        GitHub Repository URLs
      </Typography>
      <TextField
        fullWidth
        multiline
        className="enhanced-input"
        placeholder="Enter GitHub repository URLs (one per line)"
        rows={4}
        value={repoUrls}
        variant="outlined"
        InputProps={{
          className: "rounded-md bg-white",
          startAdornment: (
            <InputAdornment position="start">
              <div className="input-icon-container">
                <GitHubIcon
                  color="primary"
                  sx={{ opacity: 0.8, fontSize: "1.2rem" }}
                />
              </div>
            </InputAdornment>
          ),
        }}
        onChange={(event) => { onRepoUrlsChange(event.target.value); }}
      />
    </Box>
  );
};

export default RepoUrlsInput; 