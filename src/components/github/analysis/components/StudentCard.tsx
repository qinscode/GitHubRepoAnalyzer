import { Box, Typography, Avatar } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface StudentCardProps {
	student: string;
	id: string;
}

const StudentCard = ({
	student,
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
				className="p-4 rounded-xl transition-all duration-200 bg-white hover:bg-blue-50"
				sx={{
					border: "1px solid rgba(0,0,0,0.1)",
					boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
				}}
				{...listeners}
			>
				<Box className="flex items-center">
					<Avatar
						className="w-10 h-10 mr-3 text-[1rem]"
						sx={{
							background: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)",
							color: "white",
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