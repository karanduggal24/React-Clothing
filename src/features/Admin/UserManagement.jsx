import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Users, RefreshCw } from 'lucide-react';
import UserStatsCards from './UserStatsCards';
import UserTableRow from './UserTableRow';
import DeleteUserModal from './DeleteUserModal';
import Loader from '../../components/Loader/Loader';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ show: false, user: null });
  const { token, user: currentUser } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setUpdatingUserId(userId);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/auth/users/${userId}/role?role=${newRole}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
      console.error(error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteConfirmModal({ show: true, user });
  };

  const handleDeleteConfirm = async () => {
    const userId = deleteConfirmModal.user.id;
    setDeletingUserId(userId);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
      setDeleteConfirmModal({ show: false, user: null });
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmModal({ show: false, user: null });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loader fullScreen text="Loading users..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ padding: '0 20px 40px 20px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-black" />
              <div>
                <h1 className="text-3xl font-bold text-black">User Management</h1>
                <p className="text-gray-600" style={{ marginTop: '4px' }}>
                  Manage user roles and permissions
                </p>
              </div>
            </div>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              style={{paddingBottom:"4px", paddingLeft:"4px",paddingTop:"4px",paddingRight:"4px"}}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <UserStatsCards users={users} />

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-semibold text-gray-700" style={{ padding: '16px' }}>User</th>
                  <th className="text-left text-sm font-semibold text-gray-700" style={{ padding: '16px' }}>Contact</th>
                  <th className="text-left text-sm font-semibold text-gray-700" style={{ padding: '16px' }}>Role</th>
                  <th className="text-left text-sm font-semibold text-gray-700" style={{ padding: '16px' }}>Status</th>
                  <th className="text-left text-sm font-semibold text-gray-700" style={{ padding: '16px' }}>Joined</th>
                  <th className="text-left text-sm font-semibold text-gray-700" style={{ padding: '16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    currentUser={currentUser}
                    updatingUserId={updatingUserId}
                    deletingUserId={deletingUserId}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDeleteClick}
                    formatDate={formatDate}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center" style={{ padding: '40px' }}>
              <Users className="w-12 h-12 text-gray-400 mx-auto" style={{ marginBottom: '16px' }} />
              <p className="text-gray-600">No users found</p>
            </div>
          )}
        </div>
      </div>

      <DeleteUserModal
        show={deleteConfirmModal.show}
        user={deleteConfirmModal.user}
        deleting={deletingUserId !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default UserManagement;
