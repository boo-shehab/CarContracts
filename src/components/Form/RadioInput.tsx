interface RadioInputProps {
    onChange: (e: any) => void;
    label?: string;
    name: string;
    value: string;
    options: { value: string; label: string }[];
    error?: string;
    className?: string;
    disabled?: boolean;
}

function RadioInput({label, name, value, options, onChange, error, className, disabled}: RadioInputProps) {
  return (
    <div className="mb-4">
        {label && <label className='text-2xl font-normal'>{label}</label>}
        <div className='flex items-center gap-4'>
            {options.map((item) => (
                <label key={item.value} className='flex items-center gap-2 cursor-pointer'>
                    <input
                    type='radio'
                    name={name}
                    disabled={disabled}
                    value={item.value}
                    checked={value === item.value}
                    onChange={onChange}
                    className={`w-5 h-5 ${className} ${disabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                    />
                    <span className='text-2xl'>{item.label}</span>
                </label>
            ))}
        </div>
        {error && <p className='mt-1 text-lg text-red-500'>{error}</p>}
    </div>
  )
}

export default RadioInput
