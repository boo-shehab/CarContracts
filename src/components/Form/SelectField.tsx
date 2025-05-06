interface SelectFieldProps {
    name: string;
    label?: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
    value: string;
    error?: string;
    onChange: (e: any) => void;
    className?: string;
    disabled?: boolean;
}
function SelectField({name, label, options, placeholder, value, error, onChange, className, disabled}: SelectFieldProps) {
  return (
    <div className="mb-4">
        { label && 
            <label className='block mb-2 text-xl font-medium text-black' htmlFor={name}>{label}</label>
        }
        <div className={`w-full px-4 py-2 border rounded-2xl border-neutral-100 focus-within:border-blue-500 transition text-black ${error ? 'border-red-500 focus-within:border-red-500 text-red-500' : ''} ${className}`}>
            <select 
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full p-2 text-xl border-0 active:border-0 focus:border-0 focus:outline-none ${className} ${disabled ? 'bg-gray-200' : ''} ${value === '' ? 'text-gray-400' : 'text-black'}`}
                disabled={disabled}
                aria-placeholder="Select an option">
                {placeholder && <option value="" disabled hidden>{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="text-black">{option.label}</option>
                ))}
            </select>

        </div>
        {error && <p className='mt-1 text-lg text-red-500'>{error}</p>}
    </div>
  )
}

export default SelectField
