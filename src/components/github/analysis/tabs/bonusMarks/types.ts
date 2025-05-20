import { RepoData } from "@/services/github";

export interface BonusMarksTabProps {
	data: RepoData;
}

export interface BonusMark {
	id: string;
	user: string;
	mark: number;
}

export interface BonusMarkSelectProps {
	mark: number;
	user: string;
	totalBonusMarks: number;
	onMarkChange: (user: string, value: number) => void;
	menuProps: any;
	selectStyles: any;
}

export interface StudentOrderChipProps {
	orderIndex: number;
}

export interface WarningAlertProps {
	totalBonusMarks: number;
}

export interface ContributorItem {
	id: string;
	user: string;
	studentOrderIndex: number;
	mark: number;
}

export interface ContributorsTableProps {
	contributors: Array<string>;
	bonusMarks: Record<string, BonusMark>;
	totalBonusMarks: number;
	handleMarkChange: (user: string, value: number) => void;
	studentOrder: Array<string>;
	menuProps: any;
	selectStyles: any;
	onReorder?: (newOrder: Array<string>) => void;
}

export interface DragHandleProps {
	id: string;
}
