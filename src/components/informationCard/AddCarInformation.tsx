import InputField from '../Form/InputField';
import SearchSelect from '../Form/SearchSelect';
import { CarInformation } from './type';
import { useState } from 'react';

interface AddCarInformationProps {
  formData: CarInformation;
  title: string;
  setFormData: any;
  isLoading?: boolean;
  onValidate?: (isValid: boolean) => void;
  returnedValue?: (value: any) => void;
  disabled: boolean
}

function AddCarInformation({
  formData,
  setFormData,
  title,
  isLoading = false,
  onValidate,
  returnedValue,
  disabled
}: AddCarInformationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate all fields and set errors, return true if valid, false otherwise
  const validate = (): boolean => {
    
      console.log('Form Data: ',formData);
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'اسم السيارة مطلوب';
    if (!formData.type) newErrors.type = 'نوع السيارة مطلوب';
    if (!formData.color) newErrors.color = 'لون السيارة مطلوب';
    if (!formData.model) newErrors.model = 'موديل السيارة مطلوب';
    if (!formData.chassisNumber) newErrors.chassisNumber = 'رقم الشاصي مطلوب';
    if (!formData.plateNumber) newErrors.plateNumber = 'رقم السيارة مطلوب';
    if (!formData.engineType) newErrors.engineType = 'نوع المحرك مطلوب';
    if (!formData.kilometers && formData.kilometers < 0)
      newErrors.kilometers = 'عدد الكيلومترات مطلوب';
    if (!formData.passengerCount || formData.passengerCount < 1)
      newErrors.passengerCount = 'عدد الركاب مطلوب ويجب أن يكون أكبر من 0';
    if (!formData.origin) newErrors.origin = 'المصدر مطلوب';
    if (!formData.cylinderCount || formData.cylinderCount < 1)
      newErrors.cylinderCount = 'عدد الأسطوانات مطلوب ويجب أن يكون أكبر من 0';
    const isValid = Object.keys(newErrors).length === 0;
    if (onValidate) onValidate(isValid);
    return isValid;
  };

  // Real-time validation for each field
  const handleChange = (field: string, value: string | number) => {
    setFormData(field, value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      // Remove error for this field if valid
      const numberFields = ['kilometers', 'passengerCount', 'cylinderCount'];
      if (
        (numberFields.includes(field)
          ? value !== null && value !== undefined && !isNaN(Number(value))
          : value !== '' && value !== null && value !== undefined)
      ) {
        delete newErrors[field];
      } else {
        // Optionally, add error if field is empty
        switch (field) {
          case 'name':
            newErrors.name = 'اسم السيارة مطلوب';
            break;
          case 'type':
            newErrors.type = 'نوع السيارة مطلوب';
            break;
          case 'color':
            newErrors.color = 'لون السيارة مطلوب';
            break;
          case 'model':
            newErrors.model = 'موديل السيارة مطلوب';
            break;
          case 'chassisNumber':
            newErrors.chassisNumber = 'رقم الشاصي مطلوب';
            break;
          case 'plateNumber':
            newErrors.plateNumber = 'رقم السيارة مطلوب';
            break;
          case 'engineType':
            newErrors.engineType = 'نوع المحرك مطلوب';
            break;
          case 'origin':
            newErrors.origin = 'المصدر مطلوب';
            break;
          case 'kilometers':
            newErrors.kilometers = 'عدد الكيلومترات مطلوب';
            break;
          case 'passengerCount':
            newErrors.passengerCount = 'عدد الركاب مطلوب ويجب أن يكون أكبر من 0';
            break;
          case 'cylinderCount':
            newErrors.cylinderCount = 'عدد الأسطوانات مطلوب ويجب أن يكون أكبر من 0';
            break;
          default:
            break;
        }
      }
      return newErrors;
    });
    // Check if form is valid after this change
    if (onValidate) {
      const isValid =
        value !== '' &&
        value !== null &&
        value !== undefined &&
        !isNaN(Number(value)) &&
        Object.keys(errors).filter((key) => key !== field).length === 0;
        console.log(value);
        

      onValidate(isValid && validate());
    }
  };
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 my-4">
        <div className='flex flex-col'>
          {returnedValue && (
            <SearchSelect
              api='car'
              placeholder='البحث برقم الشاصي'
              returnedValue={(data) => {
                returnedValue(data);
                setErrors({});
              }}
              inputValueKey='chassisNumber'
              dropdownItem={(item) => (
                <div>
                  {item.chassisNumber}
                </div>
              )}
            />
          )}
        </div>
      <p className="text-2xl text-neutral-500 font-normal">{title}</p>
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.name}
            className="w-full"
            name="name"
            onChange={(e) => handleChange('name', e.target.value)}
            label="اسم السيارة"
            placeholder="ادخل اسم السيارة"
            type="text"
            error={errors.name}
            disabled={isLoading || disabled}
          />
          <InputField
            value={formData.type}
            name="type"
            onChange={(e) => handleChange('type', e.target.value)}
            label="نوع السيارة"
            placeholder="ادخل نوع السيارة"
            type="text"
            error={errors.type}
            disabled={isLoading || disabled}
          />
          <InputField
            value={formData.color}
            name="color"
            onChange={(e) => handleChange('color', e.target.value)}
            label="لون السيارة"
            placeholder="ادخل لون السيارة"
            type="text"
            error={errors.color}
            disabled={isLoading || disabled}
          />
          <InputField
            value={formData.model}
            name="model"
            onChange={(e) => handleChange('model', e.target.value)}
            label="موديل السيارة"
            placeholder="ادخل موديل السيارة"
            type="text"
            error={errors.model}
            disabled={isLoading || disabled}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.chassisNumber}
            name="chassisNumber"
            onChange={(e) => handleChange('chassisNumber', e.target.value)}
            label="رقم الشاصي"
            placeholder="ادخل رقم الشاصي"
            type="text"
            error={errors.chassisNumber}
            disabled={isLoading || disabled}
          />
          <InputField
            value={formData.plateNumber}
            name="plateNumber"
            onChange={(e) => handleChange('plateNumber', e.target.value)}
            label="رقم السيارة"
            placeholder="ادخل رقم السيارة"
            type="text"
            error={errors.plateNumber}
            disabled={isLoading || disabled}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.engineType}
            name="engineType"
            onChange={(e) => handleChange('engineType', e.target.value)}
            label="نوع محرك"
            placeholder="ادخل نوع محرك"
            type="text"
            error={errors.engineType}
            disabled={isLoading || disabled}
          />
          <InputField
            value={formData.passengerCount.toString()}
            name="passengerCount"
            onChange={(e) => handleChange('passengerCount', parseInt(e.target.value))}
            label="عدد الركاب"
            placeholder="ادخل عدد الركاب"
            type="number"
            error={errors.passengerCount}
            disabled={isLoading || disabled}
          />
          <InputField
            value={formData.cylinderCount.toString()}
            name="cylinderCount"
            onChange={(e) => handleChange('cylinderCount', parseInt(e.target.value))}
            label="عدد الأسطوانات"
            placeholder="ادخل عدد الأسطوانات"
            type="number"
            error={errors.cylinderCount}
            disabled={isLoading || disabled}
          />
          <InputField
            value={formData.kilometers.toString()}
            name="kilometers"
            onChange={(e) => handleChange('kilometers', parseInt(e.target.value))}
            label="عدد الكيلومترات"
            placeholder="ادخل عدد الكيلومترات"
            type="number"
            error={errors.kilometers}
            disabled={isLoading || disabled}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.origin}
            name="origin"
            onChange={(e) => handleChange('origin', e.target.value)}
            label="المصدر"
            placeholder="المصدر"
            type="text"
            error={errors.origin}
            disabled={isLoading || disabled}
          />
        </div>
      </div>
    </div>
  );
}

export default AddCarInformation;
