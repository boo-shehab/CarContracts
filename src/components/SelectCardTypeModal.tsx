import { Dialog } from '@headlessui/react';
import { IoCloseOutline, IoPersonOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import CarSVG from '../assets/icons/CarSVG';
import { hasPermission } from '../utilities/permissions';
import { ALL_PERMISSIONS } from '../utilities/allPermissions';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SelectCardTypeModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-60 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" />
      {/* Modal content */}
      <div className="bg-white rounded-xl shadow-lg z-70 w-full max-h-11/12 overflow-x-auto max-w-lg p-6">
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
          {hasPermission(ALL_PERMISSIONS.CREATE_CAR) && (
            <Link
              to="/new-car"
              className="bg-white shadow-[1px_2px_16px_0px_#4899EA1F] text-primary-500 rounded-2xl text-2xl font-medium hover:bg-primary-100 transition-colors flex flex-col items-center justify-center py-6 cursor-pointer"
            >
              <CarSVG size={40} className="cursor-pointer mb-6" />
              <p className="cursor-pointer">بطاقة سيارة</p>
            </Link>
          )}
          {hasPermission(ALL_PERMISSIONS.PERSON_CREATE) && (
            <Link
              to="/new-account"
              className="bg-white shadow-[1px_2px_16px_0px_#4899EA1F] text-primary-500 rounded-2xl text-2xl font-medium hover:bg-primary-100 transition-colors flex flex-col items-center justify-center py-6 cursor-pointer"
            >
              <IoPersonOutline size={40} className="cursor-pointer mb-6" />
              <p className="cursor-pointer">بطاقة حساب</p>
            </Link>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default SelectCardTypeModal;
