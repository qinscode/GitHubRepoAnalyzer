import { Typography } from "@mui/material";
import { bonusMarksTheme } from "../../components/AnalysisThemes";
import DataTable, { type Column } from "../../../utils/DataTable";
import { ContributorsTableProps } from "./types";
import StudentOrderChip from "./StudentOrderChip";
import BonusMarkSelect from "./BonusMarkSelect";
import DragHandle from "./DragHandle";
import { useState, useEffect } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const ContributorsTable = ({
	contributors,
	bonusMarks,
	totalBonusMarks,
	handleMarkChange,
	studentOrder,
	menuProps,
	selectStyles,
	onReorder,
}: ContributorsTableProps) => {
	// State to track the current order of contributors
	const [sortableContributors, setSortableContributors] =
		useState<Array<string>>(contributors);

	// Update sortable contributors when the contributors prop changes
	useEffect(() => {
		setSortableContributors(contributors);
	}, [contributors]);

	// Set up sensors for drag and drop
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Handle drag end event
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setSortableContributors((items) => {
				const oldIndex = items.indexOf(active.id as string);
				const newIndex = items.indexOf(over.id as string);

				const newOrder = arrayMove(items, oldIndex, newIndex);

				// Call the onReorder callback if provided
				if (onReorder) {
					onReorder(newOrder);
				}

				return newOrder;
			});
		}
	};

	// Transform data for the table
	const tableData = sortableContributors.map((user) => ({
		id: user,
		user,
		dragHandle: user,
		studentOrder: {
			user,
			orderIndex: studentOrder.indexOf(user),
		},
		mark: {
			mark: bonusMarks[user]?.mark ?? 0,
			user,
		},
	}));

	// Define table columns
	const columns: Array<Column> = [
		{
			id: "dragHandle",
			label: "",
			width: "10%",
			format: (value: any) => <DragHandle id={value} />,
		},
		{
			id: "user",
			label: "Contributor",
			width: "25%",
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
			width: "30%",
			align: "center",
			format: (value: any) => {
				const { orderIndex } = value;
				return <StudentOrderChip orderIndex={orderIndex} />;
			},
		},
		{
			id: "mark",
			label: "Bonus Mark",
			width: "35%",
			format: (value: any) => {
				const { mark, user: currentUser } = value;
				return (
					<BonusMarkSelect
						mark={mark}
						menuProps={menuProps}
						selectStyles={selectStyles}
						totalBonusMarks={totalBonusMarks}
						user={currentUser}
						onMarkChange={handleMarkChange}
					/>
				);
			},
		},
	];

	return (
		<DndContext
			collisionDetection={closestCenter}
			sensors={sensors}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={sortableContributors}
				strategy={verticalListSortingStrategy}
			>
				<DataTable
					columns={columns}
					data={tableData}
					emptyMessage="No contributors available for this repository."
					getRowKey={(row): string => row.id as string}
					lightColor={bonusMarksTheme.light}
					lighterColor={bonusMarksTheme.lighter}
					primaryColor={bonusMarksTheme.main}
				/>
			</SortableContext>
		</DndContext>
	);
};

export default ContributorsTable;
