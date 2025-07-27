import { TableColumn } from "../components/Form/types";
import TableContainer from "../components/TableContainer";

const columns: TableColumn[] = [
  {
    title: 'اسم المشترك',
    key: 'id',
    sortable: true,
  },{
    title: 'نوع السيارة',
    key: 'id',
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
    sortable: true,
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
        className={`text-lg font-normal py-1 rounded-full px-8 ${row.status !== 'PAID' ? 'text-success-500 bg-success-100' : 'text-danger-500 text-danger-100'}`}
      >
        {row.status !== 'PAID' ? 'غير مدفوعة' : 'مدفوعة'}
      </span>
    ),
  },
];

function Payments() {
  
  return (
    <div>
      <TableContainer
        isMocked={false}
        isExpander={true}
        columns={columns}
        apiUrl="/payment"
      />
    </div>
  )
}

export default Payments;
