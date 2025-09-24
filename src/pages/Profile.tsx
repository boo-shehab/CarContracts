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
import { compressImage } from '../utilities/compressImage';

const passwordValid = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

const getAbsoluteImageUrl = (url: string) => {
  if (!url) return userImage;
  if (url.startsWith('http')) return url;
  // Replace with your actual API base URL if needed
  const apiBase = process.env.REACT_APP_API_URL || '';
  return apiBase + url;
};

const Profile = () => {
  const { id: paramId } = useParams<{ id?: string }>();
  const [initialState, setInitialState] = useState<any>({
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    imageUrl: userImage, // Always present!
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, roles, accessToken, refreshToken } = useSelector((state: any) => state.auth);

  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(userImage);
  const [isChanged, setIsChanged] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isOtherUser, setIsOtherUser] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    if (paramId && String(user?.username) !== paramId) {
      setIsLoading(true);
      setIsOtherUser(true);
      try {
        const res = await axios.get(`users/CompanyUserRol/${paramId}`);
        const otherUser = res.data?.data;
        if (otherUser) {
          const userData = {
            email: otherUser.email || '',
            phone: otherUser.phone || '',
            username: otherUser.username || '',
            password: '',
            confirmPassword: '',
            imageUrl: getAbsoluteImageUrl(otherUser.imageUrl) || userImage,
          };
          setInitialState(userData);
          setFormData(userData);
          setPreview(userData.imageUrl);
        }
      } catch {
        toast.error('تعذر جلب بيانات المستخدم');
      } finally {
        setIsLoading(false);
      }
    } else if (user) {
      setIsOtherUser(false);
      const userData = {
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || '',
        password: '',
        confirmPassword: '',
        imageUrl: getAbsoluteImageUrl(user.imageUrl) || userImage,
      };
      setInitialState(userData);
      setFormData(userData);
      setPreview(userData.imageUrl);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

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
      formData.password !== '' ||
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
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));

    if (e.target.name === 'phone') {
      const phone = e.target.value.startsWith('+') ? e.target.value : `+${e.target.value}`;
      if (!isValidPhoneNumber(phone)) {
        setPhoneError('يرجى إدخال رقم هاتف دولي صالح (مثال: +964xxxxxxxxxx)');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const compressedFile = await compressImage(file);
      setImageFile(compressedFile);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview(userImage);
  };

  const handleSave = async () => {
    if (!formData.username || !formData.email || !formData.phone) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }
    if (formData.password && !passwordValid(formData.password)) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على رقم، حرف كبير، حرف صغير، ورمز خاص');
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }
    if (phoneError) {
      toast.error('يرجى إدخال رقم هاتف صحيح');
      return;
    }
    try {
      setIsLoading(true);
      let imageChanged = false;
      let imageRemoved = false;
      let newImageUrl = preview;

      // Remove image (set to default)
      if (preview === userImage && initialState.imageUrl !== userImage) {
        const response = await fetch(userImage);
        const blob = await response.blob();
        const defaultFile = new File([blob], "default.png", { type: blob.type });

        const formDataImage = new FormData();
        formDataImage.append('photo', defaultFile);

        const image = await axios.put('/users/me/photo', formDataImage, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPreview(userImage);
        setInitialState((prev: any) => ({ ...prev, imageUrl: userImage }));
        imageRemoved = true;
        newImageUrl = userImage;
      }

      // Upload new image
      if (imageFile !== null) {
        const formDataImage = new FormData();
        formDataImage.append('photo', imageFile);

        const image = await axios.put('/users/me/photo', formDataImage, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const backendUrl = getAbsoluteImageUrl(image.data.data.imageUrl);
        setPreview(backendUrl);
        setInitialState((prev: any) => ({ ...prev, imageUrl: backendUrl }));
        imageChanged = true;
        newImageUrl = backendUrl;
        setImageFile(null);
      }

      // Only send changed fields (not imageUrl)
      const payload: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'imageUrl') return;
        if (
          key !== 'confirmPassword' &&
          value !== initialState[key as keyof typeof initialState] &&
          value !== '' &&
          !(key === 'password' && value === '')
        ) {
          payload[key] = value;
        }
      });

      if (Object.keys(payload).length > 0) {
        await axios.put('/users/me/profile', payload);
        setInitialState((prev: any) => ({ ...prev, ...payload }));
        setFormData((prev: any) => ({ ...prev, ...payload }));
      }

      if (Object.keys(payload).length > 0 || imageChanged || imageRemoved) {
        dispatch(
          setUser({
            user: { ...user, ...payload, imageUrl: newImageUrl },
            accessToken: accessToken || '',
            refreshToken: refreshToken || '',
            roles: roles || [],
          })
        );
        toast.success('تم حفظ التعديلات بنجاح!');
      }
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

  const requiredFieldsFilled =
    formData.username &&
    formData.email &&
    formData.phone &&
    (!formData.password || passwordValid(formData.password)) &&
    (!formData.password || formData.confirmPassword);

  const canSave =
    isChanged &&
    requiredFieldsFilled &&
    !isPasswordMismatch &&
    !phoneError &&
    !isLoading;    

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
                {formData.password && !passwordValid(formData.password) && (
                  <p className="text-red-600 text-sm">
                    كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على رقم، حرف كبير، حرف صغير، ورمز خاص
                  </p>
                )}
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
                disabled={!canSave}
                className={`w-full py-3.5 rounded-[8px] text-xl font-semibold transition-colors duration-200 ${
                  !canSave
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
        {initialState && initialState?.id && initialState?.roles && initialState?.roles[0] !== 'ROLE_COMPANY' && (
          <UserRoles
            isOtherUser={isOtherUser}
            refresh={fetchUserData}
            userInfo={initialState}
            companyUserId={user?.companyUserId}
          />
        )}
        <ActivitiesTimeline />
      </div>
    </div>
  );
};

export default Profile;
