import InputField from '../Form/InputField';

interface AddCarInformationProps {
  formData: {
    carName: string;
    carType: string;
    carColor: string;
    carModel: string;
    carVIN: string;
    carPlateNumber: string;
    carEngineType: string;
    carNumberOfPassengers: number;
    carNumberOfCylinders: number;
    carMileage: number;
    source: string;
  };
  title: string;
  setFormData: (data: any) => void;
}

function AddCarInformation({ formData, setFormData, title }: AddCarInformationProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 my-4">
      <p className="text-2xl text-neutral-500 font-normal">{title}</p>
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.carName}
            className="w-full"
            name="carName"
            onChange={(e) => setFormData({ ...formData, carName: e.target.value })}
            label="اسم السيارة"
            placeholder="ادخل اسم السيارة"
            type="text"
          />
          <InputField
            value={formData.carType}
            name="carType"
            onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
            label="نوع السيارة"
            placeholder="ادخل نوع السيارة"
            type="text"
          />
          <InputField
            value={formData.carColor}
            name="carColor"
            onChange={(e) => setFormData({ ...formData, carColor: e.target.value })}
            label="لون السيارة"
            placeholder="ادخل لون السيارة"
            type="text"
          />
          <InputField
            value={formData.carModel}
            name="carModel"
            onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
            label="موديل السيارة"
            placeholder="ادخل موديل السيارة"
            type="text"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.carVIN}
            name="carVIN"
            onChange={(e) => setFormData({ ...formData, carVIN: e.target.value })}
            label="رقم الشاصي"
            placeholder="ادخل رقم الشاصي"
            type="text"
          />
          <InputField
            value={formData.carPlateNumber}
            name="carPlateNumber"
            onChange={(e) => setFormData({ ...formData, carPlateNumber: e.target.value })}
            label="رقم السيارة"
            placeholder="ادخل رقم السيارة"
            type="text"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.carEngineType}
            name="carEngineType"
            onChange={(e) => setFormData({ ...formData, carEngineType: e.target.value })}
            label="نوع محرك"
            placeholder="ادخل نوع محرك"
            type="text"
          />
          <InputField
            value={formData.carNumberOfPassengers.toString()}
            name="carNumberOfPassengers"
            onChange={(e) =>
              setFormData({ ...formData, carNumberOfPassengers: parseInt(e.target.value) })
            }
            label="عدد الركاب"
            placeholder="ادخل عدد الركاب"
            type="number"
          />
          <InputField
            value={formData.carNumberOfCylinders.toString()}
            name="carNumberOfCylinders"
            onChange={(e) =>
              setFormData({ ...formData, carNumberOfCylinders: parseInt(e.target.value) })
            }
            label="عدد الأسطوانات"
            placeholder="ادخل عدد الأسطوانات"
            type="number"
          />
          <InputField
            value={formData.carMileage.toString()}
            name="carMileage"
            onChange={(e) => setFormData({ ...formData, carMileage: parseInt(e.target.value) })}
            label="عدد الكيلومترات"
            placeholder="ادخل عدد الكيلومترات"
            type="number"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.source}
            name="source"
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            label="المصدر"
            placeholder="المصدر"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}

export default AddCarInformation;
