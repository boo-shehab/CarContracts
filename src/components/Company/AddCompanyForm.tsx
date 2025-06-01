import { useState } from 'react';
import InputField from '../Form/InputField';
import { createCompany } from '../../services/companyService';
import CustomDatePicker from '../Form/DateFiled/CustomDatePicker';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

interface AddCompanyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddCompanyForm = ({ onSuccess, onCancel }: AddCompanyFormProps) => {
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    ownerContact: '',
    userCount: '',
    subscriptionDate: '',
    expirationDate: '',
    companyLocation: '',
  });

  const [formErrors, setFormErrors] = useState({
    companyName: '',
    ownerName: '',
    ownerContact: '',
    userCount: '',
    subscriptionDate: '',
    expirationDate: '',
    companyLocation: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      companyName: '',
      ownerName: '',
      ownerContact: '',
      userCount: '',
      subscriptionDate: '',
      expirationDate: '',
      companyLocation: '',
    });
    setFormErrors({
      companyName: '',
      ownerName: '',
      ownerContact: '',
      userCount: '',
      subscriptionDate: '',
      expirationDate: '',
      companyLocation: '',
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
      if (!value) errors[key] = 'هذا الحقل مطلوب';
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createCompany({
        ...formData,
        userCount: Number(formData.userCount),
      });
      toast.success('تم اضافة الشركة بنجاح');
      resetForm();
      onSuccess();
    } catch (err) {
      console.error('Failed to create company', err);
      toast.error('فشل في اضافة الشركة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        placeholder="ادخل اسم الشركة"
        label="اسم الشركة"
        error={formErrors.companyName}
      />
      <InputField
        type="text"
        name="ownerName"
        value={formData.ownerName}
        onChange={handleChange}
        placeholder="اسم المالك"
        label="اسم المالك"
        error={formErrors.ownerName}
      />
      <InputField
        type="number"
        name="ownerContact"
        value={formData.ownerContact}
        onChange={handleChange}
        placeholder="رقم المالك"
        label="رقم المالك"
        error={formErrors.ownerContact}
      />
      <InputField
        type="number"
        name="userCount"
        value={formData.userCount}
        onChange={handleChange}
        placeholder="عدد المستخدمين"
        label="عدد المستخدمين"
        error={formErrors.userCount}
      />
      <CustomDatePicker
        name="subscriptionDate"
        value={formData.subscriptionDate}
        onChange={(e: any) => handleDateChange('subscriptionDate', e.target.value)}
        label="تاريخ الاشتراك"
        error={formErrors.subscriptionDate}
      />
      <CustomDatePicker
        name="expirationDate"
        value={formData.expirationDate}
        onChange={(e: any) => handleDateChange('expirationDate', e.target.value)}
        label="تاريخ الانتهاء"
        error={formErrors.expirationDate}
      />
      <InputField
        type="text"
        name="companyLocation"
        value={formData.companyLocation}
        onChange={handleChange}
        placeholder="الموقع"
        label="موقع الشركة"
        error={formErrors.companyLocation}
      />
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-md w-full"
          disabled={isLoading}
        >
          {isLoading ? 'جاري الاضافة...' : 'اضافة'}
        </button>
      </div>
    </form>
  );
};

export default AddCompanyForm;
