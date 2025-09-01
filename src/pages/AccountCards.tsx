import TableContainer from '../components/TableContainer';
import { TableColumn } from '../components/Form/types';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';
import { LiaEditSolid } from 'react-icons/lia';
import DeleteModal from '../components/DeleteModal';
import { FiPrinter } from 'react-icons/fi';
import { GrView } from 'react-icons/gr';
import { printAccountDocs } from '../utilities/printAccountDocs';
import { getAccountById } from '../services/UserService';
import { toast } from 'react-toastify';
import { hasPermission } from '../utilities/permissions';
import { ALL_PERMISSIONS } from '../utilities/allPermissions';

const AccountCards = () => {
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

  const handlePrintAccount = async (accountId: string | number) => {
    try {
      const res = await getAccountById(accountId);
      const data = res.data.data;
      let nationalIdFrontFile = '';
      let nationalIdBackFile = '';
      let residenceCardFrontFile = '';
      let residenceCardBackFile = '';
      if (Array.isArray(data.attachments)) {
        data.attachments.forEach((attachment: any) => {
          const { docType, docSide, url } = attachment;
          if (docType === 'NATIONAL_ID' && docSide === 'FRONT') {
            nationalIdFrontFile = url;
          } else if (docType === 'NATIONAL_ID' && docSide === 'BACK') {
            nationalIdBackFile = url;
          } else if (docType === 'RESIDENCE_CARD' && docSide === 'FRONT') {
            residenceCardFrontFile = url;
          } else if (docType === 'RESIDENCE_CARD' && docSide === 'BACK') {
            residenceCardBackFile = url;
          }
        });
      }
      printAccountDocs({
        nationalIdFrontFile,
        nationalIdBackFile,
        residenceCardFrontFile,
        residenceCardBackFile,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'تعذر تحميل بيانات الحساب للطباعة';
      toast.error(message);
    }
  };

  const columns: TableColumn[] = [
    {
      title: 'رقم الحساب',
      key: 'id',
      sortable: true,
    },
    {
      title: 'اسم صاحب الحساب',
      key: 'firstName',
      sortable: true,
      render: (row: any) => (
        <span className="text-lg font-normal">
          {row.firstName} {row.fatherName} {row.grandfatherName} {row.fourthName} {row.lastName}
        </span>
      ),
    },
    {
      title: 'رقم الهاتف',
      key: 'phoneNumber',
      sortable: true,
    },
    {
      title: 'رقم الهوية الوطنية',
      key: 'nationalId',
      filterType: 'text',
      isFilterable: true,
      sortable: true,
    },
    {
      title: 'رقم السكن',
      key: 'residenceCardNo',
      filterType: 'text',
      isFilterable: true,
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
              navigate(`/account-cards/${row.id}/edit`);
            }}
          />
          <Link to={`/account-cards/${row.id}/view`} className="text-blue-600 hover:underline">
            <GrView />
          </Link>
          <FiPrinter
            className="cursor-pointer text-blue-500"
            onClick={() => handlePrintAccount(row.id)}
          />
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
        apiUrl="/person"
        refresh={refresh}
        headerActions={
          <>
          {hasPermission(ALL_PERMISSIONS.PERSON_CREATE) && (
            <Link
              to={'/new-account'}
              className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal w-full md:w-auto"
            >
              + اضافة شخص
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
        description={`هل أنت متأكد أنك تريد حذف المستخدم ${
          selectedAccount?.firstName || ''
        }؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={false}
        apiEndpoint={selectedAccount ? `/person/${selectedAccount.id}` : undefined}
      />
    </div>
  );
};

export default AccountCards;
