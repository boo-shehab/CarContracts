import { useDrag } from "react-dnd";
import { ItemTypes, Field } from "./types";

const DraggableInput = ({ label, id }: Field) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.INPUT,
    item: { label, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return drag(
    <div
      className={`p-2 border rounded bg-white shadow-sm cursor-move mb-2 
        transition-opacity ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      {label}
    </div>
  );
};

export default DraggableInput;
