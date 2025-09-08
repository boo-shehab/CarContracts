import { Field } from "./types";
import DraggableInput from "./DraggableInput";

const Sidebar = ({ fields }: { fields: Field[] }) => {
  return (
    <div className="w-64 p-4 border-l border-primary-300 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Available Fields</h2>
      <div className="space-y-2">
        {fields.length ? (
          fields.map((field) => <DraggableInput key={field.id} {...field} />)
        ) : (
          <p className="text-gray-400 text-sm">No fields left</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
