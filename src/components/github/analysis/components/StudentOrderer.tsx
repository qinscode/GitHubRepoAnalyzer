import { Box, Typography } from "@mui/material";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	MeasuringStrategy,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useStudentStore } from "@/store/useStudentStore";
import StudentCard from "./StudentCard";
import { DragIndicator as DragIcon } from "@mui/icons-material";

interface StudentOrdererProps {
	onReorder?: (activeIndex: number, overIndex: number) => void;
}

const StudentOrderer: React.FC<StudentOrdererProps> = ({ onReorder }) => {
	const { studentOrder, reorderStudents } = useStudentStore();

	// Set up DnD sensors with improved settings
	const sensors = useSensors(
		useSensor(PointerSensor, {
			// 降低激活距离，使拖拽更容易触发
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
			const activeIndex = studentOrder.findIndex(
				(student) => `student-${student}` === active.id
			);
			const overIndex = studentOrder.findIndex(
				(student) => `student-${student}` === over.id
			);

			if (activeIndex !== -1 && overIndex !== -1) {
				reorderStudents(activeIndex, overIndex);

				// Call the optional callback if provided
				if (onReorder) {
					onReorder(activeIndex, overIndex);
				}
			}
		}
	};

	// measurements for the drag-and-drop context
	const measuring = {
		droppable: {
			strategy: MeasuringStrategy.Always,
		},
	};

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					mb: 2,
					position: "relative",
					"&::after": {
						content: '""',
						position: "absolute",
						bottom: -8,
						left: 0,
						width: "60px",
						height: "3px",
						borderRadius: "2px",
						background: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)",
					},
				}}
			>
				<DragIcon
					sx={{
						color: "#3B82F6",
						mr: 1.5,
						fontSize: "1.3rem",
						animation: "pulse 2s infinite",
						"@keyframes pulse": {
							"0%": { opacity: 0.6, transform: "scale(1)" },
							"50%": { opacity: 1, transform: "scale(1.1)" },
							"100%": { opacity: 0.6, transform: "scale(1)" },
						},
					}}
				/>
				<Typography
					variant="h6"
					sx={{
						fontWeight: 400,
						fontSize: "1.25rem",
						color: "#3B82F6",
						letterSpacing: "0.01em",
					}}
				>
					Student Order{" "}
					<span
						style={{
							fontSize: "0.9rem",
							color: "#6B7280",
							fontWeight: 500,
						}}
					>
						(Drag to Reorder)
					</span>
				</Typography>
			</Box>

			<Typography
				variant="body2"
				sx={{
					fontWeight: 600,
					color: "text.secondary",
					mb: 3,
					ml: 0.5,
					fontSize: "0.7rem",
					fontStyle: "italic",
				}}
			>
				Drag cards to change display order. All data will follow this order.
				Easier to record bonus marks.
			</Typography>

			<DndContext
				collisionDetection={closestCenter}
				measuring={measuring}
				sensors={sensors}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={studentOrder.map((student) => `student-${student}`)}
					strategy={horizontalListSortingStrategy}
				>
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 3,
							justifyContent: { xs: "center", sm: "flex-start" },
							minHeight: "180px",
							paddingBottom: "24px",
						}}
					>
						{studentOrder.map((student, index) => (
							<StudentCard
								key={`student-${student}`}
								id={`student-${student}`}
								index={index}
								student={student}
							/>
						))}
					</Box>
				</SortableContext>
			</DndContext>
		</Box>
	);
};

export default StudentOrderer;
