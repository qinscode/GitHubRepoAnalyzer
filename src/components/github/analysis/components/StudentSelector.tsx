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

interface StudentSelectorProps {
	onReorder?: (activeIndex: number, overIndex: number) => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({ onReorder }) => {
	const { selectedStudent, setSelectedStudent, studentOrder, reorderStudents } = useStudentStore();

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
				Select Student (Drag to Reorder)
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
								isSelected={selectedStudent === student}
								student={student}
								onSelect={() => {
									setSelectedStudent(
										student === selectedStudent ? null : student
									);
								}}
							/>
						))}
					</Box>
				</SortableContext>
			</DndContext>
			{selectedStudent && (
				<Box className="mt-3 text-right">
					<Typography
						className="inline-block cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
						sx={{ fontWeight: 500 }}
						onClick={() => {
							setSelectedStudent(null);
						}}
					>
						Clear Selection
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default StudentSelector; 