import ArrowRise from '../assets/icons/ArrowRise';
import TrendingUp from '../assets/icons/TrendingUp';
import TableContainer from '../components/TableContainer';
import { TableColumn } from '../components/Form/types';
import { useState } from 'react';
import AddCompanyModal from '../components/Company/AddCompanyModal';

// GET /api/companies?searchTerm=ahmed&status=ACTIVE
//     &subscriptionDateFrom=2024-01-01
//     &subscriptionDateTo=2024-12-31
//     &expirationDateFrom=2024-01-01
//     &expirationDateTo=2024-12-31
//     &sortBy=companyName
//     &sortDirection=DESC
//     &page=0
//     &size=10

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
    title: 'الحالة',
    key: 'status',
    isFilterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'نشط', value: 'ACTIVE' },
      { label: 'مقيدة', value: 'EXPIRED' },
    ],
    render: (row: any) => (
      <span
        className={`text-lg font-normal py-1 rounded-full px-8 ${row.status !== 'EXPIRED' ? 'text-success-500 bg-success-100' : 'text-danger-500 text-danger-100'}`}
      >
        {row.status !== 'EXPIRED' ? 'نشطة' : 'مقيدة'}
      </span>
    ),
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

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };
  return (
    <div className="bg-primary-25">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4">
        <div className="bg-[linear-gradient(218deg,_#DFEDFB_32.02%,_#C8E0F9_44.63%,_#91C2F2_74.12%)] shadow-[1px_2px_16px_0px_#4899EA1F] p-4 rounded-xl flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-xl font-bold text-primary-800">عدد الشركات المضافة</div>
            <div className="text-xl font-normal text-black">20 شركة</div>

            <div className="text-xl font-medium text-success-500 flex items-center">
              <span className="ml-1">
                <ArrowRise />
              </span>{' '}
              25 شركة
            </div>

            <div className="text-2xl font-medium text-black">
              عدد المستخدمين المضافين
              <TrendingUp className="inline-block mr-1" />
            </div>
            <div className="text-primary-700 text-2xl font-medium">100</div>
          </div>
        </div>
      </div>
      <TableContainer
        columns={columns}
        apiUrl="/companies"
        refresh={refresh}
        headerActions={
          <>
            <button
              onClick={() => setShowModal(true)}
              type="button"
              className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal w-full md:w-auto"
            >
              + اضافة شركة
            </button>
            <AddCompanyModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                // refetch data
                toggleRefresh(); // Toggle the refresh state to trigger a refetch
                setShowModal(false);
              }}
            />
          </>
        }
      />
    </div>
  );
};

export default Admin;
