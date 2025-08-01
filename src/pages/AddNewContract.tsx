import { useState } from 'react';
import AddAccountInformation from '../components/informationCard/AddAccountInformation';
import AddCarInformation from '../components/informationCard/AddCarInformation';
import PaymentInformation, {
  paymentInformationData,
} from '../components/informationCard/PaymentInformation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { AccountInformation, CarInformation } from '../components/informationCard/type';
import DocumentsInformation from '../components/informationCard/DocumentsInformation';
import axios from '../services/axios';
import { createNewAccount, createNewCar } from '../services/UserService';

function AddNewContract() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [sellerDisabled, setSellerDisabled] = useState(false);
  const [buyerDisabled, setBuyerDisabled] = useState(false);
  const [carDisabled, setCarDisabled] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [sellerInformation, setSellerInformation] = useState<AccountInformation>({
    firstName: '',
    fatherName: '',
    grandfatherName: '',
    fourthName: '',
    surname: '',
    nationalId: '',
    phoneNumber: '',
    residenceCardNo: '',
    residence: '',
    district: '',
    alley: '',
    houseNo: '',
    infoOffice: '',
    issuingAuthority: '',
  });
  const [sellerImages, setSellerImages] = useState({
    nationalIdFrontFile: null,
    nationalIdBackFile: null,
    residenceCardFrontFile: null,
    residenceCardBackFile: null,
    otherImages: [],
  });

  const [buyerInformation, setBuyerInformation] = useState<AccountInformation>({
    firstName: '',
    fatherName: '',
    grandfatherName: '',
    fourthName: '',
    surname: '',
    nationalId: '',
    phoneNumber: '',
    residenceCardNo: '',
    residence: '',
    district: '',
    alley: '',
    houseNo: '',
    infoOffice: '',
    issuingAuthority: '',
  });
  const [buyerImages, setBuyerImages] = useState({
    nationalIdFrontFile: null,
    nationalIdBackFile: null,
    residenceCardFrontFile: null,
    residenceCardBackFile: null,
    otherImages: [],
  });

  const [carInformation, setCarInformation] = useState<CarInformation>({
    name: '',
    type: '',
    color: '',
    model: '',
    chassisNumber: '',
    plateNumber: '',
    engineType: '',
    passengerCount: 1,
    cylinderCount: 2,
    kilometers: 0,
    origin: '',
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
  
  const handleReturnedSellerInfo = (data) => {
    setSellerInformation({
    firstName: data.firstName,
    fatherName: data.fatherName,
    grandfatherName: data.grandfatherName,
    fourthName: data.fourthName,
    surname: data.surname,
    nationalId: data.nationalId,
    phoneNumber: data.phoneNumber,
    residenceCardNo: data.residenceCardNo,
    residence: data.residence,
    district: data.district,
    alley: data.alley,
    houseNo: data.houseNo,
    infoOffice: data.infoOffice,
    issuingAuthority: data.issuingAuthority,
  })

   const newImages = {
    nationalIdFrontFile: null,
    nationalIdBackFile: null,
    residenceCardFrontFile: null,
    residenceCardBackFile: null,
    otherImages: [],
  };

  if (Array.isArray(data.attachments)) {
    data.attachments.forEach((attachment: any) => {
      const { docType, docSide, url } = attachment;

      if (docType === "NATIONAL_ID" && docSide === "FRONT") {
        newImages.nationalIdFrontFile = url;
      } else if (docType === "NATIONAL_ID" && docSide === "BACK") {
        newImages.nationalIdBackFile = url;
      } else if (docType === "RESIDENCE_CARD" && docSide === "FRONT") {
        newImages.residenceCardFrontFile = url;
      } else if (docType === "RESIDENCE_CARD" && docSide === "BACK") {
        newImages.residenceCardBackFile = url;
      } else {
        newImages.otherImages.push(url);
      }
    });
  }

  setSellerImages(newImages);
  console.log(data);
  setSellerDisabled(true)
  }
  const handleReturnedBuyerInfo = (data) => {
    setBuyerInformation({
    firstName: data.firstName,
    fatherName: data.fatherName,
    grandfatherName: data.grandfatherName,
    fourthName: data.fourthName,
    surname: data.surname,
    nationalId: data.nationalId,
    phoneNumber: data.phoneNumber,
    residenceCardNo: data.residenceCardNo,
    residence: data.residence,
    district: data.district,
    alley: data.alley,
    houseNo: data.houseNo,
    infoOffice: data.infoOffice,
    issuingAuthority: data.issuingAuthority,
  })

   const newImages = {
    nationalIdFrontFile: null,
    nationalIdBackFile: null,
    residenceCardFrontFile: null,
    residenceCardBackFile: null,
    otherImages: [],
  };

  if (Array.isArray(data.attachments)) {
    data.attachments.forEach((attachment: any) => {
      const { docType, docSide, url } = attachment;

      if (docType === "NATIONAL_ID" && docSide === "FRONT") {
        newImages.nationalIdFrontFile = url;
      } else if (docType === "NATIONAL_ID" && docSide === "BACK") {
        newImages.nationalIdBackFile = url;
      } else if (docType === "RESIDENCE_CARD" && docSide === "FRONT") {
        newImages.residenceCardFrontFile = url;
      } else if (docType === "RESIDENCE_CARD" && docSide === "BACK") {
        newImages.residenceCardBackFile = url;
      } else {
        newImages.otherImages.push(url);
      }
    });
  }

  setBuyerImages(newImages);
  console.log(data);
  setBuyerDisabled(true)
  }

  const handleReturnedCarInfo = (data) => {
    setCarInformation({
      name: data.name,
      type: data.type,
      color: data.color,
      model: data.model,
      chassisNumber: data.chassisNumber,
      plateNumber: data.plateNumber,
      engineType: data.engineType,
      passengerCount: data.passengerCount,
      cylinderCount: data.cylinderCount,
      kilometers: data.kilometers,
      origin: data.origin,
    })

    const newImages = {
      nationalIdFrontFile: null,
      nationalIdBackFile: null,
      residenceCardFrontFile: null,
      residenceCardBackFile: null,
      otherImages: [] as any[],
    };
    if (Array.isArray(data.attachments)) {
      data.attachments.forEach((attachment: any) => {
        const { fileKey } = attachment;
        newImages.otherImages.push(fileKey);
      });
    }

    setCarDisabled(true);

  }
  

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      const payment = {
        "paymentType": "CASH",
        "totalAmount": 20000000,
        "downPayment": 0,
        "numberOfInstallments": 1,
        "installmentPeriodDays": 1
      }
      // here we will handle the submission logic for the contract
      // check if the seller is existing in the database if not create a new one
      // check if the buyer is existing in the database if not create a new one
      // check if the car is existing in the database if not create a new one
      // then create a new payment in the database
      // then create a new contract in the database using there ids
      try {
        let seller;
        const checkSellerResponse = await axios.get(`/person?nationalId=${sellerInformation.nationalId}`);
        if (checkSellerResponse.data.data.length === 0) {
          console.log("Creating new seller account.");
          const sellerResponse = await createNewAccount(sellerInformation, sellerImages);
          seller = sellerResponse.data.data;
          console.log("Created seller account:", sellerResponse.data);
          
        } else {
          seller = checkSellerResponse.data.data[0];
        }
        let buyer;
        const checkBuyerResponse = await axios.get(`/person?nationalId=${buyerInformation.nationalId}`);
        if (checkBuyerResponse.data.data.length === 0) {
          console.log("Creating new buyer account.");
          const buyerResponse = await createNewAccount(buyerInformation, buyerImages);
          buyer = buyerResponse.data.data;
          console.log("Created buyer account:", buyerResponse.data);
        } else {
          buyer = checkBuyerResponse.data.data[0];
        }

        let car;
        const checkCarResponse = await axios.get(`/car?chassisNumber=${carInformation.chassisNumber}`);
        if (checkCarResponse.data.data.length === 0) {
          console.log("Creating new car entry.");
          const carResponse = await createNewCar(carInformation);
          car = carResponse.data.data;
          console.log("Created car entry:", carResponse.data);
        } else {
          car = checkCarResponse.data.data[0];
        }

        const paymentResponse = await axios.post('/payment', payment)
        await axios.post('contracts', {
          sellerId: seller.id,
          buyerId: buyer.id,
          carId: car.id,
          paymentId: paymentResponse.data.data.id,
          contractDate: new Date().toISOString().split('T')[0],
        })

      } catch (error) {
        console.error("Error checking or creating seller account:", error);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
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
          <div>
            <AddAccountInformation
              formData={sellerInformation}
              returnedValue={handleReturnedSellerInfo}
              setFormData={setSellerInformation}
              title="اضف معلومات البائع الجديد"
              disabled={sellerDisabled}
              onValidationChange={setIsFormValid}
            />      
            <DocumentsInformation
              formData={sellerImages}
              setFormData={setSellerImages}
              isPerson={true}
              disabled={sellerDisabled}
              title="اضافة الملفات"
            />
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <AddAccountInformation
              formData={buyerInformation}
              setFormData={setBuyerInformation}
              returnedValue={handleReturnedBuyerInfo}
              title="اضف معلومات المشتري الجديد"
              disabled={buyerDisabled}
              onValidationChange={setIsFormValid}
            />  
            <DocumentsInformation
              formData={buyerImages}
              setFormData={setBuyerImages}
              isPerson={true}
              disabled={buyerDisabled}
              title="اضافة الملفات"
            />
          </div>
        )}
        {currentStep === 3 && (
          <>
            <AddCarInformation
              formData={carInformation}
              setFormData={setCarInformation}
              disabled={carDisabled}
              returnedValue={handleReturnedCarInfo}
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
