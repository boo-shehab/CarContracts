import { CiSearch, CiUser } from "react-icons/ci";

interface InputFieldProps {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputField = ({id, label, type, placeholder, value, onChange}: InputFieldProps) => {
  return (
    <div className='mb-4'>
        <label className='block mb-2 text-sm font-medium text-gray-700' htmlFor={id}>{label}</label>
        <div className='group flex items-center justify-center gap-1 overflow-hidden px-4 py-1 border rounded-2xl border-neutral-100 focus-within:border-blue-500 transition'>
            <CiSearch size={24} className="group-focus-within:hidden"/>
            <input 
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                className='w-full p-2 border-0 active:border-0 focus:border-0 focus:outline-none'
                placeholder={placeholder}
                required />
            <CiUser size={24} />
        </div>
    </div>
  )
}

export default InputField