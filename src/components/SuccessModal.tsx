import { IoCheckmark } from 'react-icons/io5';
import axios from '../services/axios';
import { useState } from 'react';
import InputField from './Form/InputField';
import { toast } from 'react-toastify';

interface SuccessModalProps {
  message?: string;
  data?: any;
  onClose: () => void;
  open?: boolean;
}

const SuccessModal = ({ message = 'تم اضافة الشركة بنجاح !', data,onClose, open }: SuccessModalProps) => {
  const [cc, setCc] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [ccErrors, setCcErrors] = useState<string[]>(['']);
  if(!data) {
    return (
      <div className="bg-white z-10 rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col items-center">
        <div className="w-[75px] h-[75px] bg-blue-400/50 rounded-full flex items-center justify-center mb-4">
          <IoCheckmark size={40} className="text-white bg-blue-400 rounded-full p-2" />
        </div>
        <div className="text-blue-500 text-xl font-medium mb-6 text-center">{message}</div>
        <button
          onClick={onClose}
          className={`w-full py-2 rounded-lg text-white text-xl font-bold transition bg-primary-400 hover:bg-primary-500`}
        >
          موافق
        </button>
      </div>
    );
  }

  if (!open) return null;

  const validateEmail = (email: string) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCcChange = (value: string, index: number) => {
    const newCc = [...cc];
    newCc[index] = value;
    setCc(newCc);

    const newErrors = [...ccErrors];
    if (value && !validateEmail(value)) {
      newErrors[index] = 'يرجى إدخال بريد إلكتروني صحيح';
    } else {
      newErrors[index] = '';
    }
    setCcErrors(newErrors);
  };

  const handleAddCc = () => {
    setCc([...cc, '']);
    setCcErrors([...ccErrors, '']);
  };

  const isCcValid = cc.every((email) => !email || validateEmail(email));

  const handleSendData = async () => {
    if (!isCcValid) return;
    setIsLoading(true);
    try {
      // Filter out empty cc emails
      const ccList = cc.filter((e) => e.trim() !== '');
      const payload: any = {
        toEmail: data?.companyEmail || '',
        ownerName: data?.ownerName || '',
        cc: ccList,
        companyUsername: data?.companyUsername || '',
        companyPassword: data?.companyPassword || '',
      };
      await axios.post('/email/send', payload);
      toast.success('تم إرسال البيانات بنجاح!');
      onClose();
    } catch (error: any) {
      const message =
            error?.response?.data?.message ||
            error?.message ||
            "فشل في إرسال البيانات. يرجى المحاولة مرة أخرى.";
        toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white z-10 rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col items-center">
      <div className="w-[75px] h-[75px] bg-blue-400/50 rounded-full flex items-center justify-center mb-4">
        <IoCheckmark size={40} className="text-white bg-blue-400 rounded-full p-2" />
      </div>
      <div className="text-blue-500 text-xl font-medium mb-6 text-center">{message}</div>
      <div className="text-gray-600 text-sm mb-4">
        <p>اسم الشركة: {data?.companyName}</p>
        <p>اسم المالك: {data?.ownerName}</p>
        <p>اسم المستخدم: {data?.companyUsername}</p>
        <p>البريد الإلكتروني: {data?.companyEmail}</p>
      </div>

      <div className="w-full mb-4 flex flex-col gap-2">
        <label className="text-gray-700 text-sm mb-1">ارسل نسخ إلى:</label>
        {cc.map((email, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <InputField
                type="text"
                name={`cc-${index}`}
                value={email}
                disabled={isLoading}
                onChange={(e) => handleCcChange(e.target.value, index)}
                placeholder="ادخل البريد الإلكتروني للنسخة"
                error={ccErrors[index]}
              />
            </div>
            {index === cc.length - 1 && (
              <button
                type="button"
                className="text-blue-500 text-2xl px-2"
                onClick={handleAddCc}
                disabled={isLoading}
                title="إضافة بريد آخر"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSendData}
        disabled={!isCcValid || isLoading}
        className={`w-full py-2 rounded-lg text-white text-xl font-bold transition ${
          isCcValid || !isLoading ? 'bg-blue-400 hover:bg-blue-500' : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {isCcValid && !isLoading ? 'ارسال' : 'جاري الارسال...'}
      </button>
    </div>
  );
};

export default SuccessModal;
