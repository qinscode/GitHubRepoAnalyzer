import { useState } from "react";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Button,
	Collapse,
	Avatar,
	Tooltip,
	Stack,
	Divider,
	alpha,
	IconButton,
	Fade,
	useTheme,
} from "@mui/material";
import {
	Commit as CommitIcon,
	BugReport as IssueIcon,
	MergeType as PRIcon,
	KeyboardArrowDown as ExpandIcon,
	KeyboardArrowUp as CollapseIcon,
	GitHub as GitHubIcon,
	ContentCopy as CopyIcon,
	OpenInNew as OpenInNewIcon,
	Check as CheckIcon,
} from "@mui/icons-material";
import RepoResults from "./RepoResults.tsx";
import type { RepoResult } from "../types/batchRepoTypes";
import { RepoCard } from "./RepoCard";

// TypeScript declaration for Tauri globals
declare global {
	interface Window {
		__TAURI__?: {
			shell: {
				open: (url: string) => Promise<void>;
			};
		};
	}
}

interface BatchResultsProps {
	results: Array<RepoResult>;
}

// Custom color configuration
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
	contributors: {
		main: "#16a34a",
		light: "rgba(22, 163, 74, 0.1)",
		gradient: "linear-gradient(45deg, #16a34a, #22c55e)",
	},
};

// Statistics item component
const StatItem = ({
	icon,
	label,
	value,
	color,
}: {
	icon: React.ReactNode;
	label: string;
	value: number;
	color: string;
}): JSX.Element => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				transition: "transform 0.2s ease",
				"&:hover": {
					transform: "translateY(-2px)",
				},
			}}
		>
			<Box
				sx={{
					color,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{icon}
			</Box>
			<Typography
				variant="h6"
				sx={{
					fontWeight: 600,
					fontSize: "1.1rem",
					color,
				}}
			>
				{value}
			</Typography>
			<Typography
				variant="caption"
				sx={{
					color: alpha(color, 0.7),
					fontWeight: 500,
					fontSize: "0.75rem",
				}}
			>
				{label}
			</Typography>
		</Box>
	);
};

// Main component
function BatchResults({ results }: BatchResultsProps): JSX.Element {
	return (
		<Box
			sx={{
				animation: "fadeIn 0.5s ease-out forwards",
				"@keyframes fadeIn": {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				position: "relative",
				"&::before": {
					content: '""',
					position: "absolute",
					top: -100,
					left: -150,
					width: 300,
					height: 300,
					background:
						"radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 70%)",
					borderRadius: "50%",
					zIndex: -1,
				},
				"&::after": {
					content: '""',
					position: "absolute",
					bottom: -100,
					right: -150,
					width: 300,
					height: 300,
					background:
						"radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, rgba(79, 70, 229, 0) 70%)",
					borderRadius: "50%",
					zIndex: -1,
				},
			}}
		>
			<Box sx={{ mb: 4 }}>
				<Typography
					color="text.secondary"
					sx={{ mb: 3, maxWidth: "800px" }}
					variant="body1"
				>
					Analyzed {results.length} repositories. Click on "View Details" to see
					comprehensive analysis for each repository.
				</Typography>
			</Box>

			<Stack spacing={2.5}>
				{results.map((result, index) => (
					<Fade
						key={result.repoUrl}
						in
						style={{ transitionDelay: `${index * 80}ms` }}
					>
						<RepoCard result={result} index={index} />
					</Fade>
				))}
			</Stack>
		</Box>
	);
}

export default BatchResults;
