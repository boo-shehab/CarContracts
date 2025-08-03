import TableContainer from '../components/TableContainer';
import { TableColumn } from '../components/Form/types';
import { useState } from 'react';
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
    actions: [
      {
        label: 'تعديل',
        type: 'edit',
        link: (row) => `/account/${row.id}/edit`,
      },
      {
        label: 'حذف',
        type: 'delete',
        apiUrl: (row) => `/person/${row.id}`,
        refreshAfterAction: true,
      },
    ],
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
