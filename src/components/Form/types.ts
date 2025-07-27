export interface CustomDatePickerProps {
  label?: string;
  name: string;
  placeholder?: string;
  value: string | null;
  onChange: any;
  className?: string;
  disabled?: boolean;
  error?: string;
  showQuickSelect?: boolean;
}

export interface InputFieldProps {
  name: string;
  label?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  monyType?: string;
  placeholder?: string;
  value: string | number | undefined;
  clearable?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface RadioInputProps {
  onChange: (e: any) => void;
  label?: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  clearable?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export interface TableColumn {
  title: string;
  key: string;
  sortable?: boolean;
  isFilterable?: boolean;
  isVisible?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'startEndDate' | 'radio';
  filterOptions?: { value: string; label: string }[];
  render?: (row: Record<string, any>, index: number) => React.ReactNode;
}

export interface RenderFilterFieldProps {
  column: TableColumn;
  filters: Record<string, any>;
  handleFilterChange: (name: string, value: any) => void;
}

export interface Option {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  value: string | string[];
  error?: string;
  onChange: (e: React.ChangeEvent<{ name: string; value: any }>) => void;
  clearable?: boolean;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}
