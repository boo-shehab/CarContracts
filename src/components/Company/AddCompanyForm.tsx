import { useState, useEffect } from 'react';
import InputField from '../Form/InputField';
import { createCompany, updateCompany } from '../../services/companyService';
import CustomDatePicker from '../Form/DateFiled/CustomDatePicker';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { CompanyFormData } from './types';

interface AddCompanyFormProps {
  onSuccess: (data: CompanyFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CompanyFormData>;
  isEdit?: boolean;
}

const AddCompanyForm = ({ onSuccess, onCancel, initialData, isEdit }: AddCompanyFormProps) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: '',
    ownerName: '',
    ownerContact: '',
    userCount: '',
    subscriptionDate: '',
    expirationDate: '',
    companyLocation: '',
    companyUsername: '',
    companyPassword: '',
    companyEmail: '',
    ...initialData,
  });

  const [formErrors, setFormErrors] = useState<CompanyFormData>({
    companyName: '',
    ownerName: '',
    ownerContact: '',
    userCount: '',
    subscriptionDate: '',
    expirationDate: '',
    companyLocation: '',
    companyUsername: '',
    companyPassword: '',
    companyEmail: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      companyName: '',
      ownerName: '',
      ownerContact: '',
      userCount: '',
      subscriptionDate: '',
      expirationDate: '',
      companyLocation: '',
      companyUsername: '',
      companyPassword: '',
      companyEmail: '',
    });
    setFormErrors({
      companyName: '',
      ownerName: '',
      ownerContact: '',
      userCount: '',
      subscriptionDate: '',
      expirationDate: '',
      companyLocation: '',
      companyUsername: '',
      companyPassword: '',
      companyEmail: '',
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: any = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value && !(isEdit && (key === 'companyPassword' || key === 'companyUsername'))) {
        errors[key] = 'هذا الحقل مطلوب';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isEdit && initialData?.id) {
        await updateCompany(initialData.id, {
          ...formData,
          userCount: Number(formData.userCount),
        });
        toast.success('تم تعديل الشركة بنجاح');
      } else {
        await createCompany({
          ...formData,
          userCount: Number(formData.userCount),
        });
        toast.success('تم اضافة الشركة بنجاح');
        resetForm();
      }
      onSuccess(formData);
    } catch (err: any) {
      console.error('Failed to save company', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        (isEdit ? 'فشل في تعديل الشركة' : 'فشل في اضافة الشركة');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg z-10 w-full h-10/12 overflow-x-auto max-w-lg p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <button type="button" onClick={onCancel} className="text-neutral-400 hover:text-black">
            <IoCloseOutline size={24} />
          </button>
        </div>
        <InputField
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="ادخل اسم الشركة"
          label="اسم الشركة"
          error={formErrors.companyName}
        />
        <InputField
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="اسم المالك"
          label="اسم المالك"
          error={formErrors.ownerName}
        />
        <InputField
          type="number"
          name="ownerContact"
          value={formData.ownerContact}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="رقم المالك"
          label="رقم المالك"
          error={formErrors.ownerContact}
        />
        <InputField
          type="number"
          name="userCount"
          value={formData.userCount}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="عدد المستخدمين"
          label="عدد المستخدمين"
          error={formErrors.userCount}
        />
        <CustomDatePicker
          name="subscriptionDate"
          value={formData.subscriptionDate}
          onChange={(e: any) => handleDateChange('subscriptionDate', e.target.value)}
          label="تاريخ الاشتراك"
          disabled={isLoading}
          error={formErrors.subscriptionDate}
        />
        <CustomDatePicker
          name="expirationDate"
          value={formData.expirationDate}
          onChange={(e: any) => handleDateChange('expirationDate', e.target.value)}
          label="تاريخ الانتهاء"
          disabled={isLoading}
          error={formErrors.expirationDate}
        />
        <InputField
          type="text"
          name="companyLocation"
          value={formData.companyLocation}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="الموقع"
          label="موقع الشركة"
          error={formErrors.companyLocation}
        />
        <InputField
          type="text"
          name="companyUsername"
          value={formData.companyUsername}
          onChange={handleChange}
          disabled={isLoading || isEdit}
          placeholder="معرف الشركة"
          label="معرف الشركة"
          error={formErrors.companyUsername}
        />
        <InputField
          type="text"
          name="companyEmail"
          value={formData.companyEmail}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="البريد الالكتروني"
          label="البريد الالكتروني"
          error={formErrors.companyEmail}
        />
        <InputField
          type="text"
          name="companyPassword"
          value={formData.companyPassword}
          onChange={handleChange}
          disabled={isLoading || isEdit}
          placeholder="كلمة المرور"
          label="كلمة المرور"
          error={formErrors.companyPassword}
        />
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-md w-full"
            disabled={isLoading}
          >
            {isLoading
              ? isEdit
                ? 'جاري التعديل...'
                : 'جاري الاضافة...'
              : isEdit
              ? 'تعديل'
              : 'اضافة'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyForm;
