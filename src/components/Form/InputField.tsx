import { InputFieldProps } from './types';

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
  clearable = false,
  disabled = false,
}: InputFieldProps) => {
  return (
    <div>
      <div className="w-full flex justify-between items-center gap-2">
        {label && (
          <label className="block mb-2 text-lg font-medium text-black" htmlFor={name}>
            {label}
          </label>
        )}
        {clearable && value && (
          <button
            type="button"
            onClick={() => {
              const event = {
                target: { name, value: '' },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(event);
            }}
            className="text-primary-500 hover:text-primary-700 text-md"
          >
            اعادة الضبط
          </button>
        )}
      </div>
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
          className={`w-full px-10 py-2 text-lg border rounded-lg focus:outline-none transition-all ${
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
        <p id={`${name}-error`} className="mt-1 text-md text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
