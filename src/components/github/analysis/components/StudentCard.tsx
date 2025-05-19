import { Box, Typography, Avatar } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface StudentCardProps {
	student: string;
	id: string;
	index?: number;
}

const StudentCard = ({
	student,
	id,
	index = 0,
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
	};
	
	// Generate a consistent color based on the index
	const generateColor = (index: number) => {
		const colors = [
			'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)', // blue
			'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', // purple
			'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)', // pink
			'linear-gradient(135deg, #10B981 0%, #34D399 100%)', // green
		];
		return colors[index % colors.length];
	};

	return (
		<Box
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			sx={{
				width: { xs: "calc(50% - 12px)", sm: "180px" },
				minWidth: "150px",
				maxWidth: "200px",
				cursor: isDragging ? "grabbing" : "grab",
				height: "fit-content",
				touchAction: "none",
			}}
		>
			<Box
				className="rounded-3xl"
				sx={{
					padding: "1.25rem 0.75rem",
					border: isDragging 
						? "2px solid #3B82F6" 
						: "1.5px solid #E5E7EB",
					boxShadow: isDragging
						? "0 8px 24px rgba(59, 130, 246, 0.18)"
						: "0 2px 8px rgba(59, 130, 246, 0.08)",
					background: "#ffffff",
					borderRadius: "18px",
					position: "relative",
					"&:hover": {
						boxShadow: "0 8px 32px rgba(59, 130, 246, 0.12)",
						borderColor: "#3B82F6",
					},
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					minHeight: "140px",
					transition: "box-shadow 0.2s ease, border-color 0.2s ease",
				}}
			>
				{/* 序号圆点 */}
				<Box
					sx={{
						position: "absolute",
						top: 10,
						left: 10,
						zIndex: 2,
						width: 24,
						height: 24,
						borderRadius: "50%",
						background: generateColor(index),
						color: "#fff",
						fontWeight: 700,
						fontSize: "0.85rem",
						boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						border: "2px solid #fff",
					}}
				>
					{index + 1}
				</Box>
				
				{/* 头像 */}
				<Avatar
					sx={{
						width: 48,
						height: 48,
						mb: 1.5,
						fontWeight: 700,
						fontSize: "1.3rem",
						background: generateColor(index),
						border: "3px solid #fff",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
					}}
				>
					{student.charAt(0).toUpperCase()}
				</Avatar>
				
				{/* 名字 */}
				<Typography
					sx={{
						fontWeight: 700,
						fontSize: "1rem",
						color: "#22223B",
						textAlign: "center",
						maxWidth: "90%",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{student}
				</Typography>
			</Box>
		</Box>
	);
};

export default StudentCard;