interface RadioInputProps {
    onChange: (e: any) => void;
    label?: string;
    name: string;
    value: string;
    options: { value: string; label: string }[];

}

function RadioInput({label, name, value, options, onChange}: RadioInputProps) {
  return (
    <div>
        {label && <label className='text-2xl font-normal'>{label}</label>}
        <div className='flex items-center gap-4'>
            {options.map((item) => (
                <label key={item.value} className='flex items-center gap-2 cursor-pointer'>
                    <input
                    type='radio'
                    name={name}
                    value={item.value}
                    checked={value === item.value}
                    onChange={onChange}
                    className='w-5 h-5 text-red-600'
                    />
                    <span className='text-2xl'>{item.label}</span>
                </label>
            ))}
        </div>
    </div>
  )
}

export default RadioInput
