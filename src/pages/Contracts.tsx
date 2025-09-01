import { useEffect, useState } from 'react';
import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import { RiDeleteBinLine } from 'react-icons/ri';
import DeleteModal from '../components/DeleteModal';
import { Link, useNavigate } from 'react-router-dom';
import { hasPermission } from '../utilities/permissions';
import { ALL_PERMISSIONS } from '../utilities/allPermissions';
import { toast } from 'react-toastify';


function Contracts() {
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
  
  const toggleRefresh = () => {
    setRefresh(!refresh);
  };
  const columns: TableColumn[] = [
    {
      title: 'رقم العقد',
      key: 'id',
      sortable: true,
    },
    {
      title: 'تاريخ العقد',
      key: 'contractDate',
      sortable: true,
      render: (row: any) => (
        <span className="text-lg font-normal">
          {new Date(row.contractDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'اسم البائع',
      key: 'seller.fullName',
      paramKey: 'SellerName',
      isFilterable: true,
      filterType: 'text',
      sortable: false,
    },
    {
      title: 'رقم البائع',
      key: 'seller.phone',
      paramKey: 'SellerPhone',
      sortable: false,
      isFilterable: true,
      filterType: 'text',
    },
    {
      title: 'اسم المشتري',
      key: 'buyer.fullName',
      paramKey: 'BuyerName',
      isFilterable: true,
      filterType: 'text',
      sortable: false,
    },
    {
      title: 'رقم المشتري',
      key: 'buyer.phone',
      paramKey: 'BuyerPhone',
      isFilterable: true,
      filterType: 'text',
      sortable: false,
    },
    {
      title: 'نوع السيارة',
      key: 'car.model',
      paramKey: 'carType',
      isFilterable: true,
      filterType: 'text',
      sortable: false,
    },
    {
      title: 'رقم السيارة',
      key: 'car.plateNumber',
      paramKey: 'carNumber',
      isFilterable: true,
      filterType: 'text',
      sortable: false,
    },
    {
      title: 'المبلغ المدفوع',
      key: 'paymentPlan.paidAmount',
      sortable: false,
      isFilterable: false,
    },
    {
      title: 'طريقة الدفع',
      key: 'paymentPlan.paymentType',
      paramKey: 'TypePayment',
      sortable: false,
      render: (row: any) => (
        <span className="text-lg font-normal">
          {row?.paymentPlan?.paymentType === 'CASH' ? 'نقد' : 'تقسيط'}
        </span>
      ),
    },
    {
      title: 'حالة الدفع',
      key: 'paymentPlan.status',
      paramKey: 'StatusPayment',
      sortable: true,
      isFilterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'مكتمل', value: 'COMPLETED' },
        { label: 'غير مكتمل', value: 'PENDING' },
      ],
      render: (row: any) => (
        <span className="text-lg font-normal">
          {row?.paymentPlan?.status === 'COMPLETED' ? 'مكتمل' : 'غير مكتمل'}
        </span>
      ),
    },
    {
      title: 'الاجرائات',
      key: 'procedures',
       
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {hasPermission(ALL_PERMISSIONS.DELETE_CONTRACT) && (
            <RiDeleteBinLine
              className="cursor-pointer text-red-600"
              onClick={() => {
                setSelectedContract(row);
                setDeleteModalOpen(true);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if(!hasPermission(ALL_PERMISSIONS.GET_CONTRACT)){
      toast.error("ليس لديك إذن لعرض العقود");
      navigate(-1);
    }
  }, []);
  return (
    <div>
      <TableContainer 
        columns={columns} 
        apiUrl="/contracts"
        refresh={refresh}
        headerActions={
          <>
            {hasPermission(ALL_PERMISSIONS.ADD_CONTRACT) && (
              <Link
                to={'/new-contract'}
                className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal w-full md:w-auto"
              >
                + اضافة عقد
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
          setSelectedContract(null);
          toggleRefresh();
        }}
        title="تأكيد الحذف"
        description={`هل أنت متأكد أنك تريد حذف العقد المرقم ${
          selectedContract?.id || ''
        }؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={false}
        apiEndpoint={selectedContract ? `/contracts/${selectedContract.id}` : undefined}
      />
    </div>
  );
}

export default Contracts;
