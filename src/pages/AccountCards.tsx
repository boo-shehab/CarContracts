import TableContainer from '../components/TableContainer';
import { TableColumn } from '../components/Form/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const columns: TableColumn[] = [
  {
    title: 'رقم الحساب',
    key: 'id',
    sortable: true,
  },
  {
    title: 'اسم صاحب الحساب',
    key: 'ownerName',
    sortable: true,
  },
  {
    title: 'رقم الهاتف',
    key: 'phoneNumber',
    sortable: true,
  },
  {
    title: 'رقم الهوية الوطنية',
    key: 'nationalId',
    sortable: true,
  },
  {
    title: 'رقم السكن',
    key: 'residenceCardNo',
    filterType: 'text',
    sortable: true,
  },
  {
    title: 'السكن',
    key: 'residence',
    sortable: true,
  },
  {
    title: 'الاجرائات',
    key: 'actions',
    render(row, index) {
      return (
        <div className="flex gap-2">
          <Link
            to={`/account/${row.id}/edit`}
            className="bg-primary-500 text-white px-4 py-2 rounded"
          >
            تعديل
          </Link>
          <button
            onClick={() => {
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            حذف
          </button>
        </div>
      );
    },
  }
];

const AccountCards = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="bg-primary-25">
      <TableContainer
        columns={columns}
        apiUrl="/person"
        refresh={refresh}
        headerActions={
          <>
            <Link 
              to={'new-account'}
              className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal w-full md:w-auto"
            >
              + اضافة شخص
            </Link>
          </>
        }
      />
    </div>
  );
};

export default AccountCards;
