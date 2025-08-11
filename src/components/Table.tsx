import { HiChevronUpDown } from 'react-icons/hi2';
import { TableProps } from './types';
import { CiCirclePlus } from 'react-icons/ci';
import { IoIosArrowUp } from 'react-icons/io';

const Table = ({
  columns,
  data,
  loading,
  error,
  onSort,
  expandedRowId,
  setExpandedRowId,
  childData,
  loadingRowId,
  isExpander,
  childColumns, // <-- new
}: TableProps & { childColumns?: any[] }) => {
  const getValueByPath = (obj: any, path: string): any =>{
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj);
  }

  return (
    <div className="overflow-auto ml-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-primary-100">
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
              <>
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
                          {isExpander && colIndex === 0 && (
                            <button
                              onClick={() => setExpandedRowId(index, item)}
                              disabled={loadingRowId !== null}
                              className="text-primary-500 text-2xl disabled:text-neutral-400"
                            >
                              {loadingRowId === index ? (
                                <div className="relative w-6 h-6">
                                  <span className="w-6 h-6 absolute inset-0 rounded-full border-[3px] border-current border-t-transparent opacity-60 animate-spin"></span>
                                </div>
                              ) : loadingRowId === null && expandedRowId === index ? (
                                <IoIosArrowUp size={26} />
                              ) : (
                                <CiCirclePlus size={26} />
                              )}
                            </button>
                          )}
                          {column.render(item, index)}
                        </td>
                      ) : (
                        <td key={colIndex} className="p-2.5">
                          <div className="flex items-center flex-nowrap gap-1">
                            {isExpander && colIndex === 0 && (
                              <button
                                onClick={() => setExpandedRowId(index, item)}
                                disabled={loadingRowId !== null}
                                className="text-primary-500 text-2xl disabled:text-neutral-400"
                              >
                                {loadingRowId === index ? (
                                  <div className="relative w-6 h-6">
                                    <span className="w-6 h-6 absolute inset-0 rounded-full border-[3px] border-current border-t-transparent opacity-60 animate-spin"></span>
                                  </div>
                                ) : loadingRowId === null && expandedRowId === index ? (
                                  <IoIosArrowUp size={26} />
                                ) : (
                                  <CiCirclePlus size={26} />
                                )}
                              </button>
                            )}
                            {getValueByPath(item, column.key) !== undefined ? (
                              <span className="text-nowrap">
                                {getValueByPath(item, column.key)}
                              </span>
                            ) : (
                              <span className="text-nowrap text-gray-500">غير متوفر</span>
                            )}
                          </div>
                        </td>
                      )
                    )}
                </tr>
                {expandedRowId === index && loadingRowId === null && isExpander && (
                  <>
                    {(childData.length > 0 ? childData : []).map((childItem, childIndex) => (
                      <tr key={`${index}-${childIndex}`} className="bg-primary-50">
                        {(childColumns || columns).map((column, colIndex) => (
                          <td key={colIndex} className="p-2.5">
                            {column.render
                              ? column.render(childItem, childIndex)
                              : getValueByPath(childItem, column.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {childData.length === 0 && (
                      <tr>
                        <td
                          colSpan={(childColumns || columns).length}
                          className="text-center py-4 text-gray-500"
                        >
                          لا توجد بيانات
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
