import React from 'react';
const DatePicker = React.lazy(() => import("react-datepicker"));
import { CiCalendarDate } from 'react-icons/ci'
import 'react-datepicker/dist/react-datepicker.css'
import './DateField.css'

interface CustomDatePickerProps {
  label?: string
  name: string
  placeholder?: string
  value: string
  onChange: any
  disabled?: boolean
  error?: string

}

function CustomDatePicker({label, name, placeholder = 'YYYY / MM / DD', value, onChange, disabled, error}: CustomDatePickerProps) {
  return (
    <div className="mb-4">
      <div>
        {label && (
          <label className="block mb-2 text-xl font-medium text-black text-right">
            {label}
          </label>
        )}
        <div className='relative flex items-center justify-center gap-1 px-4 py-1 border rounded-2xl border-neutral-100 focus-within:border-blue-500 transition text-black'>
          <CiCalendarDate size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <DatePicker
            selected={value}
            onChange={(e) => onChange({target: { name, value: e } })}
            disabled={disabled}
            name={name}
            placeholderText={placeholder}
            dateFormat="yyyy / MM / dd"
            className="w-full p-2 text-xl border-none focus:border-none focus:outline-none text-black"
            calendarClassName="customDatepicker"
          />
        </div>
        {error? <p className="mt-1 text-lg text-red-500">{error}</p> : null}
      </div>

    </div>
  )
}

export default CustomDatePicker
