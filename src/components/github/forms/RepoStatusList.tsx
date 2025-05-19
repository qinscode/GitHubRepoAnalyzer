import type React from "react";
import { Box, Typography, Stack } from "@mui/material";
import type { RepoStatusListProps } from "../../../types/github";
import RepoStatusItem from "./RepoStatusItem";

const RepoStatusList: React.FC<RepoStatusListProps> = ({ 
  extractRepoName,
  repoItems
}) => {
  if (!repoItems.length) return null;

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        borderRadius: "12px",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        maxHeight: "200px",
        overflowY: "auto",
      }}
    >
      <Typography
        sx={{ mb: 1.5, fontWeight: 600, color: "text.primary" }}
        variant="subtitle2"
      >
        Repository Status
      </Typography>
      <Stack spacing={1}>
        {repoItems.map((item) => (
          <RepoStatusItem 
            key={item.id} 
            extractRepoName={extractRepoName}
            item={item} 
          />
        ))}
      </Stack>
    </Box>
  );
};

export default RepoStatusList; 