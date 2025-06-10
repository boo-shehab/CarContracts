import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import { LiaEditSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';

const columns: TableColumn[] = [
  {
    title: 'رقم المستخدم',
    key: 'id',
    sortable: true,
  },
  {
    title: 'اسم المستخدم',
    key: 'username',
    sortable: true,
    isFilterable: true,
    filterType: 'text',
  },
  {
    title: 'البريد الالكتروني',
    key: 'email',
    sortable: true,
    isFilterable: true,
    filterType: 'text',
  },
  {
    title: 'رقم الهاتف',
    key: 'number',
    isFilterable: true,
    filterType: 'text',
  },
  {
    title: 'الاجرائات',
    key: 'procedures',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: (_row: any) => (
      <div className="flex items-center gap-2">
        <RiDeleteBinLine />
        <LiaEditSolid />
      </div>
    ),
  },
];

function Users() {
  return (
    <div>
      <TableContainer
        columns={columns}
        apiUrl="/users"
        // refresh={refresh}
        headerActions={
          <>
            <button
              onClick={() => {
                console.log('work');
              }}
              type="button"
              className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal w-full md:w-auto"
            >
              + اضافة مستخدم
            </button>
          </>
        }
      />
    </div>
  );
}

export default Users;
