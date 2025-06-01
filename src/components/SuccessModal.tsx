import { IoCheckmark } from 'react-icons/io5';

interface SuccessModalProps {
  message?: string;
  onClose: () => void;
  open?: boolean;
}

const SuccessModal = ({
  message = 'تم اضافة الشركة بنجاح !',
  onClose,
  open,
}: SuccessModalProps) => {
  if (!open) return null;
  return (
    <div className="bg-white z-10 rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col items-center">
      <div className="w-[75px] h-[75px] bg-blue-400/50 rounded-full flex items-center justify-center mb-4">
        <IoCheckmark size={40} className="text-white bg-blue-400 rounded-full p-2" />
      </div>
      <div className="text-blue-500 text-xl font-medium mb-6 text-center">{message}</div>
      <button
        onClick={onClose}
        className="w-full py-2 rounded-lg bg-blue-400 text-white text-xl font-bold hover:bg-blue-500 transition"
      >
        موافق
      </button>
    </div>
  );
};

export default SuccessModal;
