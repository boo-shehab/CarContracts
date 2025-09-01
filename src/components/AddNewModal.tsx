import { Dialog } from '@headlessui/react';
import { CiCirclePlus } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import SelectCardTypeModal from './SelectCardTypeModal';
import { useState } from 'react';
import { hasPermission } from '../utilities/permissions';
import { ALL_PERMISSIONS } from '../utilities/allPermissions';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddCompanyModal = ({ isOpen, onClose }: Props) => {
  const [isSelectCardTypeModalOpen, setIsSelectCardTypeModalOpen] = useState(false);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black opacity-30" />
        {/* Modal content */}
        <div className="bg-white rounded-xl shadow-lg z-10 w-full max-h-11/12 overflow-x-auto max-w-lg p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between w-full gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">اختار نوع البطاقة</h2>
            <button type="button" onClick={onClose} className="text-neutral-400 hover:text-black">
              <IoCloseOutline size={24} />
            </button>
          </div>
          <div>
            <hr className="border-t-1 border-t-neutral-100" />
          </div>
          {/* Modal Body */}
          <div className="flex flex-col gap-4 mt-4">
            <div
              onClick={() => setIsSelectCardTypeModalOpen(true)}
              className="bg-white shadow-[1px_2px_16px_0px_#4899EA1F] text-primary-500 rounded-2xl text-2xl font-medium hover:bg-primary-100 transition-colors flex flex-col items-center justify-center py-6 cursor-pointer"
            >
              <CiCirclePlus size={40} className="cursor-pointer mb-6" />
              <p className="cursor-pointer">اضافة بطاقة</p>
            </div>
            {hasPermission(ALL_PERMISSIONS.ADD_CONTRACT) && (
              <Link
                to="/new-contract"
                className="bg-white shadow-[1px_2px_16px_0px_#4899EA1F] text-primary-500 rounded-2xl text-2xl font-medium hover:bg-primary-100 transition-colors flex flex-col items-center justify-center py-6 cursor-pointer"
              >
                <CiCirclePlus size={40} className="cursor-pointer mb-6" />
                <p className="cursor-pointer">اضافة عقد</p>
              </Link>
            )}
            <Link
              to="/new-authorization"
              className="bg-white shadow-[1px_2px_16px_0px_#4899EA1F] text-primary-500 rounded-2xl text-2xl font-medium hover:bg-primary-100 transition-colors flex flex-col items-center justify-center py-6 cursor-pointer"
            >
              <CiCirclePlus size={40} className="cursor-pointer mb-6" />
              <p className="cursor-pointer">اضافة تخويل</p>
            </Link>
            <Link
              to="/"
              className="bg-white shadow-[1px_2px_16px_0px_#4899EA1F] text-primary-500 rounded-2xl text-2xl font-medium hover:bg-primary-100 transition-colors flex flex-col items-center justify-center py-6 cursor-pointer"
            >
              <CiCirclePlus size={40} className="cursor-pointer mb-6" />
              <p className="cursor-pointer">اضافة براءة الذمة</p>
            </Link>
          </div>
        </div>
      </Dialog>
      <SelectCardTypeModal
        isOpen={isSelectCardTypeModalOpen}
        onClose={() => setIsSelectCardTypeModalOpen(false)}
      />
    </>
  );
};

export default AddCompanyModal;
