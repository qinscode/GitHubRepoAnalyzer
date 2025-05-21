import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DraggableRowProps } from "./types";
import React from "react";

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

  // Clone children and pass drag props only to the first cell (contributor cell)
  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (index === 0) {
      return React.cloneElement(child as React.ReactElement, {
        dragAttributes: attributes,
        dragListeners: listeners,
      });
    }
    return child;
  });

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      data-id={id}
    >
      {childrenWithProps}
    </tr>
  );
};

export default DraggableRow; 