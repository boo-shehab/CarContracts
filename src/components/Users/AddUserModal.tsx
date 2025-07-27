import { Dialog } from '@headlessui/react';
import SuccessModal from '../SuccessModal';
import { useState } from 'react';
import AddUserForm from './AddUserForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [dataInfo, setDataInfo] = useState(null);
  const handleSuccess = (data: any) => {
    setDataInfo(data);
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
          message="تم اضافة المستخدم بنجاح !"
        />
      ) : (
        <AddUserForm onCancel={onClose} onSuccess={(data) => handleSuccess(data)} />
      )}
    </Dialog>
  );
};

export default AddUserModal;
