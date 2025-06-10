import { useState } from 'react';
import AddAccountInformation from '../components/informationCard/AddAccountInformation';
import AddCarInformation from '../components/informationCard/AddCarInformation';
import PaymentInformation, {
  paymentInformationData,
} from '../components/informationCard/PaymentInformation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function AddNewContract() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);

  const [sellerInformation, setSellerInformation] = useState({
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

  const [buyerInformation, setBuyerInformation] = useState({
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

  const [carInformation, setCarInformation] = useState({
    carName: '',
    carType: '',
    carColor: '',
    carModel: '',
    carVIN: '',
    carPlateNumber: '',
    carEngineType: '',
    carNumberOfPassengers: 1,
    carNumberOfCylinders: 2,
    carMileage: 0,
    source: '',
  });

  const [paymentInformation, setPaymentInformation] = useState<paymentInformationData>({
    paymentMethod: 'cash',
    totalPrice: '',
    paidAmount: '',
    remainingAmount: '',
    installmentPayment: {
      numberOfInstallments: '',
      installmentPeriod: '',
      payments: [],
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      console.log('last step');
    } else {
      setCurrentStep(currentStep + 1);
    }
    // Handle form submission logic here
  };
  return (
    <div className="mb-4">
      {currentStep === 1 && (
        <div className="flex items-center gap-1 py-4 text-2xl">
          <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
          <h3 className="text-[28px]">اضافة عقد</h3>
        </div>
      )}
      {currentStep === 2 && (
        <div className="flex items-center gap-1 py-4 text-2xl">
          <MdKeyboardArrowRight
            onClick={() => setCurrentStep(currentStep - 1)}
            size={40}
            className="cursor-pointer"
          />
          <h3 className="text-[28px]">معلومات المشتري</h3>
        </div>
      )}
      {currentStep === 3 && (
        <div className="flex items-center gap-1 py-4 text-2xl">
          <MdKeyboardArrowRight
            onClick={() => setCurrentStep(currentStep - 1)}
            size={40}
            className="cursor-pointer"
          />
          <h3 className="text-[28px]">معلومات السيارة</h3>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <AddAccountInformation
            formData={sellerInformation}
            setFormData={setSellerInformation}
            title="اضف معلومات البائع الجديد"
            onValidationChange={setIsFormValid}
          />
        )}
        {currentStep === 2 && (
          <AddAccountInformation
            formData={buyerInformation}
            setFormData={setBuyerInformation}
            title="اضف معلومات المشتري الجديد"
            onValidationChange={setIsFormValid}
          />
        )}
        {currentStep === 3 && (
          <>
            <AddCarInformation
              formData={carInformation}
              setFormData={setCarInformation}
              title="اضف معلومات السيارة الجديدة"
            />
            <PaymentInformation formData={paymentInformation} setFormData={setPaymentInformation} />
          </>
        )}

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

export default AddNewContract;
