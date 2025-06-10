import { useState } from 'react';
import AddCarInformation from '../components/informationCard/AddCarInformation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function AddNewCar() {
  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', carInformation);
  };
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
        <h3 className="text-[28px]">بطاقة السيارة</h3>
      </div>
      <form>
        <AddCarInformation
          formData={carInformation}
          setFormData={setCarInformation}
          title="اضف معلومات السيارة"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full rounded-lg px-4 py-2.5 text-white text-2xl bg-primary-500 hover:bg-primary-600 aria-pressed:bg-primary-700 "
        >
          اضافة
        </button>
      </form>
    </div>
  );
}

export default AddNewCar;
