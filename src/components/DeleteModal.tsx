import React from "react";
import { Dialog } from '@headlessui/react';
import axios from "../services/axios"; 
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";

interface DeleteModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    title?: string;
    description?: string;
    loading?: boolean;
    apiEndpoint?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    open,
    onClose,
    onDelete,
    title = "Delete Confirmation",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    loading = false,
    apiEndpoint,
}) => {

    if (!open) return null;

    const handleDelete = async () => {
        if (loading) return;

        try {
            if(apiEndpoint) {
                await axios.delete(apiEndpoint);
            }
            toast.success("تم الحذف بنجاح");
            onDelete();
            onClose();
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "حدث خطأ أثناء الحذف";
        toast.error(message);
            console.error("Error deleting item:", error);
        }
    };

    return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" />
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full z-50 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-4">
            <MdDeleteForever className="text-red-500 text-4xl" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-red-600 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg w-full disabled:opacity-50"
          >
            {loading ? "جارِ الحذف..." : "نعم، احذف"}
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

export default DeleteModal;