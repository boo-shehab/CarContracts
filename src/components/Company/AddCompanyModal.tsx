import { Dialog } from '@headlessui/react';
import AddCompanyForm from './AddCompanyForm';
import SuccessModal from '../SuccessModal';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCompanyModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsSuccessModalOpen(true);
  };

  const handleCloseInSuccessModal = () => {
    onSuccess();
    setIsSuccessModalOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" />
      {isSuccessModalOpen ? (
        <SuccessModal
          onClose={handleCloseInSuccessModal}
          open={isSuccessModalOpen}
          message="تم اضافة الشركة بنجاح !"
        />
      ) : (
        <AddCompanyForm onCancel={onClose} onSuccess={handleSuccess} />
      )}
    </Dialog>
  );
};

export default AddCompanyModal;
