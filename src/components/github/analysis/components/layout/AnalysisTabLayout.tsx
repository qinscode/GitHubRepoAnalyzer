import type { ReactNode } from "react";
import type { ThemeConfig } from "../AnalysisThemes";
import { useCollapseStore } from "@/hooks";
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
}: AnalysisTabLayoutProps) => {
	const hasContent = Boolean(description || headerTitle);
	const { isAllExpanded, toggleAll } = useCollapseStore();

	return (
		<AnimatedContainer>
			<AnalysisHeader
				description={description}
				headerTitle={headerTitle}
				theme={theme}
				title={title}
			/>

			<HeaderControls
				headerTitle={headerTitle}
				isAllExpanded={isAllExpanded}
				theme={theme}
				toggleAll={toggleAll}
			/>

			{children}

			{hasContent && (
				<StatsFooter
					creatorCount={creatorCount}
					creatorLabel={creatorLabel}
					statsIcon={statsIcon}
					theme={theme}
					title={title}
					totalCount={totalCount}
				/>
			)}
		</AnimatedContainer>
	);
};

export default AnalysisTabLayout;
