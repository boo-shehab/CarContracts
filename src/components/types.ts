import { TableColumn } from './Form/types';

export interface TableContainerProps {
  columns: TableColumn[];
  apiUrl: string;
  refresh?: boolean;
  isExpander?: boolean;
  isThereFilters?: boolean;
  headerActions?: React.ReactNode;
}

export interface TableProps {
  columns: any[];
  data: any[];
  loading: boolean;
  error?: string | null;
  onSort?: (columnKey: string) => void;
  expandedRowId?: number | string | null;
  setExpandedRowId?: (rowId: number | string, rowData: any) => void;
  childData?: any[];
  loadingRowId?: number | string | null;
  isExpander?: boolean;
  childColumns?: any[];
}
