import { useState } from 'react';
import AddAccountInformation from '../components/informationCard/AddAccountInformation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import DocumentsInformation from '../components/informationCard/DocumentsInformation';
import AddCarInformation from '../components/informationCard/AddCarInformation';
import { AccountInformation, AuthorizationInformation, CarInformation } from '../components/informationCard/type';
import AddAuthorizationInformation from '../components/informationCard/AddAuthorizationInformation';
import axios from '../services/axios';
import { createNewAccount, createNewCar } from '../services/UserService';
import { toast } from 'react-toastify';

function AddNewAuthorization() {
  const navigate = useNavigate();
  const [buyerDisabled, setBuyerDisabled] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [carDisabled, setCarDisabled] = useState(false);
  const [authorizationDisabled] = useState(false);


  const [authorizationInformation, setAuthorizationInformation] = useState<AuthorizationInformation>({
    authorizationNumber: '',
    authorizationDate: '',
    companyAgent: '',
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
    const [buyerImages, setBuyerImages] = useState<{
      nationalIdFrontFile: string | null;
      nationalIdBackFile: string | null;
      residenceCardFrontFile: string | null;
      residenceCardBackFile: string | null;
      otherImages: string[];
    }>({
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
    
  const handleReturnedBuyerInfo = (data: any) => {
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

   const newImages: {
    nationalIdFrontFile: string | null;
    nationalIdBackFile: string | null;
    residenceCardFrontFile: string | null;
    residenceCardBackFile: string | null;
    otherImages: string[];
  } =  {
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
  setBuyerDisabled(true)
  }
  
  const handleReturnedCarInfo = (data: any) => {
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
      // here we will handle the submission logic for the contract
      // check if the seller is existing in the database if not create a new one
      // check if the buyer is existing in the database if not create a new one
      // check if the car is existing in the database if not create a new one
      // then create a new payment in the database
      // then create a new contract in the database using there ids
      try {
        let buyer;
        const checkBuyerResponse = await axios.get(`/person?nationalId=${buyerInformation.nationalId}`);
        if (checkBuyerResponse.data.data.length === 0) {
          const buyerResponse = await createNewAccount(buyerInformation, buyerImages);
          buyer = buyerResponse.data.data;
        } else {
          buyer = checkBuyerResponse.data.data[0];
        }

        let car;
        const checkCarResponse = await axios.get(`/car?chassisNumber=${carInformation.chassisNumber}`);
        if (checkCarResponse.data.data.length === 0) {
          const carResponse = await createNewCar(carInformation);
          car = carResponse.data.data;
        } else {
          car = checkCarResponse.data.data[0];
        }        
        await axios.post('authorizations', {
          buyerId: buyer.id,
          carId: car.id,
          authorizationNumber: authorizationInformation.authorizationNumber,
          authorizationDate: new Date(authorizationInformation.authorizationDate).toISOString().split('T')[0],
          companyAgent: authorizationInformation.companyAgent,
        })
        navigate(-1)

      } catch (error: any) {
        console.error("Error checking or creating seller account:", error);
        const message = 
          error?.response?.data?.message ||
          error?.message ||
          "حدث خطأ أثناء أنشاء العقد"
          toast.error(message)
      }
  };
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
        <h3 className="text-[28px]">اضافة تخويل</h3>
      </div>
      <form onSubmit={handleSubmit}>
        {/* <AddAccountInformation
          formData={accountInformation}
          setFormData={setAccountInformation}
          onValidationChange={setIsFormValid}
          title="اضف معلومات التخويل الجديد"
        /> */}
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
          
            <AddCarInformation
              formData={carInformation}
              setFormData={setCarInformation}
              disabled={carDisabled}
              returnedValue={handleReturnedCarInfo}
              title="اضف معلومات السيارة الجديدة"
            />
            <AddAuthorizationInformation
              formData={authorizationInformation}
              setFormData={setAuthorizationInformation}
              title="اضف معلومات التفويض"
              onValidationChange={setIsFormValid}
              disabled={authorizationDisabled}
            />
        </div>

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

export default AddNewAuthorization;
