import { Dialog } from '@headlessui/react';
import AddCompanyForm from './AddCompanyForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCompanyModal = ({ isOpen, onClose, onSuccess }: Props) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white rounded-xl shadow-lg z-10 w-full h-10/12 overflow-x-auto max-w-lg p-6">
        <AddCompanyForm onCancel={onClose} onSuccess={onSuccess} />
      </div>
    </Dialog>
  );
};

export default AddCompanyModal;
