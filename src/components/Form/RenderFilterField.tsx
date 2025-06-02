import CustomDatePicker from './DateFiled/CustomDatePicker';
import StartEndDate from './DateFiled/StartEndDatePicker';
import InputField from './InputField';
import RadioInput from './RadioInput';
import SelectField from './SelectField';
import { RenderFilterFieldProps } from './types';

const RenderFilterField = ({ column, handleFilterChange, filters }: RenderFilterFieldProps) => {
  const name = column.key;
  const value = filters[name] || '';

  switch (column.filterType) {
    case 'text':
      return (
        <InputField
          key={name}
          name={name}
          label={column.title}
          type="text"
          placeholder={`ادخل ${column.title}`}
          clearable={true}
          value={value}
          onChange={(e) => handleFilterChange(name, e.target.value)}
          className="mb-3"
        />
      );

    case 'select':
      return (
        <SelectField
          key={name}
          name={name}
          label={column.title}
          options={column.filterOptions || []}
          placeholder={`اختر ${column.title}`}
          clearable={true}
          value={value}
          onChange={(e) => handleFilterChange(name, e.target.value)}
          className="mb-3"
        />
      );

    case 'radio':
      return (
        <RadioInput
          key={name}
          name={name}
          label={column.title}
          options={column.filterOptions || []}
          clearable={true}
          value={value}
          onChange={(e) => handleFilterChange(name, e.target.value)}
          className="mb-3"
        />
      );

    case 'date':
      return (
        <CustomDatePicker
          key={name}
          name={name}
          label={column.title}
          value={value}
          onChange={(val: string) => handleFilterChange(name, val)}
        />
      );
    case 'startEndDate':
      return (
        <StartEndDate
          name={name}
          label={column.title}
          value={value}
          onChange={(newName: any, val: any) => {
            const formatDate = (dateStr: string) => {
              if (!dateStr) return '';
              const date = new Date(dateStr);
              if (isNaN(date.getTime())) return dateStr;
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');
              return `${yyyy}-${mm}-${dd}`;
            };
            handleFilterChange(newName, formatDate(val));
          }}
        />
      );

    default:
      return null;
  }
};

export default RenderFilterField;
