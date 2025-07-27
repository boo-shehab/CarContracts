import { useState } from 'react';
import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import { LiaEditSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';
import AddUserModal from '../components/Users/AddUserModal';
import { useSelector } from 'react-redux';

const columns: TableColumn[] = [
  {
    title: 'رقم المستخدم',
    key: 'id',
    sortable: true,
  },
  {
    title: 'اسم المستخدم',
    key: 'fullName',
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
    key: 'phone',
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
        <LiaEditSolid onClick={() => {
          // Handle edit user
        }} />
      </div>
    ),
  },
];

function Users() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const companyUserId = useSelector((state: any) => state.auth.companyUserId);
  

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };
  return (
    <div>
      <TableContainer
        columns={columns}
        apiUrl={`/companies/${companyUserId}/users`}
        refresh={refresh}
        headerActions={
          <>
            <button
              onClick={() => {
                setShowModal(true);
              }}
              type="button"
              className="bg-primary-500 border border-primary-500 rounded-2xl py-2 px-4 text-white text-xl font-normal w-full md:w-auto"
            >
              + اضافة مستخدم
            </button>
            <AddUserModal
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
    </div>
  );
}

export default Users;
