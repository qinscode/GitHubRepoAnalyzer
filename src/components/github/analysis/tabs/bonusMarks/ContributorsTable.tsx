import { useState } from "react";
import { bonusMarksTheme } from "../../components/AnalysisThemes";
import DataTable, { type Column } from "../../../utils/DataTable";
import { ContributorsTableProps } from "./types";
import StudentOrderChip from "./StudentOrderChip";
import BonusMarkSelect from "./BonusMarkSelect";
import ContributorCell from "./ContributorCell";
import DraggableRow from "./DraggableRow";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import {
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
	const [activeId, setActiveId] = useState<string | null>(null);

	// Set up DnD sensors with relaxed constraints
	const sensors = useSensors(
		useSensor(PointerSensor, {
			// Lower activation constraint for easier dragging
			activationConstraint: {
				distance: 1,
				tolerance: 5,
				delay: 0,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Handle drag end
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		setActiveId(null);

		if (over && active.id !== over.id && onReorder) {
			const activeId = String(active.id);
			const overId = String(over.id);
			onReorder(activeId, overId);
		}
	};

	// Handle drag start
	const handleDragStart = (event: DragStartEvent) => {
		const id = String(event.active.id);
		setActiveId(id);
	};

	// 根据studentOrder排序贡献者
	const sortedContributors = [...contributors].sort((a, b) => {
		const indexA = studentOrder.indexOf(a);
		const indexB = studentOrder.indexOf(b);
		
		// 如果两者都在学生顺序中
		if (indexA !== -1 && indexB !== -1) {
			return indexA - indexB; // 按学生顺序排序
		}
		
		// 如果只有一个在学生顺序中，优先显示该学生
		if (indexA !== -1) return -1;
		if (indexB !== -1) return 1;
		
		// 对于不在学生顺序中的用户，按字母顺序排序
		return a.localeCompare(b);
	});

	// Transform data for the table
	const tableData = sortedContributors.map((user) => ({
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
	}));

	// Define table columns
	const columns: Array<Column> = [
		{
			id: "user",
			label: "Contributor",
			width: "30%",
			format: (value: string) => value, // We'll handle this specially in renderRow
		},
		{
			id: "studentOrder",
			label: "Student Order",
			width: "35%",
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

	// Custom row renderer for DataTable
	const renderRow = (row: any, columns: Array<Column>) => {
		return (
			<DraggableRow key={row.id} id={row.id}>
				{columns.map((column, index) => {
					const value = row[column.id];

					// Special handling for the first column (contributor cell)
					if (index === 0 && column.id === "user") {
						return (
							<td
								key={column.id}
								style={{
									textAlign: column.align || "left",
									padding: "12px 16px",
									borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
								}}
							>
								<ContributorCell
									dragAttributes={row.dragAttributes}
									dragListeners={row.dragListeners}
									isDragging={value === activeId}
									value={value}
								/>
							</td>
						);
					}

					return (
						<td
							key={column.id}
							style={{
								textAlign: column.align || "left",
								padding: "12px 16px",
								borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
							}}
						>
							{column.format ? column.format(value) : value}
						</td>
					);
				})}
			</DraggableRow>
		);
	};

	return (
		<DndContext
			collisionDetection={closestCenter}
			sensors={sensors}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
		>
			<SortableContext
				items={sortedContributors}
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
					renderRow={renderRow}
				/>
			</SortableContext>
		</DndContext>
	);
};

export default ContributorsTable;
