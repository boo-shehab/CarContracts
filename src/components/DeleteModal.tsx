import React from "react";
import { Dialog } from '@headlessui/react';
import axios from "../services/axios"; 

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

            onDelete();
            onClose();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-30" />
            <div className="bg-white rounded-lg p-6 z-50">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p className="mb-4">{description}</p>
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-2">
                        Cancel
                    </button>
                    <button onClick={handleDelete} className="bg-red-500 text-white">
                        Delete
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default DeleteModal;