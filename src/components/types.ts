import { TableColumn } from './Form/types';

export interface TableContainerProps {
  columns: TableColumn[];
  apiUrl: string;
  refresh?: boolean;
  isThereFilters?: boolean;
  headerActions?: React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: Array<Record<string, any>>;
  onSort?: (columnKey: string) => void;
  loading?: boolean;
  error?: any;
}
