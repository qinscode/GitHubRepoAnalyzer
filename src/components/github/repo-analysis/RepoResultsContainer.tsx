import { Box } from "@mui/material";
import { ReactNode } from "react";

interface RepoResultsContainerProps {
	children: ReactNode;
}

function RepoResultsContainer({ children }: RepoResultsContainerProps) {
	return (
		<Box
			sx={{
				position: "relative",
				pt: 2,
				"&::before": {
					content: '""',
					position: "absolute",
					top: -100,
					left: -150,
					width: 300,
					height: 300,
					background:
						"radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)",
					borderRadius: "50%",
					zIndex: -1,
					animation: "pulse 15s infinite alternate ease-in-out",
				},
				"&::after": {
					content: '""',
					position: "absolute",
					bottom: -50,
					right: -100,
					width: 250,
					height: 250,
					background:
						"radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, rgba(236, 72, 153, 0) 70%)",
					borderRadius: "50%",
					zIndex: -1,
					animation: "pulse 12s infinite alternate-reverse ease-in-out",
				},
				"@keyframes pulse": {
					"0%": { opacity: 0.5, transform: "scale(1)" },
					"100%": { opacity: 0.7, transform: "scale(1.1)" },
				},
			}}
		>
			{children}
		</Box>
	);
}

export default RepoResultsContainer;
