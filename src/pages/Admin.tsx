import ArrowRise from '../assets/icons/ArrowRise';
import TrendingUp from '../assets/icons/TrendingUp';
import TableContainer from '../components/TableContainer';
import { TableColumn } from '../components/Form/types';
import { useEffect, useState } from 'react';
import AddCompanyModal from '../components/Company/AddCompanyModal';
import axios from '../services/axios';
import { Dialog } from '@headlessui/react';
import { IoCloseOutline } from 'react-icons/io5';
import CustomDatePicker from '../components/Form/DateFiled/CustomDatePicker';
import { RiDeleteBinLine } from 'react-icons/ri';
import { LiaEditSolid } from 'react-icons/lia';
import DeleteModal from '../components/DeleteModal';

const UpdateDatesModal = ({ isOpen, onClose, company, onSuccess }: any) => {
  const [subscriptionDate, setSubscriptionDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (company) {
      setSubscriptionDate(new Date().toISOString().split('T')[0]);
      setExpirationDate(company.expirationDate);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(`/companies/${company.id}`, {
        subscriptionDate,
        expirationDate,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      // handle error
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !company) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white rounded-xl shadow-lg z-10 w-full max-w-lg p-6">
        <div className="flex items-center justify-between w-full gap-2 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">اختار نوع البطاقة</h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-black">
            <IoCloseOutline size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <CustomDatePicker
            name="subscriptionDate"
            value={subscriptionDate}
            showQuickSelect={true}
            onChange={(e: any) => setSubscriptionDate(e.target.value)}
            disabled={isLoading}
            label="تاريخ الاشتراك"
          />
          <CustomDatePicker
            name="expirationDate"
            value={expirationDate}
            showQuickSelect={true}
            onChange={(e: any) => setExpirationDate(e.target.value)}
            disabled={isLoading}
            label="تاريخ الانتهاء"
          />
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-500 text-white px-4 py-2 rounded"
            >
              {isLoading ? 'جاري التحديث...' : 'تحديث'}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showUpdateDates, setShowUpdateDates] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

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
    {
      title: 'الحالة',
      key: 'status',
      isFilterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'نشطة', value: 'ACTIVE' },
        { label: 'مقيدة', value: 'EXPIRED' },
      ],
      render: (row: any) => (
        <span
          onClick={() => {
            if (row.status === 'EXPIRED') {
              setSelectedCompany(row);
              setTimeout(() => setShowUpdateDates(true), 0);
            }
          }}
          className={`text-lg font-normal py-1 rounded-full px-8 ${
            row.status !== 'EXPIRED'
              ? 'text-success-500 bg-success-100'
              : 'text-error-500 bg-error-100 cursor-pointer'
          }`}
        >
          {row.status !== 'EXPIRED' ? 'نشطة' : 'مقيدة'}
        </span>
      ),
    },
    {
      title: 'الاجرائات',
      key: 'actions',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <RiDeleteBinLine
            className="cursor-pointer text-red-600"
            onClick={() => {
              setSelectedCompany(row);
              setDeleteModalOpen(true);
            }}
          />
          <LiaEditSolid
            className="cursor-pointer"
            onClick={() => {
              setSelectedCompany(row);
              setEditModalOpen(true);
            }}
          />
        </div>
      ),
      isFilterable: false,
      isVisible: true,
    },
  ];

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
                toggleRefresh();
                setShowModal(false);
              }}
            />
          </>
        }
      />
      {showUpdateDates && (
        <UpdateDatesModal
          isOpen={showUpdateDates}
          onClose={() => setShowUpdateDates(false)}
          company={selectedCompany}
          onSuccess={toggleRefresh}
        />
      )}

      <AddCompanyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          toggleRefresh();
          setShowModal(false);
        }}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => {
          setDeleteModalOpen(false);
          setSelectedCompany(null);
          toggleRefresh();
        }}
        title="تأكيد الحذف"
        description={`هل أنت متأكد أنك تريد حذف الشركة ${
          selectedCompany?.companyName || ''
        }؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={false}
        apiEndpoint={selectedCompany ? `/companies/${selectedCompany.id}` : undefined}
      />
    </div>
  );
};

export default Admin;
