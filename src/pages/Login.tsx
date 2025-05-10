import { useState } from "react";
import InputField from "../components/Form/InputField"
import * as yup from "yup";
import { loginSchema } from "../schemas/loginSchema"
import { CiSearch, CiUser } from "react-icons/ci";
import { LuEye, LuEyeClosed } from "react-icons/lu";
const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    try {
      // Validate the single field
      const fieldSchema = yup.reach(loginSchema, name);
      if (fieldSchema && 'validate' in fieldSchema) {
        await fieldSchema.validate(value);
      }
      setErrors((prev) => ({ ...prev, [name]: "" }));

      // Clear the error message if validation passes

    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    try {
      const fieldSchema = yup.reach(loginSchema, name);
      await fieldSchema.validate(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginSchema.validate(user, { abortEarly: false });
      console.log("Form submitted:", user);
      // continue login logic here
    } catch (err: any) {
      const validationErrors: Record<string, string> = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='w-full max-w-lg min-h-[80vh] p-6 bg-white rounded-2xl border flex flex-col'>
            <h2 className='mb-1 text-[28px] font-bold'>الاداري لادارة عقود السيارات</h2>
            <p className='mb-6 text-2xl text-neutral-400'>يرجى تسجيل الدخول للمتابعة !</p>
            <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 gap-4 ">
              <div className="flex flex-col gap-4">
                <InputField 
                  label="اسم المستخدم" 
                  type="text" 
                  placeholder="ادخل اسم المستخدم" 
                  name="email" 
                  value={user.email} 
                  error={errors.email}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  rightIcon={<CiSearch size={24} className="group-focus-within:hidden text-black"/>}
                  leftIcon={<CiUser size={24} className="text-black"/>}
                />

                  <InputField
                  label="كلمة السر"
                  type={isPasswordVisible? "text" : "password"}
                  placeholder="ادخل كلمة السر"
                  name="password"
                  value={user.password}
                  error={errors.password}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                  leftIcon={
                    isPasswordVisible ?
                      <LuEye size={24} className="text-black" onClick={togglePasswordVisibility} /> :
                      <LuEyeClosed size={24} className="text-black" onClick={togglePasswordVisibility} />
                  }
                />
              </div>
              <button 
                type="submit" 
                className='w-full p-2 rounded-2xl text-2xl bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400' 
                disabled={ !( errors.email === '' && errors.password === '')? true: false}>
                  Login
                </button>
            </form>
        </div>
    </div>
  )
}

export default Login