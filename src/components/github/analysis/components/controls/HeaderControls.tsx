import { Box } from "@mui/material";
import type { ThemeConfig } from "../AnalysisThemes";
import { HeaderTitle } from "../layout";
import { ExpandSwitch } from "./";

interface HeaderControlsProps {
	headerTitle?: string;
	isAllExpanded: boolean;
	toggleAll: () => void;
	theme: ThemeConfig;
}

/**
 * Displays header with title and expand/collapse controls
 */
const HeaderControls = ({
	headerTitle,
	isAllExpanded,
	toggleAll,
	theme,
}: HeaderControlsProps) => {
	if (!headerTitle) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					mb: 2,
					px: 1,
				}}
			>
				<ExpandSwitch
					isExpanded={isAllExpanded}
					theme={theme}
					toggleExpanded={toggleAll}
				/>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				mb: 2,
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<HeaderTitle headerTitle={headerTitle} theme={theme} />
			<ExpandSwitch
				isExpanded={isAllExpanded}
				showLessLabel="Show More Description"
				showMoreLabel="Show Less Description"
				theme={theme}
				toggleExpanded={toggleAll}
			/>
		</Box>
	);
};

export default HeaderControls;
