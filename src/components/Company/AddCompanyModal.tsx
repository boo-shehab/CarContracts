import { Dialog } from '@headlessui/react';
import AddCompanyForm from './AddCompanyForm';
import SuccessModal from '../SuccessModal';
import { useState } from 'react';
import { CompanyFormData } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  isEdit?: boolean;
}

const AddCompanyModal = ({ isOpen, onClose, onSuccess, initialData, isEdit=false }: Props) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [dataInfo, setDataInfo] = useState<CompanyFormData | null>(null);
  const handleSuccess = (data: CompanyFormData) => {
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
          data={dataInfo}
          message={isEdit ? "تم تعديل الشركة بنجاح !" : "تم اضافة الشركة بنجاح !"}
        />
      ) : (
        <AddCompanyForm 
          onCancel={onClose} 
          onSuccess={(data) => handleSuccess(data)} 
          initialData={initialData}
          isEdit={isEdit} />
      )}
    </Dialog>
  );
};

export default AddCompanyModal;
