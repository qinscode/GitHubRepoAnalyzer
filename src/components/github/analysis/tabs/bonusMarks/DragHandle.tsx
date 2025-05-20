import { DragHandle as DragHandleIcon } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleProps } from "./types";

const DragHandle = ({ id }: DragHandleProps) => {
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
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      "& .MuiSvgIcon-root": {
        color: "rgba(0, 0, 0, 0.7)",
      }
    },
    "&:active": {
      cursor: "grabbing",
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
    touchAction: "none", // Prevent scrolling on touch devices when dragging
  };

  return (
    <Box
      ref={setNodeRef}
      sx={style}
      {...attributes}
      {...listeners}
      title="Drag to reorder"
    >
      <DragHandleIcon 
        fontSize="small" 
        sx={{ 
          color: "rgba(0, 0, 0, 0.4)",
          transition: "color 0.2s ease",
        }} 
      />
    </Box>
  );
};

export default DragHandle; 