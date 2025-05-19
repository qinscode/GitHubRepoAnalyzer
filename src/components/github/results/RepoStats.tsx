import { Box, Stack, useTheme, useMediaQuery } from "@mui/material";
import {
	Commit as CommitIcon,
	BugReport as IssueIcon,
	MergeType as PRIcon,
} from "@mui/icons-material";
import { RepoResult } from "@/types/github";
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

export const RepoStats = ({ result }: RepoStatsProps) => {
	const theme = useTheme();
	const isMediumDown = useMediaQuery(theme.breakpoints.down("md"));
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

	// Adjust icon size based on screen size
	const getIconSize = () => {
		if (isSmallScreen) return "1rem";
		if (isMediumDown) return "1.1rem";
		return "1.2rem";
	};

	return (
		<Box
			sx={{
				width: { xs: "100%", sm: "40%" },
				mb: { xs: 1, sm: 0 },
				mt: { xs: 0.5, sm: 0 },
				px: { xs: 0.5, sm: 0 },
			}}
		>
			<Stack
				direction="row"
				justifyContent={{ xs: "space-between", sm: "flex-start" }}
				spacing={{ xs: 0.5, sm: 1.5, md: 2.5 }}
				sx={{
					py: { xs: 0.5, sm: 0.75, md: 1 },
					px: { xs: 0, sm: 0 },
				}}
			>
				<StatItem
					color={statColors.commits.main}
					icon={<CommitIcon sx={{ fontSize: getIconSize() }} />}
					isLargeScreen={isLargeScreen}
					isMediumDown={isMediumDown}
					isSmallScreen={isSmallScreen}
					label="Commits"
					value={result.commits}
				/>
				<StatItem
					color={statColors.issues.main}
					icon={<IssueIcon sx={{ fontSize: getIconSize() }} />}
					isLargeScreen={isLargeScreen}
					isMediumDown={isMediumDown}
					isSmallScreen={isSmallScreen}
					label="Issues"
					value={result.issues}
				/>
				<StatItem
					color={statColors.prs.main}
					icon={<PRIcon sx={{ fontSize: getIconSize() }} />}
					isLargeScreen={isLargeScreen}
					isMediumDown={isMediumDown}
					isSmallScreen={isSmallScreen}
					label="PRs"
					value={result.prs}
				/>
			</Stack>
		</Box>
	);
};
