import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  value: string | string[];
  error?: string;
  onChange: (e: React.ChangeEvent<{ name: string; value: any }>) => void;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

function SelectField({
  name,
  label,
  options,
  placeholder = 'اختر...',
  value,
  error,
  onChange,
  className = '',
  disabled = false,
  multiple = false,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSingleSelect = (val: string) => {
    const event = {
      target: {
        name,
        value: val,
      },
    } as any;
    onChange(event);
    setIsOpen(false); // close only for single select
  };

  const handleMultiSelect = (val: string) => {
    const current = value as string[];
    const newValue = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];

    const event = {
      target: {
        name,
        value: newValue,
      },
    } as any;
    onChange(event);
  };

  const displayValue = multiple
    ? (value as string[]).length > 0
      ? options
          .filter((opt) => (value as string[]).includes(opt.value))
          .map((opt) => opt.label)
          .join(', ')
      : placeholder
    : options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className="mb-4" ref={containerRef}>
      {label && (
        <label htmlFor={name} className="block mb-2 text-xl font-medium text-black">
          {label}
        </label>
      )}

      <div
        className={`relative w-full px-4 py-1 border rounded-2xl border-neutral-100 focus-within:border-blue-500 transition text-black cursor-pointer ${
          error ? 'border-red-500 text-red-500' : ''
        } ${className}`}
        onClick={handleToggle}
      >
        <div className={`flex justify-between items-center text-xl py-2 ${!value ? 'text-gray-400' : ''}`}>
          <span>{displayValue}</span>
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>

        {isOpen && (
          <div
            className="absolute left-0 z-10 mt-2 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option) => (
              <div
                key={option.value}
                
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
              >
                {multiple ? (
                  <label className="flex items-center justify-between w-full cursor-pointer gap-2">
                    <span className="text-lg">{option.label}</span>
                    <input
                      type="checkbox"
                      checked={(value as string[]).includes(option.value)}
                      onChange={() => handleMultiSelect(option.value)}
                      className="form-checkbox w-5 h-5 rounded-md border-gray-300 text-blue-600"
                    />
                  </label>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSingleSelect(option.value)}
                    className="w-full text-left text-lg"
                  >
                    {option.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-lg text-red-500">{error}</p>}
    </div>
  );
}

export default SelectField;
