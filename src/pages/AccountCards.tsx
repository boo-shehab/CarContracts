import ArrowRise from '../assets/icons/ArrowRise';
import TrendingUp from '../assets/icons/TrendingUp';
import TableContainer from '../components/TableContainer';
import { TableColumn } from '../components/Form/types';
import { useState } from 'react';
import AddCompanyModal from '../components/Company/AddCompanyModal';
import { Link } from 'react-router-dom';

const columns: TableColumn[] = [
  {
    title: 'رقم الشركة',
    key: 'id',
    sortable: true,
  },
  {
    title: 'تاريخ الاشتراك',
    key: 'subscriptionDate',
    sortable: true,
    render: (row: any) => (
      <span className="text-lg font-normal">
        {new Date(row.subscriptionDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: 'تاريخ الانتهاء',
    key: 'expirationDate',
    sortable: true,
    render: (row: any) => (
      <span className="text-lg font-normal">
        {new Date(row.expirationDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: 'اسم صاحب الشركة',
    key: 'ownerName',
    sortable: true,
  },
  {
    title: 'رقم صاحب الشركة',
    key: 'ownerContact',
    filterType: 'text',
    sortable: true,
  },
  {
    title: 'اسم الشركة',
    key: 'companyName',
    sortable: true,
  },
  {
    title: 'عدد المستخدمين',
    key: 'userCount',
    sortable: true,
  },
  {
    title: 'تاريخ الاشتراك',
    key: 'subscriptionDate',
    isVisible: false,
    isFilterable: true,
    filterType: 'startEndDate',
  },
  {
    title: 'تاريخ الانتهاء',
    key: 'expirationDate',
    isVisible: false,
    isFilterable: true,
    filterType: 'startEndDate',
  },
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
