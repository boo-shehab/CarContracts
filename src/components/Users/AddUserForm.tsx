import { useState } from 'react';
import InputField from '../Form/InputField';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { UserFormData } from './types';
import { useSelector } from 'react-redux';
import { createUserToCompany, updateUserToCompany } from '../../services/UserService';

interface AddUserFormProps {
  onSuccess: (data: UserFormData) => void;
  onCancel: () => void;
  initialData?: Partial<UserFormData>;
  isEdit?: boolean;
}

const AddUserForm = ({ onSuccess, onCancel, initialData, isEdit }: AddUserFormProps) => {
  const companyUserId = useSelector((state: any) => state.auth.companyUserId);
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    username: '',
    ...initialData,
  });

  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});

  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      userType: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      username: '',
    });
    setFormErrors({});
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: Partial<UserFormData> = {};

    // List of disabled fields in edit mode
    const disabledFields = isEdit
      ? ['fullName', 'email', 'password', 'confirmPassword']
      : [];

    Object.entries(formData).forEach(([key, value]) => {
      if (
        !value &&
        key !== 'userType' &&
        key !== 'username' &&
        !disabledFields.includes(key)
      ) {
        errors[key as keyof UserFormData] = 'هذا الحقل مطلوب';
      }
    });

    if (
      !disabledFields.includes('password') &&
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    // Email format validation (only if not disabled)
    if (
      !disabledFields.includes('email') &&
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    // Iraqi phone number validation (only if not disabled)
    if (
      !disabledFields.includes('phone') &&
      formData.phone
    ) {
      const phone = formData.phone.replace(/\D/g, '');
      const iraqMobileRegex = /^07[3-9]\d{8}$/;
      if (!(phone.length === 11 && iraqMobileRegex.test(phone))) {
        errors.phone = 'يرجى إدخال رقم هاتف عراقي صحيح مكون من 11 رقم ويبدأ بـ 07';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      if (isEdit && initialData?.id) {
        // Call your update API here
        // await updateUserToCompany({ ...dataToSend, companyId: companyUserId, id: initialData.id });
        await updateUserToCompany({
          username: dataToSend.username,
          phone: dataToSend.phone,
          companyId: companyUserId, 
          userId: initialData?.id
        });
        toast.success('تم تعديل المستخدم بنجاح');
      } else {
        await createUserToCompany({
          ...dataToSend,
          companyId: companyUserId,
        });
        toast.success('تم اضافة المستخدم بنجاح');
      }
      resetForm();
      onSuccess(formData);
    } catch (err) {
      console.error('Failed to save user', err);
      toast.error(isEdit ? 'فشل في تعديل المستخدم' : 'فشل في اضافة المستخدم');
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
        <div className="flex flex-col gap-4">
          <InputField
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isLoading || isEdit}
            placeholder="ادخل اسم المستخدم"
            label="اسم المستخدم"
            error={formErrors.fullName}
          />
          <InputField
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="ادخل اسم المستخدم"
            label="اسم المستخدم"
            error={formErrors.username}
          />
          <InputField
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading  || isEdit}
            placeholder="البريد الالكتروني"
            label="البريد الالكتروني"
            error={formErrors.email}
          />
          <InputField
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="رقم الهاتف"
            label="رقم الهاتف"
            error={formErrors.phone}
          />
          <InputField
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading || isEdit}
            placeholder="كلمة المرور"
            label="كلمة المرور"
            error={formErrors.password}
          />
          <InputField
            type="text"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading || isEdit}
            placeholder="تأكيد كلمة المرور"
            label="تأكيد كلمة المرور"
            error={formErrors.confirmPassword}
          />
        </div>
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
    </div>
  );
};

export default AddUserForm;
