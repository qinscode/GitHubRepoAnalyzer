import { Box, Typography, Stack, Fade } from "@mui/material";
import { useState, useEffect } from "react";

import type { RepoResult } from "../../../types/github";
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

// Main component
function BatchResults({ results }: BatchResultsProps): JSX.Element {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Delay mounting to ensure smooth animation
		const timer = setTimeout(() => {
			setMounted(true);
		}, 100);

		return () => {
			clearTimeout(timer);
			setMounted(false);
		};
	}, []);

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
						mountOnEnter
						unmountOnExit
						in={mounted}
						style={{ transitionDelay: `${index * 80}ms` }}
						timeout={500}
					>
						<div>
							<RepoCard index={index} result={result} />
						</div>
					</Fade>
				))}
			</Stack>
		</Box>
	);
}

export default BatchResults;
