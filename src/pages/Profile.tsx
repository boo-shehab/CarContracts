import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import userImage from '../assets/userImage.png';
import InputField from '../components/Form/InputField';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { CiCamera } from 'react-icons/ci';
import { useNavigate, useParams } from 'react-router-dom';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import ActivitiesTimeline from '../components/ActivitiesTimeline';
import UserRoles from '../components/UserRoles';

const Profile = () => {
  const { id: paramId } = useParams<{ id?: string }>();
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
  const [isOtherUser, setIsOtherUser] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // If there's an id in the URL and it's not the logged-in user, fetch that user's data
    if (paramId && String(user?.id) !== paramId) {
      setIsLoading(true);
      setIsOtherUser(true);
      axios
        .get(`/users/${paramId}`)
        .then((res) => {
          const otherUser = res.data?.data;
          if (otherUser) {
            const userData = {
              email: otherUser.email || '',
              phone: otherUser.phone || '',
              username: otherUser.username || '',
              imageUrl: userImage, // No image available
              password: '',
              confirmPassword: '',
            };
            setInitialState(userData);
            setFormData(userData);
            setPreview(userImage);
          }
        })
        .catch(() => {
          toast.error('تعذر جلب بيانات المستخدم');
        })
        .finally(() => setIsLoading(false));
    } else if (user) {
      setIsOtherUser(false);
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
  }, [user, paramId]);

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
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'حدث خطأ أثناء حفظ التعديلات';
      toast.error(message);
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
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            <img
              src={preview || userImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <label className="absolute bottom-0 left-0 w-full h-1/2 bg-black/20 flex items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isOtherUser}
              />
              <CiCamera size={30} color="white" />
            </label>
          </div>
          <button
            onClick={handleRemoveImage}
            className="text-red-600 border border-red-600 w-full px-4 py-2 rounded hover:bg-red-50 flex items-center justify-center gap-2 hover:text-red-700 transition-colors duration-200"
            disabled={isOtherUser}
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
              disabled={isLoading || isOtherUser}
              value={formData.username}
              onChange={handleChange}
              leftIcon={<FaUser />}
            />
            <InputField
              name="email"
              label="البريد الإلكتروني"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              disabled={isLoading || isOtherUser}
              value={formData.email}
              onChange={handleChange}
              leftIcon={<FaEnvelope />}
            />
            <InputField
              name="phone"
              label="رقم الهاتف"
              type="number"
              placeholder="أدخل رقم هاتفك"
              disabled={isLoading || isOtherUser}
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<FaPhone />}
            />
            {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
            {!isOtherUser && (
              <>
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
              </>
            )}
            {!isOtherUser && (
              <button
                onClick={handleSave}
                disabled={Boolean(!isChanged || isPasswordMismatch || phoneError || isLoading)}
                className={`w-full py-3.5 rounded-[8px] text-xl font-semibold transition-colors duration-200 ${
                  !isChanged || isPasswordMismatch || phoneError || isLoading
                    ? 'bg-gray-300 text-neutral-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ التعديل'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='flex mt-4 flex-col lg:flex-row gap-4'>
        <UserRoles
          isOtherUser={isOtherUser}
          username={paramId || user?.username}
          userId={user?.id}
          companyUserId={user?.companyUserId}
        />
        <ActivitiesTimeline />
      </div>
    </div>
  );
};

export default Profile;
