interface ToolbarProps {
  onSave: () => void;
  onClearImage: () => void;
  onClearFields: () => void;
  onDeleteAll: () => void;
}

const Toolbar = ({ onSave, onClearImage, onClearFields, onDeleteAll }: ToolbarProps) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        onClick={onSave}
        className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal md:w-auto"
      >
        حفظ
      </button>

      <button
        onClick={onClearImage}
        className="bg-red-500 border border-red-500 rounded-2xl py-2 px-4 text-white text-xl font-normal md:w-auto"
      >
        حذف الصورة
      </button>

      <button
        onClick={onClearFields}
        className="bg-yellow-500 border border-yellow-500 rounded-2xl py-2 px-4 text-white text-xl font-normal md:w-auto"
      >
        حذف الحقول
      </button>

      <button
        onClick={onDeleteAll}
        className="bg-gray-700 border border-gray-700 rounded-2xl py-2 px-4 text-white text-xl font-normal md:w-auto"
      >
        حذف الكل
      </button>
    </div>
  );
};

export default Toolbar;
