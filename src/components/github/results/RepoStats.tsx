import { Box, Stack } from "@mui/material";
import { Commit as CommitIcon, BugReport as IssueIcon, MergeType as PRIcon } from "@mui/icons-material";
import { RepoResult } from "../types/batchRepoTypes";
import { StatItem } from "./StatItem";

// Color configuration
const statColors = {
  commits: {
    main: "#2563eb",
    light: "rgba(37, 99, 235, 0.1)",
    gradient: "linear-gradient(45deg, #2563eb, #1d4ed8)",
  },
  issues: {
    main: "#8e44ad",
    light: "rgba(142, 68, 173, 0.1)",
    gradient: "linear-gradient(45deg, #8e44ad, #9b59b6)",
  },
  prs: {
    main: "#0891b2",
    light: "rgba(8, 145, 178, 0.1)",
    gradient: "linear-gradient(45deg, #0891b2, #06b6d4)",
  },
};

interface RepoStatsProps {
  result: RepoResult;
}

export const RepoStats = ({ result }: RepoStatsProps): JSX.Element => {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "40%" },
        mb: { xs: 2, sm: 0 },
      }}
    >
      <Stack
        direction="row"
        justifyContent={{ xs: "space-between", sm: "flex-start" }}
        spacing={{ xs: 2, md: 3 }}
        sx={{
          pl: { xs: 1, sm: 0 },
          pr: { xs: 1, sm: 0 },
        }}
      >
        <StatItem
          color={statColors.commits.main}
          icon={<CommitIcon sx={{ fontSize: "1.2rem" }} />}
          label="Commits"
          value={result.commits}
        />
        <StatItem
          color={statColors.issues.main}
          icon={<IssueIcon sx={{ fontSize: "1.2rem" }} />}
          label="Issues"
          value={result.issues}
        />
        <StatItem
          color={statColors.prs.main}
          icon={<PRIcon sx={{ fontSize: "1.2rem" }} />}
          label="PRs"
          value={result.prs}
        />
      </Stack>
    </Box>
  );
}; 