import { useState } from 'react';
import DeleteModal from '../components/DeleteModal';
import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';


function Authorizations() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAuthorization, setSelectedAuthorization] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);

  const toggleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const columns: TableColumn[] = [
    {
      title: 'رقم التخويل',
      key: 'authorizationNumber',
      sortable: true,
    },
    {
      title: 'تاريخ التخويل',
      key: 'authorizationDate',
      sortable: true,
      isFilterable: true,
      filterType: 'startEndDate',
      render: (row: any) => (
        <span className="text-lg font-normal">
          {new Date(row.authorizationDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'اسم المشتري',
      key: 'buyer.firstName',
      sortable: true,
      isFilterable: true,
      filterType: 'text',
      render: (row: any) => (
        <span className="text-lg font-normal">
          {`${row?.buyer?.firstName || ''} ${row?.buyer?.fatherName || ''} ${row?.buyer?.grandfatherName || ''} ${row?.buyer?.fourthName || ''} ${row?.buyer?.surname || ''}`}
        </span>
      ),
    },
    {
      title: 'وكيل الشركة',
      key: 'companyAgent',
      sortable: true,
    },
    {
      title: 'نوع السيارة',
      key: 'car.type',
      sortable: true,
      isFilterable: true,
      filterType: 'text',
    },
    {
      title: 'رقم السيارة',
      key: 'car.plateNumber',
      sortable: true,
      isFilterable: true,
      filterType: 'text',
    },
    {
      title: 'رقم الشاصي',
      key: 'car.chassisNumber',
      sortable: true,
    },
    {
      title: 'الاجرائات',
      key: 'procedures',
       
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <RiDeleteBinLine
              className="cursor-pointer text-red-600"
              onClick={() => {
                setSelectedAuthorization(row)
                setDeleteModalOpen(true);
              }}
            />
        </div>
      ),
    },
  ];
  return (
    <div>
      <TableContainer 
        columns={columns} 
        apiUrl="/authorizations"
        refresh={refresh} 
        headerActions={
          <div>
            <Link to="/new-authorization" className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal w-full md:w-auto">
              + إضافة تخويل
            </Link>
          </div>
        }
      />
      
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => {
          setDeleteModalOpen(false);
          setSelectedAuthorization(null);
          toggleRefresh();
        }}
        title="تأكيد الحذف"
        description={`هل أنت متأكد أنك تريد حذف هذا التخويل المرقم ${
          selectedAuthorization?.authorizationNumber || ''
        }؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={false}
        apiEndpoint={selectedAuthorization ? `/authorizations/${selectedAuthorization.id}` : undefined}
      />
    </div>
  );
}

export default Authorizations;
