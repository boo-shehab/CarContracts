import TableContainer from '../components/TableContainer';
import { TableColumn } from '../components/Form/types';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';
import { LiaEditSolid } from 'react-icons/lia';
import DeleteModal from '../components/DeleteModal';
import { GrView } from 'react-icons/gr';
import { toast } from 'react-toastify';
import { hasPermission } from '../utilities/permissions';
import { ALL_PERMISSIONS } from '../utilities/allPermissions';

const Cars = () => {
  const [refresh, setRefresh] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const navigate = useNavigate();

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {

    if (!hasPermission(ALL_PERMISSIONS.PERSON_READ)) {
      toast.error('ليس لديك إذن لعرض هذه الصفحة');
      navigate(-1);
    }
  }, []);

  const columns: TableColumn[] = [
    {
      title: 'رقم السيارة',
      key: 'id',
      sortable: true,
    },
    {
      title: 'سنة الصنع',
      key: 'model',
      sortable: true,
    },
    {
      title: 'اللون',
      key: 'color',
      sortable: true,
    },
    {
      title: 'نوع',
      key: 'type',
      sortable: true,
    },
    {
      title: 'اسم السيارة',
      key: 'name',
      sortable: true,
    },
    {
      title: 'رقم اللوحة',
      key: 'plateNumber',
      isFilterable: true,
      filterType: 'text',
      sortable: true,
    },
    {
      title: 'رقم الشاصي',
      key: 'chassisNumber',
      isFilterable: true,
      filterType: 'text',
      sortable: true,
    },
    {
      title: 'عدد الكيلومترات',
      key: 'kilometers',
      sortable: true,
    },
    {
      title: 'عدد الاسطوانات',
      key: 'cylinderCount',
      sortable: true,
    },
    {
      title: 'عدد الركاب',
      key: 'passengerCount',
      sortable: true,
    },
    {
      title: 'نوع المحرك',
      key: 'engineType',
      sortable: true,
    },
    {
      title: 'المنشأ',
      key: 'origin',
      sortable: true,
    },
    {
      title: 'الاجرائات',
      key: 'actions',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <RiDeleteBinLine
            className="cursor-pointer text-red-600"
            onClick={() => {
              setSelectedAccount(row);
              setDeleteModalOpen(true);
            }}
          />
          <LiaEditSolid
            className="cursor-pointer"
            onClick={() => {
              navigate(`/car/${row.id}/edit`);
            }}
          />
          <Link to={`/car/${row.id}/view`} className="text-blue-600 hover:underline">
            <GrView />
          </Link>
        </div>
      ),
      isFilterable: false,
      isVisible: true,
    },
  ];
  return (
    <div className="bg-primary-25">
      <TableContainer
        columns={columns}
        apiUrl="/car"
        refresh={refresh}
        headerActions={
          <>
          {hasPermission(ALL_PERMISSIONS.CREATE_CAR) && (
            <Link
              to={'/new-car'}
              className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal w-full md:w-auto"
            >
              + اضافة سيارة 
            </Link>
          )}
          </>
        }
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => {
          setDeleteModalOpen(false);
          setSelectedAccount(null);
          toggleRefresh();
        }}
        title="تأكيد الحذف"
        description={`هل أنت متأكد أنك تريد حذف السيارة ${
          selectedAccount?.name || ''
        }؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={false}
        apiEndpoint={selectedAccount ? `/car/${selectedAccount.id}` : undefined}
      />
    </div>
  );
};

export default Cars;
