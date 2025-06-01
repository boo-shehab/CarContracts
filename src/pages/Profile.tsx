import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import userImage from '../assets/userImage.png';
import InputField from '../components/Form/InputField';
import axios from '../services/axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const [initialState, setInitialState] = useState({
    email: '',
    phone: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    imageUrl: userImage,
  });

  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialState.imageUrl);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/users/me');
        const user = res.data.data;

        const mappedUser = {
          email: user.email || '',
          phone: user.phone || '',
          fullName: user.fullName || '',
          password: '',
          confirmPassword: '',
          imageUrl: user.imageUrl || userImage,
        };

        setInitialState(mappedUser);
        setFormData(mappedUser);
        setPreview(mappedUser.imageUrl);
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    const changed =
      formData.fullName !== initialState.fullName ||
      formData.email !== initialState.email ||
      formData.phone !== initialState.phone ||
      formData.password !== initialState.password ||
      preview !== initialState.imageUrl;

    setIsChanged(changed);
  }, [formData, preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview('');
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }
    try {
      await axios.put('/users/me', { ...formData, imageUrl: preview });
      toast.success('تم حفظ التعديلات بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ التعديلات');
      console.error('Error saving profile:', error);
      return;
    }

    // TODO: Send data to backend
  };

  const isPasswordMismatch = formData.password !== formData.confirmPassword;

  return (
    <div className="p-4">
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight size={40} />
        <h3 className="text-[28px]">الملف الشخصي</h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow flex flex-col items-center gap-4">
          <img
            src={preview || userImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <label className="cursor-pointer text-blue-600 hover:underline">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            تغيير الصورة
          </label>

          <button
            onClick={handleRemoveImage}
            className="text-red-600 border border-red-600 w-full px-4 py-2 rounded hover:bg-red-50 flex items-center justify-center gap-2 hover:text-red-700 transition-colors duration-200"
          >
            حذف الصورة
            <RiDeleteBinLine />
          </button>
        </div>

        {/* Form Section */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <div className="space-y-4">
            <InputField
              name="fullName"
              label="الاسم"
              type="text"
              placeholder="أدخل اسمك"
              value={formData.fullName}
              onChange={handleChange}
              leftIcon={<FaUser />}
            />
            <InputField
              name="email"
              label="البريد الإلكتروني"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<FaEnvelope />}
            />
            <InputField
              name="phone"
              label="رقم الهاتف"
              type="number"
              placeholder="أدخل رقم هاتفك"
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<FaPhone />}
            />
            <InputField
              name="password"
              label="كلمة المرور"
              type="password"
              placeholder="أدخل كلمة المرور"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<FaLock />}
            />
            <InputField
              name="confirmPassword"
              label="تأكيد كلمة المرور"
              type="password"
              placeholder="أعد كتابة كلمة المرور"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<FaLock />}
            />
            {isPasswordMismatch && (
              <p className="text-red-600 text-sm">كلمتا المرور غير متطابقتين</p>
            )}

            <button
              onClick={handleSave}
              disabled={Boolean(!isChanged || isPasswordMismatch)}
              className={`w-full py-2 rounded font-semibold transition-colors duration-200 ${
                !isChanged || isPasswordMismatch
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              حفظ التعديل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
