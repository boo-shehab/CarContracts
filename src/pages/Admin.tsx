import ArrowRise from '../assets/icons/ArrowRise';
import TrendingUp from '../assets/icons/TrendingUp';
import TableContainer from '../components/TableContainer';

const columns = [
  {
    title: 'رقم الشركة',
    key: 'companyNumber',
    sortable: true,
  },
  {
    title: 'تاريخ الاشتراك',
    key: 'subscripDae',
    sortable: true,
    render: (row: any) => (
      <span className="text-lg font-normal">{new Date(row.subscripDae).toLocaleDateString()}</span>
    ),
  },
  {
    title: 'تاريخ الانتهاء',
    key: 'endDate',
    sortable: true,
    render: (row: any) => (
      <span className="text-lg font-normal">{new Date(row.endDate).toLocaleDateString()}</span>
    ),
  },
  {
    title: 'اسم المالك',
    key: 'ownerName',
    sortable: true,
  },
  {
    title: 'رقم صاحب الشركة',
    key: 'companyNumber',
    sortable: true,
  },
  {
    title: 'اسم الشركة',
    key: 'companyName',
    sortable: true,
  },
  {
    title: 'الحالة',
    key: 'condition',
    render: (row: any) => (
      <span
        className={`text-lg font-normal ${row.condition ? 'text-success-500' : 'text-danger-500'}`}
      >
        {row.condition ? 'مفعل' : 'غير مفعل'}
      </span>
    ),
  },
];

const Admin = () => {
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
        apiUrl="https://682233a9b342dce8004d79d7.mockapi.io/users"
      />
    </div>
  );
};

export default Admin;
