import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DraggableRowProps } from "./types";

const DraggableRow = ({ id, children }: DraggableRowProps) => {
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
    position: "relative" as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      {...listeners}
      data-id={id}
    >
      {children}
    </tr>
  );
};

export default DraggableRow; 