import { useEffect, useState } from 'react';
import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import axios from '../services/axios';
import { toast } from 'react-toastify';
import { Dialog } from '@headlessui/react';
import { IoCloseOutline } from 'react-icons/io5';
import CustomDatePicker from '../components/Form/DateFiled/CustomDatePicker';
import { hasPermission } from '../utilities/permissions';
import { ALL_PERMISSIONS } from '../utilities/allPermissions';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentMadal';


const UpdateDatesModal = ({ isOpen, onClose, payment, onSuccess }: any) => {
  const [paymentDate, setPaymentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    if (payment) {
      setPaymentDate(payment.dueDate);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`/payment/updateInstallmentDate`, {
        installmentId: payment.id,
        dueDate: new Date(paymentDate).toISOString().split('T')[0],
      });
      toast.success('تم تحديث تاريخ الانتهاء بنجاح');
      onSuccess();
      onClose();
    } catch (err: any) {
      // handle error
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'فشل في تحديث تاريخ الانتهاء.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !payment) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white rounded-xl shadow-lg z-10 w-full max-w-lg p-6">
        <div className="flex items-center justify-between w-full gap-2 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">تأجيل الدفعة</h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-black">
            <IoCloseOutline size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <CustomDatePicker
            name="expirationDate"
            value={paymentDate}
            showQuickSelect={true}
            onChange={(e: any) => setPaymentDate(e.target.value)}
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

function Payments() {
  const [refresh, setRefresh] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleUpdateSuccess = () => {
    toggleRefresh();
  };

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

  const columns: TableColumn[] = [
    {
      title: 'اسم المشتري',
      key: 'customerName',
      sortable: true,
    },
    {
      title: 'نوع السيارة',
      key: 'carName',
      sortable: true,
    },
    {
      title: 'تاريخ',
      key: 'createdAt',
      sortable: true,
    },
    {
      title: 'المبلغ المستحق',
      key: 'totalAmount',
      sortable: true,
    },
    {
      title: 'رقم الدفعة',
      key: 'paymentNumber',
      render: (row: any) => (
        <span className="text-lg font-normal">
          {(() => {
            const elements = [];
            let futureShown = false;
            let isFirst = true;
            const cutoff = new Date();

            for (const installment of row.installments) {
              if (installment.status !== 'PENDING') continue;

              const dueDate = new Date(installment.dueDate);
              const prefix = isFirst ? '' : ','; // no comma before first one

              if (dueDate <= cutoff) {
                elements.push(
                  <span key={installment.id} className="text-error-500">
                    {prefix}
                    {installment.installmentNumber}
                  </span>
                );
                isFirst = false;
              } else if (!futureShown) {
                elements.push(
                  <span key={installment.id} className="text-primary-500">
                    {prefix}
                    {installment.installmentNumber}
                  </span>
                );
                futureShown = true;
                isFirst = false;
              }
            }

            return elements.length > 0 ? elements : 0;
          })()}
          /{row.installments.length}
        </span>
      ),
    },
    {
      title: 'الحالة',
      key: 'status',
      isFilterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'غير مدفوعة', value: 'PENDING' },
        { label: 'مدفوعة', value: 'COMPLETED' },
      ],
      render: (row: any) => (
        <span
          className={`text-lg font-normal py-1 rounded-full block text-center px-8 ${
            row.status === 'COMPLETED'
              ? 'text-success-500 bg-success-100'
              : 'text-error-500 bg-error-100'
          }`}
        >
          {row.status === 'COMPLETED' ? 'مدفوعة' : 'غير مدفوعة'}
        </span>
      ),
    },
  ];

  const childColumns: TableColumn[] = [
    {
      title: 'اسم المشتري',
      key: 'customerName',
      render: (_child: any, _childIndex: number, parent: any) => (
        <span className="text-lg font-normal">{parent?.customerName}</span>
      ),
    },
    {
      title: 'نوع السيارة',
      key: 'carName',
      render: (_child: any, _childIndex: number, parent: any) => (
        <span className="text-lg font-normal">{parent?.carName}</span>
      ),
    },
    {
      title: 'تاريخ الاستحقاق',
      key: 'dueDate',
      sortable: true,
    },
    {
      title: 'المبلغ',
      key: 'amount',
      sortable: true,
    },
    {
      title: 'رقم الدفعة',
      key: 'installmentNumber',
      sortable: true,
    },
    {
      title: 'الحالة',
      key: 'status',
      sortable: true,
      render: (row: any) => (
        <div className="flex gap-2">
          <span
            className={`text-lg font-normal py-1 flex-1 rounded-full block text-center px-8 ${
              row.status === 'PAID'
                ? 'text-success-500 bg-success-100'
                : 'text-error-500 bg-error-100'
            } ${hasPermission(ALL_PERMISSIONS.UPDATE_INSTALLMENT) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={() => {
              if (row.status === "PAID") return;
              setSelectedPayment(row);
              setIsPaymentModalOpen(true);
            }}
          >
            {row.status === 'PAID' ? 'مدفوعة' : 'غير مدفوعة'}
          </span>
          {row.status !== 'PAID' && (
            <span
              className={`text-lg font-normal py-1 rounded-full block text-center px-8 bg-warning-100 text-warning-500 ${hasPermission(ALL_PERMISSIONS.UPDATE_INSTALLMENT) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={() => {
                if (!hasPermission(ALL_PERMISSIONS.UPDATE_INSTALLMENT)) return;
                setSelectedPayment(row);
                setIsUpdateModalOpen(true);
              }}
            >
              تأجيل الدفعة
            </span>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!hasPermission(ALL_PERMISSIONS.GET_PAYMENT_PLAN)) {
      toast.error("ليس لديك إذن لعرض الدفعات");
      navigate(-1);
    }
  }, []);

  return (
    <div>
      <TableContainer
        isExpander={true}
        columns={columns}
        refresh={refresh}
        apiUrl="/contracts/payments"
        childColumns={childColumns}
        childKey="installments"
      />
      {isUpdateModalOpen && (
        <UpdateDatesModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          payment={selectedPayment}
          onSuccess={handleUpdateSuccess}
        />
      )}
      <PaymentModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={toggleRefresh}
        apiEndpoint={`/payment/${selectedPayment?.id}/updateInstallmentStatus`}
      />
    </div>
  );
}

export default Payments;
