import React, { useEffect, useState } from 'react';
import Table from './Table';
import { CiSearch } from 'react-icons/ci';
import InputField from './Form/InputField';

interface TableColumn {
  title: string;
  key: string;
  sortable?: boolean;
  render?: (row: Record<string, any>, index: number) => React.ReactNode; // Optional render function for custom rendering
}

interface TableContainerProps {
  columns: TableColumn[];
  apiUrl: string;
  isFilterOpen?: boolean;
}

const TableContainer = ({ columns, apiUrl }: TableContainerProps) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');

  const toggleForm = () => {
    setShowFilters((prev) => !prev);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  const onSort = (columnKey: string) => {
    const sortedData = [...data].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) return -1;
      if (a[columnKey] > b[columnKey]) return 1;
      return 0;
    });
    setData(sortedData);
  };

  return (
    <div className="w-full">
      <div className="mt-4 flex items-center gap-4">
        <InputField
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          value={search}
          className="m-0"
          placeholder="ابحث عن الشركة"
          leftIcon={<CiSearch size={24} />}
        />
        <button
          className={`text-primary-500 rounded-2xl py-2.5 px-4 border-1 border-primary-500 text-2xl font-normal ${showFilters ? 'bg-primary-500 text-white' : ''}`}
          onClick={toggleForm}
        >
          + اضافة فلتر
        </button>
        <button className="bg-primary-500 rounded-2xl py-2.5 px-4 text-white text-2xl font-normal">
          + اضافة شركة
        </button>
      </div>

      <div className="flex w-full transition-all duration-500 ease-in-out gap-4 mt-4">
        <div
          className={`transition-all duration-500 ease-in-out ${
            showFilters ? 'w-[320px] opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full'
          } overflow-hidden`}
        >
          <form
            className="flex flex-col items-center justify-between w-full mb-4 bg-white rounded-2xl border p-4 shadow-[1px_2px_16px_0px_#4899EA1F]"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle search logic here
              fetchData();
              console.log('Search submitted:', search);
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-2xl mb-2"
            />
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-2xl">
              Search
            </button>
          </form>
        </div>

        <div
          className={`flex-1 transition-all duration-500 ease-in-out ${
            showFilters ? 'w-[calc(100%-320px)]' : 'w-full'
          }`}
        >
          <Table
            columns={columns}
            data={data}
            loading={loading}
            error={error}
            onSort={(columnKey) => onSort(columnKey)}
          />
        </div>
      </div>
    </div>
  );
};

export default TableContainer;
