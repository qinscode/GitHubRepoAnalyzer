import type { ReactNode } from "react";
import type { ThemeConfig } from "../AnalysisThemes";
import { useCollapseStore } from "../../store/useCollapseStore";
import { AnimatedContainer } from "../containers";
import { AnalysisHeader } from "./";
import { HeaderControls } from "../controls";
import { StatsFooter } from "../stats";

interface AnalysisTabLayoutProps {
	title: string;
	description?: string;
	headerTitle?: string;
	statsIcon: ReactNode;
	totalCount: number;
	creatorCount: number;
	creatorLabel: string;
	children: ReactNode;
	theme: ThemeConfig;
}

/**
 * Reusable layout component for analysis tabs
 */
const AnalysisTabLayout = ({
	title,
	description,
	headerTitle,
	statsIcon,
	totalCount,
	creatorCount,
	creatorLabel,
	children,
	theme,
}: AnalysisTabLayoutProps): JSX.Element => {
	const hasContent = Boolean(description || headerTitle);
	const { isAllExpanded, toggleAll } = useCollapseStore();

	return (
		<AnimatedContainer>
			<AnalysisHeader
				title={title}
				description={description}
				headerTitle={headerTitle}
				theme={theme}
			/>
			
			<HeaderControls
				headerTitle={headerTitle}
				isAllExpanded={isAllExpanded}
				toggleAll={toggleAll}
				theme={theme}
			/>

			{children}
			
			{hasContent && (
				<StatsFooter
					title={title}
					totalCount={totalCount}
					creatorCount={creatorCount}
					creatorLabel={creatorLabel}
					statsIcon={statsIcon}
					theme={theme}
				/>
			)}
		</AnimatedContainer>
	);
};

export default AnalysisTabLayout;
