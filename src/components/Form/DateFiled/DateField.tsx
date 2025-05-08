import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react'

import './DateField.css'

function CustomDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <div className="relative w-full">
      <label className="block mb-2 text-xl font-medium text-black text-right">
        تاريخ الاشتراك
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy / MM / dd"
        placeholderText="YYYY / MM / DD"
        className="w-full py-2 pl-12 pr-1 text-xl border border-gray-300 rounded-2xl focus:outline-none"
        calendarClassName="customDatepicker"
      />
    </div>
  )
}

export default CustomDatePicker
