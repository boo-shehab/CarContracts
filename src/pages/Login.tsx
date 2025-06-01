import { useState } from 'react';
import InputField from '../components/Form/InputField';
import { CiSearch, CiUser } from 'react-icons/ci';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { login } from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await login(user.username, user.password);
      const { accessToken, refreshToken } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('roles', JSON.stringify(data.roles));

      navigate('/');
    } catch (err: any) {
      console.error('Login failed', err);
      toast.error(err?.response?.data?.message || 'فشل تسجيل الدخول');
      setUser({ username: '', password: '' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = user.username && user.password;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-lg min-h-[80vh] p-6 bg-white rounded-2xl shadow-md border flex flex-col">
        <h2 className="mb-1 text-[28px] font-bold">الاداري لادارة عقود السيارات</h2>
        <p className="mb-6 text-2xl text-neutral-400">يرجى تسجيل الدخول للمتابعة !</p>
        <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 gap-4">
          <div className="flex flex-col gap-4">
            <InputField
              label="اسم المستخدم"
              type="text"
              placeholder="ادخل اسم المستخدم"
              name="username"
              value={user.username}
              onChange={handleChange}
              rightIcon={<CiSearch size={24} className="group-focus-within:hidden text-black" />}
              leftIcon={<CiUser size={24} className="text-black" />}
            />

            <InputField
              label="كلمة السر"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="ادخل كلمة السر"
              name="password"
              value={user.password}
              onChange={handleChange}
              leftIcon={
                isPasswordVisible ? (
                  <LuEye
                    size={24}
                    className="text-black cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <LuEyeClosed
                    size={24}
                    className="text-black cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )
              }
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 rounded-2xl text-2xl bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 transition"
            disabled={!isFormValid || loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
