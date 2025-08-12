import { useState } from 'react';
import AddCarInformation from '../components/informationCard/AddCarInformation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import DocumentsInformation from '../components/informationCard/DocumentsInformation';
import { toast } from 'react-toastify';
import { CarInformation } from '../components/informationCard/type';
import { createNewCar } from '../services/UserService';

function AddNewCar() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [isCarInfoValid, setIsCarInfoValid] = useState(false);
  const [disabled, setDisabled] = useState(false)

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

  const handleCarInputChange = (field: string, value: string | number) => {
    setCarInformation((prev) => ({ ...prev, [field]: value }));
  };

  
  const handleReturnedValue = (data: any) => {
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
    });

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

    setImages(newImages as any);
    console.log(data);
    setIsCarInfoValid(true);
    setDisabled(true);
  };
  

  const resetData = () => {
    setCarInformation({
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
    setImages([]);
    setIsLoading(false);
    setIsCarInfoValid(true);
  };

  const handleCarInfoValidate = (isValid: boolean) => {
    setIsCarInfoValid(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ask AddCarInformation to validate and return validity
    if (!isCarInfoValid) {
      toast.error('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
      return;
    }

    setIsLoading(true);

    try {
      await createNewCar(carInformation, images);
      
      resetData();
      toast.success('تم إضافة السيارة بنجاح');
      navigate('/');
    } catch (error: any) {
      setIsLoading(false);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'فشل في إضافة السيارة';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
        <h3 className="text-[28px]">بطاقة السيارة</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <AddCarInformation
          formData={carInformation}
          setFormData={handleCarInputChange}
          title="اضف معلومات السيارة"
          isLoading={isLoading}
          disabled={disabled}
          returnedValue={handleReturnedValue}
          onValidate={handleCarInfoValidate}
        />
        <DocumentsInformation
          formData={images}
          setFormData={setImages}
          isPerson={false}
          title="اضافة الملفات"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={isLoading || !isCarInfoValid}
          className={`w-full rounded-lg px-4 py-2.5 text-white text-2xl ${
            isLoading || !isCarInfoValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600 aria-pressed:bg-primary-700'
          }`}
        >
          {isLoading ? 'جاري الإضافة...' : 'اضافة'}
        </button>
      </form>
    </div>
  );
}

export default AddNewCar;
