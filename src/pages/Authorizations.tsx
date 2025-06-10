import CloningMachineIcon from '../assets/icons/CloningMachineIcon';
import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import { LiaEditSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';

const columns: TableColumn[] = [
  {
    title: 'رقم التخويل',
    key: 'id',
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
        {new Date(row.subscriptionDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: 'اسم المشتري',
    key: 'buyerName',
    sortable: true,
    isFilterable: true,
    filterType: 'text',
  },
  {
    title: 'وكيل الشركة',
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

function Authorizations() {
  return (
    <div>
      <TableContainer columns={columns} apiUrl="/authorizations" />
    </div>
  );
}

export default Authorizations;
