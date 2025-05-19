import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        <IconButton
          color="primary"
          title="Save token to browser"
          onClick={() => onTokenSave(token)}
        >
          <SaveIcon />
        </IconButton>
        {hasSavedToken && (
          <IconButton
            color="error"
            title="Delete saved token"
            onClick={onTokenDelete}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      <Typography className="text-xs text-gray-500 mt-2 ml-1">
        {hasSavedToken
          ? "Token loaded from browser storage"
          : hasPresetToken
          ? "Token loaded from environment variables"
          : "Required for API access (needs repo scope permissions)"}
      </Typography>
    </Box>
  );
};

export default GitHubTokenInput; 