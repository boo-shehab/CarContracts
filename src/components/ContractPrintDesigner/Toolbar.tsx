interface ToolbarProps {
  onSave: () => void;
}

const Toolbar = ({ onSave }: ToolbarProps) => {

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button onClick={onSave} className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal md:w-auto">حفظ</button>
    </div>
  );
};

export default Toolbar;
