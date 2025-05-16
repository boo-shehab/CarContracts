interface InputFieldProps {
  name: string;
  label?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const InputField = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
}: InputFieldProps) => {
  return (
    <div>
      {label && (
        <label className="block mb-2 text-xl font-medium text-black" htmlFor={name}>
          {label}
        </label>
      )}
      <div className={`relative`}>
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">{leftIcon}</div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-10 py-2 text-xl border rounded-2xl focus:outline-none transition-all ${
            error
              ? 'border-red-500 text-red-500 focus:border-red-500'
              : 'border-neutral-100 focus:border-blue-500 text-black'
          } ${disabled ? 'bg-gray-200' : ''} ${className}`}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black cursor-pointer">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-lg text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
