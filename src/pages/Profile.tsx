import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import userImage from '../assets/userImage.png';
import InputField from '../components/Form/InputField';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { CiCamera } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../features/auth/authSlice'; // adjust path if needed

const Profile = () => {
  const [initialState, setInitialState] = useState({
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    imageUrl: userImage,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, roles, accessToken, refreshToken } = useSelector((state: any) => state.auth);

  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialState.imageUrl);
  const [isChanged, setIsChanged] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const userData = {
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || '',
        imageUrl: user.imageUrl || userImage,
        password: '',
        confirmPassword: '',
      };

      setInitialState(userData);
      setFormData(userData);
      setPreview(userData.imageUrl);
    }
  }, [user]);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    const changed =
      formData.username !== initialState.username ||
      formData.email !== initialState.email ||
      formData.phone !== initialState.phone ||
      formData.password !== initialState.password ||
      preview !== initialState.imageUrl;

    setIsChanged(changed);
  }, [
    formData,
    preview,
    initialState.username,
    initialState.email,
    initialState.phone,
    initialState.password,
    initialState.imageUrl,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(formData);

    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (e.target.name === 'phone') {
      const phone = e.target.value.startsWith('+') ? e.target.value : `+${e.target.value}`;
      if (!isValidPhoneNumber(phone)) {
        setPhoneError('يرجى إدخال رقم هاتف دولي صالح (مثال: +964xxxxxxxxxx)');
      } else {
        setPhoneError('');
      }
    }
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
    if (phoneError) {
      toast.error('يرجى إدخال رقم هاتف صحيح');
      return;
    }
    try {
      // Handle image upload if changed
      setIsLoading(true);
      if (imageFile && imageFile instanceof File) {
        const formDataImage = new FormData();
        formDataImage.append('photo', imageFile);

        const image = await axios.put('/users/me/photo', formDataImage, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        formData.imageUrl = image.data.imageUrl; // Update image URL in formData
        setPreview(image.data.imageUrl); // Update preview with new image URL
      }

      // Only send changed fields
      const payload: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key !== 'confirmPassword' &&
          value !== initialState[key as keyof typeof initialState] &&
          value !== ''
        ) {
          payload[key] = value;
        }
      });

      // Don't send if nothing changed except image
      if (Object.keys(payload).length > 0) {
        await axios.put('/users/me/profile', payload);
        setInitialState((prev) => ({ ...prev, ...payload }));
        setFormData((prev) => ({ ...prev, ...payload }));
      }
      // Update Redux user, keeping tokens and roles
      dispatch(
        setUser({
          user: { ...user, ...payload, imageUrl: preview },
          accessToken: accessToken || '',
          refreshToken: refreshToken || '',
          roles: roles || [],
        })
      );
      toast.success('تم حفظ التعديلات بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ التعديلات');
      console.error('Error saving profile:', error);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordMismatch = formData.password !== formData.confirmPassword;

  return (
    <div>
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
        <h3 className="text-[28px]">الملف الشخصي</h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center gap-4">
          {/* the input should be above the image */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            <img
              src={preview || userImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />

            <label className="absolute bottom-0 left-0 w-full h-1/2 bg-black/20 flex items-center justify-center cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <CiCamera size={30} color="white" />
            </label>
          </div>

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
              name="username"
              label="الاسم"
              type="text"
              placeholder="أدخل اسمك"
              disabled={isLoading}
              value={formData.username}
              onChange={handleChange}
              leftIcon={<FaUser />}
            />
            <InputField
              name="email"
              label="البريد الإلكتروني"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
              leftIcon={<FaEnvelope />}
            />
            <InputField
              name="phone"
              label="رقم الهاتف"
              type="number"
              placeholder="أدخل رقم هاتفك"
              disabled={isLoading}
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<FaPhone />}
            />
            {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
            <InputField
              name="password"
              label="كلمة المرور"
              type="password"
              placeholder="أدخل كلمة المرور"
              disabled={isLoading}
              value={formData.password}
              onChange={handleChange}
              leftIcon={<FaLock />}
            />
            <InputField
              name="confirmPassword"
              label="تأكيد كلمة المرور"
              type="password"
              placeholder="أعد كتابة كلمة المرور"
              disabled={isLoading}
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<FaLock />}
            />
            {isPasswordMismatch && (
              <p className="text-red-600 text-sm">كلمتا المرور غير متطابقتين</p>
            )}

            <button
              onClick={handleSave}
              disabled={Boolean(!isChanged || isPasswordMismatch || phoneError || isLoading)}
              className={`w-full py-2 rounded font-semibold transition-colors duration-200 ${
                !isChanged || isPasswordMismatch || phoneError || isLoading
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ التعديل'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
