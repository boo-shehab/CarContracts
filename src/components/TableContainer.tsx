// TableContainer.tsx
import { useCallback, useEffect, useState } from 'react';
import Table from './Table';
import { CiSearch } from 'react-icons/ci';
import InputField from './Form/InputField';
import RenderFilterField from './Form/RenderFilterField';
import { TableContainerProps } from './types';
import { IoClose } from 'react-icons/io5';
import axios from '../services/axios';

const TableContainer = ({
  columns,
  apiUrl,
  isThereFilters = true,
  headerActions,
  refresh,
}: TableContainerProps) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortDirection, setSortDirection] = useState<any>({
    sortBy: '',
    sortDirection: 'asc',
  });

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = { ...filters };
      if (searchTerm) params.searchTerm = searchTerm;
      if (sortDirection.sortBy) params.sortBy = sortDirection.sortBy;
      if (sortDirection.sortDirection && sortDirection.sortBy)
        params.sortDirection = sortDirection.sortDirection;
      const response = await axios.get(apiUrl, { params });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, filters, searchTerm, sortDirection]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, filters, fetchData]);

  useEffect(() => {
    fetchData();
  }, [sortDirection, refresh, fetchData]);

  const handleFilterChange = (name: string, value: any) => {
    console.log(`Filter changed: ${name} = ${value}`);

    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const onSort = (columnKey: string) => {
    setSortDirection((prev: any) => {
      const newDirection =
        prev.sortBy === columnKey && prev.sortDirection === 'asc' ? 'desc' : 'asc';
      return { sortBy: columnKey, sortDirection: newDirection };
    });
  };

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="mt-4 flex items-center gap-4">
        <InputField
          name="searchTerm"
          type="text"
          value={searchTerm}
          placeholder="ابحث عن الشركة"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="m-0"
          leftIcon={<CiSearch size={24} />}
        />
        {isThereFilters && (
          <button
            className={`text-primary-500 rounded-2xl py-2.5 px-4 border border-primary-500 text-2xl font-normal ${showFilters ? 'bg-primary-500 text-white' : ''}`}
            onClick={toggleFilters}
          >
            + اضافة فلتر
          </button>
        )}
        {headerActions && headerActions}
      </div>

      {/* Content Area */}
      <div className="flex w-full gap-4 mt-4 transition-all duration-500 ease-in-out">
        {/* Filters */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showFilters ? 'w-[450px] opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full'
          } `}
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
            showFilters ? 'w-[calc(100%-350px)]' : 'w-full'
          }`}
        >
          <Table columns={columns} data={data} loading={loading} error={error} onSort={onSort} />
        </div>
      </div>
    </div>
  );
};

export default TableContainer;
