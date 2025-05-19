import { Box, Typography, Avatar } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface StudentCardProps {
	student: string;
	isSelected: boolean;
	onSelect: () => void;
	id: string;
}

const StudentCard = ({
	student,
	isSelected,
	onSelect,
	id,
}: StudentCardProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 1,
		opacity: isDragging ? 0.8 : 1,
	};

	return (
		<Box
			ref={setNodeRef}
			style={style}
			{...attributes}
			sx={{
				width: { xs: "calc(50% - 8px)", sm: "calc(25% - 12px)" },
				cursor: "grab",
			}}
		>
			<Box
				className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
					isSelected
						? "bg-blue-500 text-white shadow-lg"
						: "bg-white hover:bg-blue-50"
				}`}
				sx={{
					border: "1px solid",
					borderColor: isSelected ? "transparent" : "rgba(0,0,0,0.1)",
					boxShadow: isSelected
						? "0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)"
						: "0 1px 3px rgba(0,0,0,0.05)",
				}}
				onClick={onSelect}
				{...listeners}
			>
				<Box className="flex items-center">
					<Avatar
						className={`w-10 h-10 mr-3 text-[1rem]`}
						sx={{
							background: isSelected
								? "rgba(255,255,255,0.2)"
								: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)",
							color: isSelected ? "white" : "white",
							fontWeight: 500,
							boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
						}}
					>
						{student.charAt(0).toUpperCase()}
					</Avatar>
					<Typography
						sx={{
							fontWeight: 500,
							fontSize: "1rem",
						}}
					>
						{student}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default StudentCard; 