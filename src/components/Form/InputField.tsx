import { CiSearch, CiUser } from "react-icons/ci";

interface InputFieldProps {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}
const InputField = ({name, label, type, placeholder, value, error, onChange, leftIcon, rightIcon, className, disabled}: InputFieldProps) => {
  return (
    <div className='mb-4'>
      <label className='block mb-2 text-xl font-medium text-black' htmlFor={name}>{label}</label>
      <div className={`group flex items-center justify-center gap-1 overflow-hidden px-4 py-1 border rounded-2xl border-neutral-100 focus-within:border-blue-500 transition text-black ${error ? 'border-red-500 focus-within:border-red-500 text-red-500' : ''}`}>
        {rightIcon && rightIcon}
        <input 
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-2 text-xl border-0 active:border-0 focus:border-0 focus:outline-none ${className} ${disabled ? 'bg-gray-200' : ''}`}
          disabled={disabled}
          placeholder={placeholder} />
        {leftIcon && leftIcon}
      </div>
      {error && <p className='mt-1 text-lg text-red-500'>{error}</p>}
    </div>
  )
}

export default InputField