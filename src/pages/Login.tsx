import React from 'react'
import InputField from '../components/Form/InputField'

const Login = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='w-md p-6 bg-white rounded-2xl border'>
            <h2 className='mb-1 text-[28px] font-bold'>الاداري لادارة عقود السيارات</h2>
            <p className='mb-6 text-2xl text-neutral-400'>يرجى تسجيل الدخول للمتابعة !</p>
            <form>
                <InputField label="اسم المستخدم" type="text" placeholder="ادخل اسم المستخدم" />
                <div className='mb-4'>
                    <label className='block mb-2 text-sm font-medium text-gray-700' htmlFor="password">كلمة السر</label>
                    <input type="password" id="password" className='w-full p-2 border border-gray-300 rounded' placeholder='ادخل كلمة السر' required />
                </div>
                <button type="submit" className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>Login</button>
            </form>

        </div>
        
    </div>
  )
}

export default Login