import { useEffect, useCallback, useState } from 'react';
import InputField from '../Form/InputField';
import { AuthorizationInformation } from './type';
import CustomDatePicker from '../Form/DateFiled/CustomDatePicker';

interface AddAccountInformationProps {
  formData: AuthorizationInformation;
  title: string;
  setFormData: (data: any) => void;
  onValidationChange?: (isValid: boolean) => void;
  isLoading?: boolean;
  returnedValue?: any;
  disabled: boolean
}

function AddAuthorizationInformation({
  formData,
  setFormData,
  title,
  onValidationChange,
  isLoading = false,
  disabled,
}: AddAccountInformationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormFilled = useCallback(() => {
    const requiredFields = [
        formData.authorizationNumber,
        formData.authorizationDate,
        formData.companyAgent
    ];
    return requiredFields.every((val) => val && (typeof val === 'string' ? val.trim() !== '' : true)) && Object.keys(errors).every((key) => !errors[key] || errors[key].trim() === '');
  }, [errors, formData.companyAgent, formData.authorizationDate, formData.authorizationNumber]);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormFilled());
    }
  }, [formData, isFormFilled, onValidationChange, errors]);
  
  const validateField = async(field: string, value: string | Date) => {
    let error = '';
    if ((!value || (typeof value === 'string' && value.trim() === ''))) {
      switch (field) {
        case 'authorizationNumber':
          error = 'مكتب المعلومات مطلوب';
          break;
        case 'authorizationDate':
          error = 'تاريخ التفويض مطلوب';
          break;
        case 'companyAgent':
          error = 'اسم الوكيل مطلوب';
          break;
        default:
          break;
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };


  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };
  
  const handleDateChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 my-4">
      <p className="text-2xl text-neutral-500 font-normal">{title}</p>
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.authorizationNumber}
            error={errors.authorizationNumber}
            className="w-full"
            disabled={isLoading || disabled}
            name="authorizationNumber"
            onChange={(e) => handleChange('authorizationNumber', e.target.value)}
            label="رقم التفويض"
            placeholder="رقم التفويض"
            type="text"
          />
          <InputField
            value={formData.companyAgent}
            error={errors.companyAgent}
            name="companyAgent"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('companyAgent', e.target.value)}
            label="اسم الوكيل"
            placeholder="اسم الوكيل"
            type="text"
          />
          <CustomDatePicker
            value={formData.authorizationDate}
            name='authorizationDate'
            onChange={(e: any) => handleDateChange('authorizationDate', e.target.value)}
            error={errors.authorizationDate}
            label="تاريخ التفويض"
            placeholder="تاريخ التفويض"
            disabled={isLoading || disabled}
          />
        </div>
      </div>
    </div>
  );
}

export default AddAuthorizationInformation;
