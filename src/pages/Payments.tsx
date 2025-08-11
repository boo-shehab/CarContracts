import { useState } from 'react';
import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import axios from '../services/axios';


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
            const cutoff = new Date("2025-10-03");
  
            for (const installment of row.installments) {
              if (installment.status !== "PENDING") continue;
  
              const dueDate = new Date(installment.dueDate);
              const prefix = isFirst ? "" : ","; // no comma before first one
  
              if (dueDate <= cutoff) {
                elements.push(
                  <span key={installment.id} className="text-error-500">
                    {prefix}{installment.installmentNumber}
                  </span>
                );
                isFirst = false;
              } else if (!futureShown) {
                elements.push(
                  <span key={installment.id} className="text-primary-500">
                    {prefix}{installment.installmentNumber}
                  </span>
                );
                futureShown = true;
                isFirst = false;
              }
            }
  
            return elements;
          })()}/{row.installments.length}
        </span>
  
      ),
    },
    {
      title: 'الحالة',
      key: 'status',
      isFilterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'غير مدفوعة', value: 'UNPAID' },
        { label: 'مدفوعة', value: 'PAID' },
      ],
      render: (row: any) => (
        <span
          className={`text-lg font-normal py-1 rounded-full block text-center px-8 ${
            row.status === 'PAID'
              ? 'text-success-500 bg-success-100'
              : 'text-error-500 bg-error-100'
          }`}
        >
          {row.status === 'PAID' ? 'مدفوعة' : 'غير مدفوعة'}
        </span>
      ),
    },
  ];
  
  const childColumns: TableColumn[] = [
    {
      title: 'اسم المشترك',
      key: 'subscriberName',
      sortable: true,
      render: (row: any) => (
        <span className="text-lg font-normal">{row.id}</span>
      ),
    },
    { 
      title: 'المبلغ', 
      key: 'amount', 
      sortable: true 
    },
    { 
      title: 'تاريخ الاستحقاق', 
      key: 'dueDate', 
      sortable: true 
    },
    { 
      title: 'رقم الدفعة', 
      key: 'installmentNumber', 
      sortable: true 
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
            axios.put(`/payment/${row.id}/updateInstallmentStatus`)
            .then(() => {
              toggleRefresh();
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
