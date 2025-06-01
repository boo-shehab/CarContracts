import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import userImage from '../assets/userImage.png';
import InputField from '../components/Form/InputField';

const Profile = () => {
  const initialState = {
    name: 'محمد علي',
    email: 'mustafaemad@gmail.com',
    phone: '07XXXXXXXX',
    password: 'password123',
    image: userImage,
  };

  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialState.image);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    const changed =
      formData.name !== initialState.name ||
      formData.email !== initialState.email ||
      formData.phone !== initialState.phone ||
      formData.password !== initialState.password ||
      preview !== initialState.image;

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

  const handleSave = () => {
    console.log('Saved:', { ...formData, image: preview });
    // TODO: Send data to backend
  };

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
              name="name"
              label="الاسم"
              type="text"
              placeholder="أدخل اسمك"
              value={formData.name}
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
              type="tel"
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

            <button
              onClick={handleSave}
              disabled={!isChanged}
              className={`w-full py-2 rounded font-semibold transition-colors duration-200 ${
                isChanged
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-700 cursor-not-allowed'
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
