import { useEffect, useCallback, useState } from 'react';
import InputField from '../Form/InputField';

interface AddAccountInformationProps {
  formData: {
    firstName: string;
    fatherName: string;
    grandfatherName: string;
    fourthName: string;
    lastName: string;
    idNumber: string;
    phoneNumber: string;
    residenceCardNumber: string;
    residence: {
      housing: string;
      district: string;
      alley: string;
      houseNumber: string;
    };
    issuingOffice: string;
    issuingAuthority: string;
  };
  title: string;
  setFormData: (data: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

function AddAccountInformation({
  formData,
  setFormData,
  title,
  onValidationChange,
}: AddAccountInformationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormFilled = useCallback(() => {
    const requiredFields = [
      formData.firstName,
      formData.fatherName,
      formData.grandfatherName,
      formData.fourthName,
      formData.lastName,
      formData.idNumber,
      formData.phoneNumber,
      formData.residenceCardNumber,
      formData.residence.housing,
      formData.residence.district,
      formData.residence.alley,
      formData.residence.houseNumber,
      formData.issuingOffice,
      formData.issuingAuthority,
    ];
    return requiredFields.every((val) => val && val.trim() !== '');
  }, [formData]);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormFilled());
    }
  }, [formData, isFormFilled, onValidationChange]);
  const validateField = (field: string, value: string, nested?: boolean) => {
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
        case 'lastName':
          error = 'اللقب مطلوب';
          break;
        case 'phoneNumber':
          error = 'رقم الهاتف مطلوب';
          break;
        case 'idNumber':
          error = 'رقم الهوية مطلوب';
          break;
        case 'residenceCardNumber':
          error = 'رقم بطاقة السكن مطلوب';
          break;
        case 'housing':
          error = 'السكن مطلوب';
          break;
        case 'district':
          error = 'المحلة مطلوبة';
          break;
        case 'alley':
          error = 'الزقاق مطلوب';
          break;
        case 'houseNumber':
          error = 'الدار مطلوب';
          break;
        case 'issuingAuthority':
          error = 'الجهة الاصدار مطلوبة';
          break;
        case 'issuingOffice':
          error = 'مكتب المعلومات مطلوب';
          break;
        default:
          break;
      }
    }
    setErrors((prev) => ({
      ...prev,
      [nested ? `residence.${field}` : field]: error,
    }));
  };

  const handleChange = (field: string, value: string, nested?: boolean) => {
    let newFormData: any;
    if (nested) {
      newFormData = {
        ...formData,
        residence: { ...formData.residence, [field]: value },
      };
    } else {
      newFormData = { ...formData, [field]: value };
    }
    setFormData(newFormData);
    validateField(field, value, nested);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 my-4">
      <p className="text-2xl text-neutral-500 font-normal">{title}</p>
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.firstName}
            error={errors.firstName}
            className="w-full"
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
            onChange={(e) => handleChange('fatherName', e.target.value)}
            label="اسم الاب"
            placeholder="اسم الاب"
            type="text"
          />
          <InputField
            value={formData.grandfatherName}
            error={errors.grandfatherName}
            name="grandfatherName"
            onChange={(e) => handleChange('grandfatherName', e.target.value)}
            label="اسم الجد"
            placeholder="اسم الجد"
            type="text"
          />
          <InputField
            value={formData.fourthName}
            error={errors.fourthName}
            name="fourthName"
            onChange={(e) => handleChange('fourthName', e.target.value)}
            label="اسم الرابع"
            placeholder="اسم الرابع"
            type="text"
          />
          <InputField
            value={formData.lastName}
            error={errors.lastName}
            name="lastName"
            onChange={(e) => handleChange('lastName', e.target.value)}
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
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            label="رقم الهاتف"
            placeholder="رقم الهاتف"
            type="number"
          />
          <InputField
            value={formData.idNumber}
            error={errors.idNumber}
            name="idNumber"
            onChange={(e) => handleChange('idNumber', e.target.value)}
            label="رقم الهوية"
            placeholder="رقم الهوية"
            type="number"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.residenceCardNumber}
            error={errors.residenceCardNumber}
            name="residenceCardNumber"
            onChange={(e) => handleChange('residenceCardNumber', e.target.value)}
            label="رقم بطاقة السكن"
            placeholder="رقم بطاقة السكن"
            type="number"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.residence.housing}
            error={errors['residence.housing']}
            name="residence.housing"
            onChange={(e) => handleChange('housing', e.target.value, true)}
            label="السكن"
            placeholder="السكن"
            type="text"
          />
          <InputField
            value={formData.residence.district}
            error={errors['residence.district']}
            name="residence.district"
            onChange={(e) => handleChange('district', e.target.value, true)}
            label="المحلة"
            placeholder="المحلة"
            type="text"
          />
          <InputField
            value={formData.residence.alley}
            error={errors['residence.alley']}
            name="residence.alley"
            onChange={(e) => handleChange('alley', e.target.value, true)}
            label="الزقاق"
            placeholder="الزقاق"
            type="text"
          />
          <InputField
            value={formData.residence.houseNumber}
            error={errors['residence.houseNumber']}
            name="residence.houseNumber"
            onChange={(e) => handleChange('houseNumber', e.target.value, true)}
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
            onChange={(e) => handleChange('issuingAuthority', e.target.value)}
            label="الجهة الاصدار"
            placeholder="الجهة الاصدار"
            type="text"
          />
          <InputField
            value={formData.issuingOffice}
            error={errors.issuingOffice}
            name="issuingOffice"
            onChange={(e) => handleChange('issuingOffice', e.target.value)}
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
