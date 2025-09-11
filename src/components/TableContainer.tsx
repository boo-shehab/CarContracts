/* eslint-disable @typescript-eslint/no-unused-vars */
// TableContainer.tsx
import { useCallback, useEffect, useState } from 'react';
import Table from './Table';
import { CiSearch } from 'react-icons/ci';
import InputField from './Form/InputField';
import RenderFilterField from './Form/RenderFilterField';
import { TableContainerProps } from './types';
import { IoClose } from 'react-icons/io5';
import axios from '../services/axios';
import { toast } from 'react-toastify';

const TableContainer = ({
  columns,
  apiUrl,
  isExpander = false,
  isThereFilters = true,
  headerActions,
  refresh,
  childColumns,
  childKey = 'installments',
}: TableContainerProps & { childColumns?: any[]; childKey?: string }) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  // this for the search input
  // it will be used to filter the data based on the search term
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortDirection, setSortDirection] = useState<any>({
    sortBy: '',
    sortDirection: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const rowsPerPage = 10;

  const [expandedRowId, setExpandedRowId] = useState<string | number | null>(null);
  const [loadingRowId] = useState<string | number | null>(null);
  const [childData, setChildData] = useState<Record<string, any>[]>([]);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  // When expanding a row, set childData from the expanded row's childKey
  const handleExpandRow = (rowId: string | number, rowData: any) => {
    if (expandedRowId === rowId) {
      // Collapse if the same row is clicked
      setExpandedRowId(null);
      setChildData([]);
      return;
    }
    setExpandedRowId(rowId);

    setChildData(Array.isArray(rowData[childKey]) ? rowData[childKey] : []);
  };

  // Build params for filters and sorting
  const buildParams = () => {
    const params: any = {};
    Object.entries(filters).forEach(([key, value]) => {
      const column = columns.find((col) => col.key === key);
      const paramKey = column?.paramKey || key;
      params[paramKey] = value;
    });
    // Correct: always send sortBy and sortDirection as separate params
    if (sortDirection.sortBy) {
      const column = columns.find((col) => col.key === sortDirection.sortBy);
      const sortKey = column?.paramKey || sortDirection.sortBy;
      params.sortBy = sortKey;
      params.sortDirection = sortDirection.sortDirection;
    }
    if (keyword !== null && keyword !== '') {
      params.keyword = keyword;
    }
    params.page = currentPage;
    params.size = rowsPerPage;
    return params;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = buildParams();
      const response = await axios.get(apiUrl, { params });
      setData(response.data.data);
      setCurrentPage(response.data?.pagination?.currentPage || 0);
      setLastPage(response.data?.pagination?.lastPage || 1);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'فشل في جلب البيانات. يرجى المحاولة مرة أخرى.';
      toast.error(message);
      setError('فشل في جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, filters, keyword, sortDirection, currentPage, columns.length]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(handler);
  }, [keyword, filters, sortDirection, refresh, currentPage, fetchData]);

  useEffect(() => {
  setCurrentPage(0);
}, [filters, keyword, sortDirection, rowsPerPage, apiUrl]);

  useEffect(() => {
    if (expandedRowId !== null) {
      const row = data[expandedRowId as number];
      setChildData(row && Array.isArray(row[childKey]) ? row[childKey] : []);
    }
  }, [data, expandedRowId, childKey, refresh]);

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (value === null || value === '') {
        delete updated[name];
      } else {
        updated[name] = value;
      }
      return updated;
    });
  };

  const onSort = (columnKey: string) => {
    setSortDirection((prev: any) => {
      const newDirection =
        prev.sortBy === columnKey && prev.sortDirection === 'asc' ? 'desc' : 'asc';
      return { sortBy: columnKey, sortDirection: newDirection };
    });
  };

  return (
    <div className="w-full pb-4">
      {/* Top Bar */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
        <InputField
          name="keyword"
          type="text"
          value={keyword}
          placeholder="ابحث عن الشركة"
          onChange={(e) => setKeyword(e.target.value)}
          className="m-0"
          leftIcon={<CiSearch size={24} />}
        />
        {isThereFilters && (
          <button
            className={`text-primary-500 rounded-2xl py-2 px-4 border border-primary-500 text-xl font-normal w-full md:w-auto ${
              showFilters ? 'bg-primary-500 text-white' : ''
            }`}
            onClick={toggleFilters}
          >
            + اضافة فلتر
          </button>
        )}
        {headerActions && headerActions}
      </div>

      {/* Content Area */}
      <div className="flex flex-col md:flex-row w-full gap-4 mt-4 transition-all duration-500 ease-in-out">
        {/* Filters */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showFilters
              ? 'w-full md:w-[450px] h-auto opacity-100 translate-x-0'
              : 'w-0 h-0 opacity-0 translate-x-full overflow-hidden'
          }`}
        >
          <div className="flex flex-col w-full border-none mb-4 bg-white rounded-2xl p-2 shadow-[1px_2px_16px_0px_#4899EA1F]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xl font-bold">فلاتر</p>
              <button
                className="text-neutral-500 hover:text-black text-2xl font-normal"
                onClick={toggleFilters}
              >
                <IoClose size={24} />
              </button>
            </div>
            <hr className="mb-2 border-t border-neutral-500" />
            {columns
              .filter((col) => col.isFilterable)
              .map((column) => (
                <RenderFilterField
                  key={column.key}
                  column={column}
                  handleFilterChange={handleFilterChange}
                  filters={filters}
                />
              ))}
          </div>
        </div>

        {/* Table */}
        <div
          className={`flex-1 transition-all duration-500 ease-in-out ${
            showFilters ? 'w-full md:w-[calc(100%-350px)]' : 'w-full'
          }`}
        >
          <Table
            columns={columns}
            data={data}
            loading={loading}
            error={error}
            onSort={onSort}
            expandedRowId={expandedRowId}
            isExpander={isExpander}
            setExpandedRowId={(rowId, rowData) => handleExpandRow(rowId, rowData)}
            childData={childData}
            loadingRowId={loadingRowId}
            childColumns={childColumns}
          />

          {/* Pagination buttons */}
          <div className="flex items-center mt-6 gap-2">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="w-[35px] h-[35px] bg-primary-500 text-white rounded-full disabled:opacity-50"
            >
              {'<'}
            </button>

            {/* Page Numbers */}
            {Array.from({ length: 5 }, (_, i) => {
              const startPage = Math.max(0, Math.min(currentPage - 2, lastPage - 5));
              const page = startPage + i;

              if (page >= lastPage) return null;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-[35px] h-[35px] rounded-full ${
                    page === currentPage
                      ? 'bg-primary-500 text-white font-bold'
                      : 'border-1 border-neutral-400 text-neutral-500 hover:bg-gray-300'
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage - 1))}
              disabled={currentPage >= lastPage - 1}
              className="w-[35px] h-[35px] bg-primary-500 text-white rounded-full disabled:opacity-50"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableContainer;
