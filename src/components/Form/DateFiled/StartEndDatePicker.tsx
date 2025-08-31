import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import CustomDatePicker from './CustomDatePicker';

export interface StartEndDateValue {
  start?: string;
  end?: string;
}

export interface StartEndDateProps {
  name: string;
  label?: string;
  value: StartEndDateValue;
  error?: string;
  onChange: (newName: string, val: any) => void;
  clearable?: boolean;
  className?: string;
  disabled?: boolean;
}

function StartEndDate({
  name = 'anyName',
  label = 'anyLabel',
  value = {},
  error = '',
  onChange = () => {},
  className = '',
  disabled = false,
}: StartEndDateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<StartEndDateValue>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     // Sync internal state when parent sends new value
  //     setInternalValue(value);
  //   }, [value]);

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const displayValue =
    internalValue?.start || internalValue?.end
      ? `${formatDate(internalValue.start)} - ${formatDate(internalValue.end)}`
      : 'اختر التاريخ';

  return (
    <div ref={containerRef}>
      <div className="flex justify-between items-center gap-2">
        {label && (
          <label htmlFor={name} className="block mb-2 text-lg font-medium text-black">
            {label}
          </label>
        )}
        {(internalValue?.start || internalValue?.end) && (
          <button
            type="button"
            onClick={() => {
              setInternalValue({ start: '', end: '' });
              onChange(`${name}To`, '');
              onChange(`${name}From`, '');
            }}
            className="text-primary-500 hover:text-primary-700 text-md"
          >
            اعادة الضبط
          </button>
        )}
      </div>

      <div
        className={`relative w-full px-4 border rounded-lg border-neutral-100 focus-within:border-blue-500 transition text-black cursor-pointer ${
          error ? 'border-red-500 text-red-500' : ''
        } ${className}`}
        onClick={handleToggle}
      >
        <div
          className={`flex justify-between items-center text-lg py-2 ${
            !internalValue?.start && !internalValue?.end ? 'text-gray-400' : ''
          }`}
        >
          <span>{displayValue}</span>
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-2 p-2">
            <CustomDatePicker
              label="من"
              name={`${name}From`}
              placeholder="YYYY/MM/DD"
              value={internalValue.start || null}
              onChange={(e: any) => {
                setInternalValue({ ...internalValue, start: e.target.value });
                onChange(e.target.name, e.target.value);
              }}
              disabled={disabled}
              className="text-[14px]"
              error={error}
            />
            <CustomDatePicker
              label="الى"
              name={`${name}To`}
              placeholder="YYYY/MM/DD"
              value={internalValue.end || null}
              onChange={(e: any) => {
                setInternalValue({ ...internalValue, end: e.target.value });
                onChange(e.target.name, e.target.value);
              }}
              className="text-[14px]"
              disabled={disabled}
              error={error}
            />
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-md text-red-500">{error}</p>}
    </div>
  );
}

export default StartEndDate;
