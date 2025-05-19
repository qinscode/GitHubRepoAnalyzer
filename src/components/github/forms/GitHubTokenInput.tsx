import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

interface GitHubTokenInputProps {
  token: string;
  onTokenChange: (token: string) => void;
  onTokenSave: (token: string) => void;
  onTokenDelete: () => void;
  hasSavedToken: boolean;
  hasPresetToken: boolean;
}

const GitHubTokenInput = ({
  token,
  onTokenChange,
  onTokenSave,
  onTokenDelete,
  hasSavedToken,
  hasPresetToken,
}: GitHubTokenInputProps) => {
  return (
    <Box className="mb-5">
      <Typography className="form-subtitle">
        GitHub Personal Access Token
      </Typography>
      <TextField
        fullWidth
        className="enhanced-input"
        disabled={false}
        placeholder="Enter your GitHub token"
        type="password"
        value={token}
        variant="outlined"
        InputProps={{
          className: "rounded-md bg-white",
          startAdornment: (
            <InputAdornment position="start">
              <div className="input-icon-container">
                <KeyIcon
                  color="primary"
                  sx={{ opacity: 0.8, fontSize: "1.2rem" }}
                />
              </div>
            </InputAdornment>
          ),
        }}
        onChange={(event) => onTokenChange(event.target.value)}
      />
      <Typography className="text-xs text-gray-500 mt-2 ml-1 mb-2">
        {hasSavedToken
          ? "Token loaded from browser storage"
          : hasPresetToken
          ? "Token loaded from environment variables"
          : "Required for API access (needs repo scope permissions)"}
      </Typography>
      
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<SaveIcon />}
          onClick={() => onTokenSave(token)}
        >
          Save Token
        </Button>
        {hasSavedToken && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onTokenDelete}
          >
            Delete Token
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default GitHubTokenInput; 