import CloningMachineIcon from '../assets/icons/CloningMachineIcon';
import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import { LiaEditSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';

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
    isFilterable: true,
    filterType: 'startEndDate',
    render: (row: any) => (
      <span className="text-lg font-normal">
        {new Date(row.subscriptionDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: 'اسم البائع',
    key: 'sellerName',
    sortable: true,
  },
  {
    title: 'رقم البائع',
    key: 'sellerNumber',
  },
  {
    title: 'اسم المشتري',
    key: 'buyerName',
    sortable: true,
  },
  {
    title: 'رقم المشتري',
    key: 'buyerNumber',
    sortable: true,
  },
  {
    title: 'الاسم',
    key: 'name',
    isVisible: false,
    isFilterable: true,
    filterType: 'text',
  },
  {
    title: 'نوع السيارة',
    key: 'carType',
    sortable: true,
  },
  {
    title: 'رقم السيارة',
    key: 'carPlateNumber',
    sortable: true,
    isFilterable: true,
    filterType: 'text',
  },
  {
    title: 'رقم الهاتف',
    key: 'number',
    isVisible: false,
    isFilterable: true,
    filterType: 'text',
  },
  {
    title: 'المبلغ المدفوع',
    key: 'amountPaid',
    sortable: true,
    isFilterable: true,
    filterType: 'text',
  },
  {
    title: 'طريقة الدفع',
    key: 'paymentMethod',
    sortable: true,
  },
  {
    title: 'حالة الدفع',
    key: 'paymentStatus',
    sortable: true,
    isFilterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'مكتمل', value: 'paid' },
      { label: 'غير مكتمل', value: 'unpaid' },
    ],
  },
  {
    title: 'الاجرائات',
    key: 'procedures',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: (_row: any) => (
      <div className="flex items-center gap-2">
        <RiDeleteBinLine />
        <LiaEditSolid />
        <CloningMachineIcon />
      </div>
    ),
  },
];

function Contracts() {
  return (
    <div>
      <TableContainer columns={columns} apiUrl="/Contract" />
    </div>
  );
}

export default Contracts;
