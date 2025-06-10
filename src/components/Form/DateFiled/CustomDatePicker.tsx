import DatePicker from 'react-datepicker';
import { CiCalendarDate } from 'react-icons/ci';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css';

import { CustomDatePickerProps } from '../types';

function CustomDatePicker({
  label,
  name,
  placeholder = 'YYYY / MM / DD',
  value,
  onChange,
  disabled,
  className = '',
  error,
}: CustomDatePickerProps) {
  return (
    <div>
      <div>
        {label && (
          <label className="block mb-2 text-lg font-medium text-black text-right">{label}</label>
        )}
        <div className="relative flex items-center px-4 justify-center gap-1 border rounded-lg border-neutral-100 focus-within:border-blue-500 transition text-black">
          <CiCalendarDate
            size={24}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
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
