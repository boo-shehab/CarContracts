import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import InputField from "../components/Form/InputField";
import UploadImage from "../components/Form/UploadImage";
import CardImagesPicker from "../components/Form/CardImagesPicker";

const ViewPerson = () => {

    const [accountInformation, setAccountInformation] = useState({
        phoneNumber: '',
        surname: '',
        nationalId: '',
        residenceCardNo: '',
        residence: '',
        district: '',
        alley: '',
        houseNo: '',
        infoOffice: '',
        issuingAuthority: '',
        firstName: '',
        fatherName: '',
        grandfatherName: '',
        fourthName: '',
        nationalIdFrontFile: null,
        nationalIdBackFile: null,
        residenceCardFrontFile: null,
        residenceCardBackFile: null,
        otherFiles: [],
    });
    const [formData, setFormData] = useState({
        nationalIdFrontFile: null,
        nationalIdBackFile: null,
        residenceCardFrontFile: null,
        residenceCardBackFile: null,
        othreFiles: [],
    });
    const [isPerson, setIsPerson] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const handlePersonImages = (images) => {
        setFormData((prev) => ({
            ...prev,
            nationalIdFrontFile: images.nationalIdFrontFile,
            nationalIdBackFile: images.nationalIdBackFile,
            residenceCardFrontFile: images.residenceCardFrontFile,
            residenceCardBackFile: images.residenceCardBackFile,
        }));
    };
    const handleOtherImages = (files) => {
        setFormData((prev) => ({
            ...prev,
            otherFiles: files,
        }));
    };
    const handleReturnedValue = (value) => {
        setIsPerson(value);
    };
    const [images, setImages] = useState({
        nationalIdFrontFile: null,
        nationalIdBackFile: null,
        residenceCardFrontFile: null,
        residenceCardBackFile: null,
        otherFiles: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/account-cards');
        }, 2000);
    };
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
        <h3 className="text-[28px]">بطاقة الحساب</h3>
      </div>
      <form onSubmit={handleSubmit}>
        
    <div className="w-full bg-white rounded-xl shadow-lg p-4 my-4">
        <div className="grid grid-cols-[auto_1fr] gap-4 mb-4">
            <label htmlFor="" className="font-medium text-lg text-primary-500">الاسم الرباعي مع اللقب: </label>
            <InputField
                type="text"
                name="firstName"
                value={accountInformation.firstName}
                onChange={(e) => setAccountInformation({ ...accountInformation, firstName: e.target.value })}
                placeholder="Enter full name"
            />
            <label htmlFor="" className="text-nowrap font-medium text-lg text-primary-500">رقم الهاتف :</label>
            <InputField
                type="text"
                name="phoneNumber"
                value={accountInformation.phoneNumber}
                onChange={(e) => setAccountInformation({ ...accountInformation, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
            />
            <label htmlFor="" className="text-nowrap font-medium text-lg text-primary-500">رقم الهوية الوطنية :</label>
            <InputField
                type="text"
                name="nationalId"
                value={accountInformation.nationalId}
                onChange={(e) => setAccountInformation({ ...accountInformation, nationalId: e.target.value })}
                placeholder="Enter national ID"
            />
            <label htmlFor="" className="text-nowrap font-medium text-lg text-primary-500">رقم بطاقة السكن :</label>
            <InputField
                type="text"
                name="residenceCardNo"
                value={accountInformation.residenceCardNo}
                onChange={(e) => setAccountInformation({ ...accountInformation, residenceCardNo: e.target.value })}
                placeholder="Enter residence card number"
            />
            <label htmlFor="" className="text-nowrap font-medium text-lg text-primary-500">جهة الاصدار:</label>
            <InputField
                type="text"
                name="issuingAuthority"
                value={accountInformation.issuingAuthority}
                onChange={(e) => setAccountInformation({ ...accountInformation, issuingAuthority: e.target.value })}
                placeholder="Enter issuing authority"
            />
            <label htmlFor="" className="text-nowrap font-medium text-lg text-primary-500">مكتب المعلومات:</label>
            <InputField
                type="text"
                name="infoOffice"
                value={accountInformation.infoOffice}
                onChange={(e) => setAccountInformation({ ...accountInformation, infoOffice: e.target.value })}
                placeholder="Enter info office"
            />
            <label htmlFor="" className="text-nowrap font-medium text-lg text-primary-500">السكن:</label>
            <div className="flex items-center justify-center gap-2">
                <InputField
                    type="text"
                    name="residence"
                    value={accountInformation.residence}
                    onChange={(e) => setAccountInformation({ ...accountInformation, residence: e.target.value })}
                    placeholder="Enter residence"
                />
                <label htmlFor="" className="text-nowrap font-medium text-lg text-primary-500">المحلة:</label>
                <InputField
                    type="text"
                    name="neighborhood"
                    value={accountInformation.neighborhood}
                    onChange={(e) => setAccountInformation({ ...accountInformation, neighborhood: e.target.value })}
                    placeholder="Enter neighborhood"
                />
                <label htmlFor="" className="text-nowrap font-medium text-lg text-primary-500">الزقاق:</label>
                <InputField
                    type="text"
                    name="alley"
                    value={accountInformation.alley}
                    onChange={(e) => setAccountInformation({ ...accountInformation, alley: e.target.value })}
                    placeholder="Enter alley"
                />
                <label htmlFor="" className="text-nowrap font-medium text-lg text-primary-500">الدار:</label>
                <InputField
                    type="text"
                    name="houseNo"
                    value={accountInformation.houseNo}
                    onChange={(e) => setAccountInformation({ ...accountInformation, houseNo: e.target.value })}
                    placeholder="Enter house number"
                />
            </div>
        </div>
        <div>
            <div className="mt-4">
        {isPerson && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
              <CardImagesPicker
                title="البطاقة الوطنية"
                frontKey="nationalIdFrontFile"
                backKey="nationalIdBackFile"
                disabled={disabled}
                formData={{
                  frontImage:
                    typeof formData.nationalIdFrontFile === "string"
                      ? formData.nationalIdFrontFile
                      : formData.nationalIdFrontFile
                      ? URL.createObjectURL(formData.nationalIdFrontFile)
                      : "",
                  backImage:
                    typeof formData.nationalIdBackFile === "string"
                      ? formData.nationalIdBackFile
                      : formData.nationalIdBackFile
                      ? URL.createObjectURL(formData.nationalIdBackFile)
                      : "",
                }}
                setFormData={handlePersonImages}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
              <CardImagesPicker
                title="البطاقة السكن"
                frontKey="residenceCardFrontFile"
                backKey="residenceCardBackFile"
                disabled={disabled}
                formData={{
                  frontImage:
                    typeof formData.residenceCardFrontFile === "string"
                      ? formData.residenceCardFrontFile
                      : formData.residenceCardFrontFile
                      ? URL.createObjectURL(formData.residenceCardFrontFile)
                      : "",
                  backImage:
                    typeof formData.residenceCardBackFile === "string"
                      ? formData.residenceCardBackFile
                      : formData.residenceCardBackFile
                      ? URL.createObjectURL(formData.residenceCardBackFile)
                      : "",
                }}
                setFormData={handlePersonImages}
              />
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <UploadImage
            onChange={(files) => handleOtherImages(files)}
            disabled={disabled}
            oldImages={formData?.othreFiles?.map((file) =>
              typeof file === "string" ? file : URL.createObjectURL(file)
            )}
          />
        </div>
      </div>
        </div>
      <div className="flex gap-4 justify-end mt-8">
        
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="rounded-lg px-6 py-2.5 text-white text-2xl bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed aria-pressed:bg-primary-700 "
        >
          {isLoading ? 'جاري الحفظ...' : 'حفظ التعديل'}
        </button>
        
        <button
          type="button"
          disabled={ isLoading}
          className="rounded-lg flex-1 px-4 py-2.5 text-white text-2xl bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed aria-pressed:bg-primary-700 "
        >
          طباعة
        </button>
      </div>
    </div>
      </form>
    </div>
  );
};
export default ViewPerson;