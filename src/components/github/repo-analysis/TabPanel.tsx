import { Box, Fade } from "@mui/material";
import type { TabPanelProps } from "./types";
import "../../../styles/FormStyles.css";

function TabPanel(props: TabPanelProps): JSX.Element {
	const { children, value, index, ...other } = props;

	return (
		<div
			aria-labelledby={`repo-tab-${index}`}
			hidden={value !== index}
			id={`repo-tabpanel-${index}`}
			role="tabpanel"
			{...other}
		>
			{value === index && (
				<Fade in={value === index} timeout={{ enter: 600, exit: 200 }}>
					<Box
						className="py-6 relative z-10"
						sx={{
							position: "relative",
							animation:
								value === index ? "fadeInUp 0.5s ease-out forwards" : "none",
							"@keyframes fadeInUp": {
								"0%": { opacity: 0, transform: "translateY(15px)" },
								"100%": { opacity: 1, transform: "translateY(0)" },
							},
							"&::before": {
								content: '""',
								position: "absolute",
								top: -20,
								right: -40,
								width: 200,
								height: 200,
								background:
									"radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, rgba(59, 130, 246, 0) 70%)",
								borderRadius: "50%",
								zIndex: -1,
								opacity: 0.7,
								animation: "pulse 15s infinite alternate ease-in-out",
							},
							"&::after": {
								content: '""',
								position: "absolute",
								bottom: -30,
								left: -50,
								width: 180,
								height: 180,
								background:
									"radial-gradient(circle, rgba(79, 70, 229, 0.03) 0%, rgba(79, 70, 229, 0) 70%)",
								borderRadius: "50%",
								zIndex: -1,
								opacity: 0.5,
								animation: "pulse 12s infinite alternate-reverse ease-in-out",
							},
						}}
					>
						{children}
					</Box>
				</Fade>
			)}
		</div>
	);
}

export default TabPanel;
