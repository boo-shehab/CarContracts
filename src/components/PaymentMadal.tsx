import React from "react";
import { Dialog } from "@headlessui/react";
import axios from "../services/axios";
import { MdPayment } from "react-icons/md";
import { toast } from "react-toastify";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
  apiEndpoint?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onSuccess,
  title = "تأكيد الدفع",
  description = "هل انت متأكد ان المبلغ دفع؟ لا يمكن التراجع عن هذا الإجراء.",
  loading = false,
  apiEndpoint,
}) => {
  const [isLoading, setIsLoading] = React.useState(loading);

  if (!open) return null;

  const handlePayment = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      if (apiEndpoint) {
        await axios.put(apiEndpoint);
      }
      toast.success("تم الدفع بنجاح");
      onSuccess();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء الدفع";
      toast.error(message);
      console.error("Error paying installment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/30" />
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full z-50 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <MdPayment className="text-green-500 text-4xl" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-green-600 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg w-full disabled:opacity-50"
          >
            {isLoading ? "جارِ الدفع..." : "نعم، ادفع"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg w-full"
          >
            إلغاء
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentModal;
