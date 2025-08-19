import { useEffect, useCallback, useState } from 'react';
import axios from '../../services/axios';
import InputField from '../Form/InputField';
import { AccountInformation } from './type';
import SearchSelect from '../Form/SearchSelect';

interface AddAccountInformationProps {
  formData: AccountInformation;
  title: string;
  setFormData: (data: any) => void;
  onValidationChange?: (isValid: boolean) => void;
  isLoading?: boolean;
  returnedValue?: any;
  disabled: boolean
}

function AddAccountInformation({
  formData,
  setFormData,
  title,
  onValidationChange,
  isLoading = false,
  disabled,
  returnedValue
}: AddAccountInformationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormFilled = useCallback(() => {
    const requiredFields = [
      formData.firstName,
      formData.fatherName,
      formData.grandfatherName,
      formData.fourthName,
      formData.surname,
      formData.nationalId,
      formData.phoneNumber,
      formData.residenceCardNo,
      
      formData.residence,
      formData.district,
      formData.alley,
      formData.houseNo,

      formData.infoOffice,
      formData.issuingAuthority,
    ];
    return requiredFields.every((val) => val && val.trim() !== '') && Object.keys(errors).every((key) => !errors[key] || errors[key].trim() === '');
  }, [errors, formData.alley, formData.fatherName, formData.firstName, formData.fourthName, formData.grandfatherName, formData.houseNo, formData.residence, formData.residenceCardNo, formData.infoOffice, formData.issuingAuthority, formData.surname, formData.nationalId, formData.district, formData.phoneNumber]);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormFilled());
    }
  }, [formData, isFormFilled, onValidationChange, errors]);
  
  const validateField = async(field: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      switch (field) {
        case 'firstName':
          error = 'الاسم الاول مطلوب';
          break;
        case 'fatherName':
          error = 'اسم الاب مطلوب';
          break;
        case 'grandfatherName':
          error = 'اسم الجد مطلوب';
          break;
        case 'fourthName':
          error = 'اسم الرابع مطلوب';
          break;
        case 'surname':
          error = 'اللقب مطلوب';
          break;
        case 'phoneNumber':
          error = 'رقم الهاتف مطلوب';
          break;
        case 'nationalId':
          error = 'رقم الهوية مطلوب';
          break;
        case 'residenceCardNo':
          error = 'رقم بطاقة السكن مطلوب';
          break;
        case 'residence':
          error = 'السكن مطلوب';
          break;
        case 'district':
          error = 'المحلة مطلوبة';
          break;
        case 'alley':
          error = 'الزقاق مطلوب';
          break;
        case 'houseNo':
          error = 'الدار مطلوب';
          break;
        case 'issuingAuthority':
          error = 'الجهة الاصدار مطلوبة';
          break;
        case 'infoOffice':
          error = 'مكتب المعلومات مطلوب';
          break;
        default:
          break;
      }
    }

    if(field === 'nationalId') {
      // Check if the nationalId is existing in the database
      await axios.get(`/person?nationalId=${value}`)
      .then(response => {
        if (response.data.data.find((item: any) => item.nationalId === value)) {
          error = 'رقم الهوية موجود بالفعل';
        }
      })
      .catch(err => {
          console.error('Error checking national ID:', err);
        });
    }

    if(field === 'phoneNumber') {
      // check if the phoneNumber is 11 number and start with 07
      if (!/^(07)\d{9}$/.test(value)) {
        error = 'رقم الهاتف يجب أن يكون 11 رقمًا ويبدأ بـ 07';
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

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 my-4">
        <div className='flex flex-col'>
          {returnedValue && (
            <SearchSelect
              api='person'
              placeholder='البحث برقم الهوية'
              returnedValue={(data) => {
                returnedValue(data);
                setErrors({});
              }}
              inputValueKey='nationalId'
              dropdownItem={(item) => (
                <div>
                  {item.nationalId}
                </div>
              )}
            />
          )}
        </div>
      <p className="text-2xl text-neutral-500 font-normal">{title}</p>
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.firstName}
            error={errors.firstName}
            className="w-full"
            disabled={isLoading || disabled}
            name="firstName"
            onChange={(e) => handleChange('firstName', e.target.value)}
            label="الاسم الاول"
            placeholder="الاسم الاول"
            type="text"
          />
          <InputField
            value={formData.fatherName}
            error={errors.fatherName}
            name="fatherName"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            label="اسم الاب"
            placeholder="اسم الاب"
            type="text"
          />
          <InputField
            value={formData.grandfatherName}
            error={errors.grandfatherName}
            name="grandfatherName"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('grandfatherName', e.target.value)}
            label="اسم الجد"
            placeholder="اسم الجد"
            type="text"
          />
          <InputField
            value={formData.fourthName}
            error={errors.fourthName}
            name="fourthName"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('fourthName', e.target.value)}
            label="اسم الرابع"
            placeholder="اسم الرابع"
            type="text"
          />
          <InputField
            value={formData.surname}
            error={errors.surname}
            name="surname"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('surname', e.target.value)}
            label="اللقب"
            placeholder="اللقب"
            type="text"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.phoneNumber}
            error={errors.phoneNumber}
            name="phoneNumber"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            label="رقم الهاتف"
            placeholder="رقم الهاتف"
            type="number"
          />
          <InputField
            value={formData.nationalId}
            error={errors.nationalId}
            name="nationalId"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('nationalId', e.target.value)}
            label="رقم الهوية"
            placeholder="رقم الهوية"
            type="number"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.residenceCardNo}
            error={errors.residenceCardNo}
            name="residenceCardNo"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('residenceCardNo', e.target.value)}
            label="رقم بطاقة السكن"
            placeholder="رقم بطاقة السكن"
            type="number"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.residence}
            error={errors['residence']}
            name="residence"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('residence', e.target.value)}
            label="السكن"
            placeholder="السكن"
            type="text"
          />
          <InputField
            value={formData.district}
            error={errors['district']}
            name="district"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('district', e.target.value)}
            label="المحلة"
            placeholder="المحلة"
            type="text"
          />
          <InputField
            value={formData.alley}
            error={errors['alley']}
            name="alley"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('alley', e.target.value)}
            label="الزقاق"
            placeholder="الزقاق"
            type="text"
          />
          <InputField
            value={formData.houseNo}
            error={errors['houseNo']}
            name="houseNo"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('houseNo', e.target.value)}
            label="الدار"
            placeholder="الدار"
            type="text"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.issuingAuthority}
            error={errors.issuingAuthority}
            name="issuingAuthority"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('issuingAuthority', e.target.value)}
            label="الجهة الاصدار"
            placeholder="الجهة الاصدار"
            type="text"
          />
          <InputField
            value={formData.infoOffice}
            error={errors.infoOffice}
            name="infoOffice"
            disabled={isLoading || disabled}
            onChange={(e) => handleChange('infoOffice', e.target.value)}
            label="مكتب المعلومات"
            placeholder="مكتب المعلومات"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}

export default AddAccountInformation;
