import { HiChevronUpDown } from 'react-icons/hi2';
import { TableProps } from './types';

const Table = ({ columns, data, loading, error, onSort }: TableProps) => {
  return (
    <div className="overflow-auto ml-4">
      <table className="rounded-2xl overflow-hidden bg-primary-25 shadow-[1px_2px_16px_0px_#4899EA1F] table-auto mb-4 min-w-full">
        <thead>
          <tr className="bg-primary-100 text-right text-lg font-bold">
            {columns
              .filter((col) => col.isVisible !== false)
              .map((header, index) => (
                <th key={index} className="px-4 py-2">
                  <div
                    className="flex items-center justify-between gap-1 flex-nowrap"
                    onClick={() => header.sortable && onSort && onSort(header.key)}
                  >
                    <span className="text-nowrap">{header.title}</span>
                    {header.sortable && <HiChevronUpDown size={24} color="#4899EA" />}
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                جار التحميل...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-red-500">
                {error}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                لا توجد بيانات
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index !== data.length - 1 ? 'border-b border-neutral-100' : ''
                } text-lg font-normal text-right`}
              >
                {columns
                  .filter((col) => col.isVisible !== false)
                  .map((column, colIndex) =>
                    column.render ? (
                      <td key={colIndex} className="p-2.5">
                        {column.render(item, index)}
                      </td>
                    ) : (
                      <td key={colIndex} className="p-2.5">
                        {item[column.key]}
                      </td>
                    )
                  )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
