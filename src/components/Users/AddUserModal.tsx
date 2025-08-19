import { Dialog } from '@headlessui/react';
import SuccessModal from '../SuccessModal';
import { useState } from 'react';
import AddUserForm from './AddUserForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  isEdit?: boolean;
}

const AddUserModal = ({ isOpen, onClose, onSuccess, initialData, isEdit }: Props) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_dataInfo, setDataInfo] = useState(null);
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
          message={isEdit ? "تم تعديل المستخدم بنجاح !" : "تم اضافة المستخدم بنجاح !"}
        />
      ) : (
        <AddUserForm
          onCancel={onClose}
          onSuccess={(data) => handleSuccess(data)}
          initialData={initialData}
          isEdit={isEdit}
        />
      )}
    </Dialog>
  );
};

export default AddUserModal;
