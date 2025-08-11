import DatePicker from 'react-datepicker';
import { CiCalendarDate } from 'react-icons/ci';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css';

import { CustomDatePickerProps } from '../types';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function addYears(date: Date, years: number) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
function CustomDatePicker({
  label,
  name,
  placeholder = 'YYYY / MM / DD',
  value,
  onChange,
  disabled,
  className = '',
  error,
  showQuickSelect = false,
}: CustomDatePickerProps) {
  
  const [pickerDate, setPickerDate] = useState(value ? new Date(value) : null);
  const [dropdownOpen, setDropdownOpen] = useState(false)
  useEffect(() => {
    setPickerDate(value ? new Date(value) : null)
  }, [value])
  const handleQuickSelect = (type: string) => {
    const baseDate = pickerDate || new Date();
    
    let newDate: Date;
    switch (type) {
      case '+1month':
        newDate = addMonths(baseDate, 1);
        break;
      case '+3months':
        newDate = addMonths(baseDate, 3);
        break;
        case '+1year':
        newDate = addYears(baseDate, 1);
        break;
      default:
        newDate = baseDate;
    }
    setPickerDate(newDate);
    onChange({ target: { name, value: newDate } });
    setDropdownOpen(false)
  };

  return (
    <div>
      <div>
        {label && (
          <label className="block mb-2 text-lg font-medium text-black text-right">{label}</label>
        )}
        <div className="relative flex items-center px-4 justify-center gap-1 border rounded-lg border-neutral-100 focus-within:border-blue-500 transition text-black">
          {showQuickSelect ? (
            <div className="">
              <button
                type="button"
                className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 bg-white border-none p-0 m-0"
                onClick={() => setDropdownOpen((open) => !open)}
                disabled={disabled}
                tabIndex={-1}
              >
                {dropdownOpen ? (
                  <FaChevronDown size={20} className="text-gray-500" />
                ) : (
                  <FaChevronUp size={20} className='text-gray-500' />
                )}
              </button>
              {dropdownOpen && (
                <div
                  className="absolute left-0 top-10 bg-white border rounded shadow-lg z-20 w-full"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleQuickSelect('+1month')}
                    disabled={disabled}
                  >
                    +1 شهر
                  </button>
                  <button
                    type="button"
                    className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleQuickSelect('+3months')}
                    disabled={disabled}
                  >
                    +3 أشهر
                  </button>
                  <button
                    type="button"
                    className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleQuickSelect('+1year')}
                    disabled={disabled}
                  >
                    +1 سنة
                  </button>
                </div>
              )}
            </div>
          ) : (
            <CiCalendarDate
              size={24}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          )}
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(e) => onChange({ target: { name, value: e } })}
            disabled={disabled}
            name={name}
            placeholderText={placeholder}
            dateFormat="yyyy / MM / dd"
            className={`w-full p-2 text-lg border-none focus:border-none focus:outline-none text-black ${className} ${
              error ? 'border-red-500 text-red-500' : ''
            }`}
            calendarClassName="customDatepicker"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
        {error ? <p className="mt-1 text-md text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}

export default CustomDatePicker;
