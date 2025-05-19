import { useState, useMemo } from "react";
import {
	Box,
	Typography,
	Select,
	MenuItem,
	FormControl,
	Alert,
	alpha,
	Chip,
} from "@mui/material";
import {
	EmojiEvents as BonusIcon,
	Warning as WarningIcon,
} from "@mui/icons-material";
import { bonusMarksTheme } from "../components/AnalysisThemes";
import DataTable, { type Column } from "../../utils/DataTable";
import AnalysisTabLayout from "../components/layout/AnalysisTabLayout.tsx";
import { RepoData } from "@/services/github";
import { useStudentStore } from "@/store/useStudentStore";

interface BonusMarksTabProps {
	data: RepoData;
}

interface BonusMark {
	id: string;
	user: string;
	mark: number;
}

function BonusMarksTab({ data }: BonusMarksTabProps) {
	const { studentOrder } = useStudentStore();

	// Get all unique contributors from commits, issues, and PRs
	const contributors = useMemo(() => {
		const uniqueContributors = new Set<string>();

		// Add contributors from commits
		Object.keys(data.commits || {}).forEach((contributor) =>
			uniqueContributors.add(contributor)
		);
		// Add contributors from issues
		Object.keys(data.issues || {}).forEach((contributor) =>
			uniqueContributors.add(contributor)
		);
		// Add contributors from PRs
		Object.keys(data.prs || {}).forEach((contributor) =>
			uniqueContributors.add(contributor)
		);

		// Convert to array and sort by student order
		return Array.from(uniqueContributors).sort((a, b) => {
			const indexA = studentOrder.indexOf(a);
			const indexB = studentOrder.indexOf(b);

			// If both users are in the student order
			if (indexA !== -1 && indexB !== -1) {
				return indexA - indexB; // Sort by student order
			}

			// If only one is in the student order, prioritize that one
			if (indexA !== -1) return -1;
			if (indexB !== -1) return 1;

			// For users not in the student order, sort alphabetically
			return a.localeCompare(b);
		});
	}, [data, studentOrder]);

	// State to store bonus marks for each contributor
	const [bonusMarks, setBonusMarks] = useState<Record<string, BonusMark>>(
		Object.fromEntries(
			contributors.map((user) => [
				user,
				{
					id: user,
					user,
					mark: 0,
				},
			])
		)
	);

	// Calculate total bonus marks
	const totalBonusMarks = useMemo(
		() => Object.values(bonusMarks).reduce((sum, { mark }) => sum + mark, 0),
		[bonusMarks]
	);

	// Handle bonus mark change
	const handleMarkChange = (user: string, value: number): void => {
		const currentMark = bonusMarks[user]?.mark ?? 0;
		const newTotal = totalBonusMarks - currentMark + value;

		// Only allow the change if the new total would be <= 4
		if (newTotal <= 4) {
			setBonusMarks((previous) => ({
				...previous,
				[user]: {
					...previous[user],
					mark: value,
				} as BonusMark,
			}));
		}
	};

	// Transform data for the table
	const tableData = useMemo(
		() =>
			contributors.map((user) => ({
				id: user,
				user,
				studentOrder: {
					user,
					orderIndex: studentOrder.indexOf(user),
				},
				mark: {
					mark: bonusMarks[user]?.mark ?? 0,
					user,
				},
			})),
		[contributors, bonusMarks, studentOrder]
	);

	const selectStyles = {
		fontFamily: "inherit",
		fontSize: "0.95rem",
		color: bonusMarksTheme.main,
		backgroundColor: "#FFFFFF",
		borderRadius: "8px",
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: alpha(bonusMarksTheme.main, 0.2),
			borderWidth: "1px",
			transition: "all 0.2s ease-in-out",
		},
		"&:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: bonusMarksTheme.main,
			borderWidth: "1px",
		},
		"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: bonusMarksTheme.main,
			borderWidth: "1px",
		},
		"& .MuiSelect-select": {
			padding: "8px 14px",
			display: "flex",
			alignItems: "center",
		},
		"& .MuiSelect-icon": {
			color: bonusMarksTheme.main,
			right: "12px",
		},
	};

	const menuProps = {
		PaperProps: {
			sx: {
				marginTop: "4px",
				borderRadius: "8px",
				boxShadow:
					"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
				"& .MuiMenuItem-root": {
					fontSize: "0.95rem",
					fontFamily: "inherit",
					padding: "8px 16px",
					"&:hover": {
						backgroundColor: alpha(bonusMarksTheme.light, 0.5),
					},
					"&.Mui-selected": {
						backgroundColor: alpha(bonusMarksTheme.main, 0.1),
						"&:hover": {
							backgroundColor: alpha(bonusMarksTheme.main, 0.15),
						},
					},
					"&.Mui-disabled": {
						opacity: 0.5,
					},
				},
			},
		},
	};

	// Define table columns
	const columns: Array<Column> = [
		{
			id: "user",
			label: "Contributor",
			width: "30%",
			format: (value: string) => (
				<Typography
					sx={{
						fontWeight: 500,
						color: "rgba(55, 65, 81, 0.9)",
						fontFamily: "inherit",
						fontSize: "0.95rem",
					}}
				>
					{value}
				</Typography>
			),
		},
		{
			id: "studentOrder",
			label: "Student Order",
			width: "35%",
			format: (value: any) => {
				const { orderIndex } = value;

				// If the user is in the student order, display their position (1-based)
				if (orderIndex !== -1) {
					return (
						<Box
							sx={{
								display: "flex",
								alignItems: "left",
								justifyContent: "center",
							}}
						>
							<Chip
								label={orderIndex + 1}
								sx={{
									backgroundColor: alpha(bonusMarksTheme.main, 0.1),
									color: bonusMarksTheme.main,
									fontWeight: 600,
									fontSize: "0.95rem",
									minWidth: "32px",
									height: "32px",
									border: `1px solid ${alpha(bonusMarksTheme.main, 0.2)}`,
								}}
							/>
						</Box>
					);
				}

				// If not in student order, show a dash
				return (
					<Typography
						sx={{
							color: "text.secondary",
							fontStyle: "italic",
							textAlign: "center",
						}}
					>
						-
					</Typography>
				);
			},
		},
		{
			id: "mark",
			label: "Bonus Mark",
			width: "35%",
			format: (value: any) => {
				const { mark, user: currentUser } = value;

				// Calculate what the new total would be if this mark was changed
				const calculateNewTotal = (newMark: number) => {
					return totalBonusMarks - mark + newMark;
				};

				// Check if a mark value would exceed the total limit
				const wouldExceedLimit = (newMark: number) => {
					return calculateNewTotal(newMark) > 4;
				};

				return (
					<FormControl size="small" sx={{ minWidth: 120 }}>
						<Select
							MenuProps={menuProps}
							value={mark}
							sx={{
								...selectStyles,
								...(wouldExceedLimit(4) && {
									opacity: 0.7,
									cursor: "not-allowed",
									backgroundColor: alpha("#FFFFFF", 0.5),
								}),
							}}
							onChange={(event_) => {
								const newMark = Number(event_.target.value);
								if (!wouldExceedLimit(newMark)) {
									handleMarkChange(currentUser, newMark);
								}
							}}
						>
							{[0, 1, 2, 3, 4].map((m) => (
								<MenuItem key={m} disabled={wouldExceedLimit(m)} value={m}>
									{m}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				);
			},
		},
	];

	return (
		<AnalysisTabLayout
			creatorCount={contributors.length}
			creatorLabel="Total"
			showMoreSwitch={false}
			theme={bonusMarksTheme}
			title="Bonus Marks Analysis"
			totalCount={contributors.length}
			statsIcon={
				<BonusIcon
					sx={{
						color: bonusMarksTheme.main,
						fontSize: "1.1rem",
						filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
					}}
				/>
			}
		>
			<Box sx={{ position: "relative", overflow: "auto" }}>
				{totalBonusMarks > 4 && (
					<Alert
						icon={<WarningIcon sx={{ color: bonusMarksTheme.textColor }} />}
						severity="warning"
						sx={{
							mb: 2,
							borderRadius: "8px",
							backgroundColor: alpha(bonusMarksTheme.light, 0.5),
							"& .MuiAlert-message": {
								color: bonusMarksTheme.textColor,
								fontFamily: "inherit",
								fontSize: "0.95rem",
							},
						}}
					>
						Total bonus marks cannot exceed 4. Current total: {totalBonusMarks}
					</Alert>
				)}
				<DataTable
					columns={columns}
					data={tableData}
					emptyMessage="No contributors available for this repository."
					getRowKey={(row): string => row.id as string}
					lightColor={bonusMarksTheme.light}
					lighterColor={bonusMarksTheme.lighter}
					primaryColor={bonusMarksTheme.main}
				/>
			</Box>
		</AnalysisTabLayout>
	);
}

export default BonusMarksTab;
