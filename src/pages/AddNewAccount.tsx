import { useState } from 'react';
import AddAccountInformation from '../components/informationCard/AddAccountInformation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function AddNewAccount() {
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  const [accountInformation, setAccountInformation] = useState({
    firstName: '',
    fatherName: '',
    grandfatherName: '',
    fourthName: '',
    lastName: '',
    idNumber: '',
    phoneNumber: '',
    residenceCardNumber: '',
    residence: {
      housing: '',
      district: '',
      alley: '',
      houseNumber: '',
    },
    issuingOffice: '',
    issuingAuthority: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', accountInformation);
  };
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
        <h3 className="text-[28px]">بطاقة الحساب</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <AddAccountInformation
          formData={accountInformation}
          setFormData={setAccountInformation}
          onValidationChange={setIsFormValid}
          title="اضف معلومات الحساب"
        />
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full rounded-lg px-4 py-2.5 text-white text-2xl bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed aria-pressed:bg-primary-700 "
        >
          اضافة
        </button>
      </form>
    </div>
  );
}

export default AddNewAccount;
