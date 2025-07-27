import { useState } from 'react';
import { TableColumn } from '../components/Form/types';
import TableContainer from '../components/TableContainer';
import { LiaEditSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';
import AddUserModal from '../components/Users/AddUserModal';
import { useSelector } from 'react-redux';
import DeleteModal from '../components/DeleteModal';

function Users() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState<any>(null);

  const companyUserId = useSelector((state: any) => state.auth.companyUserId);

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

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
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <RiDeleteBinLine
            className="cursor-pointer text-red-600"
            onClick={() => {
              setSelectedUser(row);
              setDeleteModalOpen(true);
            }}
          />
          <LiaEditSolid
            className="cursor-pointer"
            onClick={() => {
              setEditUserData(row);
              setEditModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

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
      <AddUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          toggleRefresh();
          setEditModalOpen(false);
        }}
        initialData={editUserData}
        isEdit={true}
      />
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
          toggleRefresh();
        }}
        title="تأكيد الحذف"
        description={`هل أنت متأكد أنك تريد حذف المستخدم ${selectedUser?.fullName || ''}؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={false}
        apiEndpoint={
          selectedUser
            ? `/companies/${companyUserId}/users/${selectedUser.id}`
            : undefined}
      />
    </div>
  );
}

export default Users;
