import { Box, Typography } from "@mui/material";
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
	SortableContext,
	sortableKeyboardCoordinates,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useStudentStore } from "@/store/useStudentStore";
import StudentCard from "./StudentCard";

interface StudentOrdererProps {
	onReorder?: (activeIndex: number, overIndex: number) => void;
}

const StudentOrderer: React.FC<StudentOrdererProps> = ({ onReorder }) => {
	const { studentOrder, reorderStudents } = useStudentStore();

	// Set up DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
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

	return (
		<Box className="mb-6">
			<Typography className="mb-3" sx={{ fontWeight: 500 }} variant="h6">
				Student Order (Drag to Reorder)
			</Typography>
			<DndContext
				collisionDetection={closestCenter}
				sensors={sensors}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={studentOrder.map((student) => `student-${student}`)}
					strategy={horizontalListSortingStrategy}
				>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
						{studentOrder.map((student) => (
							<StudentCard
								key={`student-${student}`}
								id={`student-${student}`}
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