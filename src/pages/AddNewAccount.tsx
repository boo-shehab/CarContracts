import { useState } from 'react';
import AddAccountInformation from '../components/informationCard/AddAccountInformation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { AccountInformation } from '../components/informationCard/type';
import DocumentsInformation from '../components/informationCard/DocumentsInformation';
import { createNewAccount } from '../services/UserService';

function AddNewAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState({
    nationalIdFrontFile: null,
    nationalIdBackFile: null,
    residenceCardFrontFile: null,
    residenceCardBackFile: null,
    othreFiles: [],
  });
  const [disabled, setDisabled] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false);

  const [accountInformation, setAccountInformation] = useState<AccountInformation>({
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

  const handleReturnedValue = (data) => {
    setAccountInformation({
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
    othreFiles: [],
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
        newImages.othreFiles.push(url);
      }
    });
  }

  setImages(newImages);
  console.log(data);
  setDisabled(true)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isFormValid) return;

  setIsLoading(true);
  try {
    const response = await createNewAccount(accountInformation, images);
    console.log("Created account:", response.data);
    navigate(-1);
  }catch (error) {
    console.error("Error creating account:", error);
    alert("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
  } finally {
    setIsLoading(false);
  }

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
          isLoading={isLoading}
          returnedValue={handleReturnedValue}
          disabled={disabled}
        />
        
        <DocumentsInformation
          formData={images}
          setFormData={setImages}
          isPerson={true}
          disabled={disabled}
          title="اضافة الملفات"
        />
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full rounded-lg px-4 py-2.5 text-white text-2xl bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed aria-pressed:bg-primary-700 "
        >
          {isLoading ? 'جاري الاضافة...' : 'اضافة'}
        </button>
      </form>
    </div>
  );
}

export default AddNewAccount;
