import { useState } from 'react';
import InputField from '../components/Form/InputField';
import { CiUser } from 'react-icons/ci';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { getMe, login } from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';

const Login = () => {
  const [user, setUserState] = useState({ username: '', password: '' });
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserState((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await login(user.username, user.password);

      const getUserData = await getMe(data.accessToken);
      const userData = getUserData.data;

      const { accessToken, refreshToken, roles } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('roles', JSON.stringify(roles));
      localStorage.setItem('user', JSON.stringify(userData));

      dispatch(
        setUser({
          token: accessToken,
          user: userData,
          refreshToken,
          roles: roles,
        })
      );

      navigate('/');
    } catch (err: any) {
      console.error('Login failed', err);
      toast.error(err?.response?.data?.message || 'فشل تسجيل الدخول');
      setUserState({ username: '', password: '' });
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
