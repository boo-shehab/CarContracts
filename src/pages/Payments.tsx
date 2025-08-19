import { useState } from 'react';
import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import axios from '../services/axios';
import { toast } from 'react-toastify';

function Payments() {
  const [refresh, setRefresh] = useState(false);

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
        <span
          className={`text-lg font-normal py-1 rounded-full block text-center px-8 cursor-pointer ${
            row.status === 'PAID'
              ? 'text-success-500 bg-success-100'
              : 'text-error-500 bg-error-100'
          }`}
          onClick={() => {
            axios.put(`/payment/${row.id}/updateInstallmentStatus`).then(() => {
              toggleRefresh();
              toast.success('تم الدفع بنجاح');
            }).catch((error: any) => {
              const message =
                error?.response?.data?.message ||
                error?.message ||
                'فشل في تحديث حالة الدفعة.';
              toast.error(message);
            });
          }}
        >
          {row.status === 'PAID' ? 'مدفوعة' : 'غير مدفوعة'}
        </span>
      ),
    },
  ];

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
    </div>
  );
}

export default Payments;
