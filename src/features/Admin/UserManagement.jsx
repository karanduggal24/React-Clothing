import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Users, Shield, User, Mail, Phone, Calendar, RefreshCw, Trash2 } from 'lucide-react';

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
      const response = await fetch('http://127.0.0.1:8000/auth/users', {
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
      const response = await fetch(`http://127.0.0.1:8000/auth/users/${userId}/role?role=${newRole}`, {
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
      const response = await fetch(`http://127.0.0.1:8000/auth/users/${userId}`, {
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ padding: '40px 20px' }}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
          <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '20px' }}>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-black">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '20px' }}>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-gray-600 text-sm">Admins</p>
                <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '20px' }}>
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-gray-600 text-sm">Regular Users</p>
                <p className="text-2xl font-bold text-black">{users.filter(u => u.role === 'user').length}</p>
              </div>
            </div>
          </div>
        </div>

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
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td style={{ padding: '16px' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                      style={{padding:"4px"}}
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRoleChange(user.id, user.role)}
                          disabled={updatingUserId === user.id || user.id === currentUser?.id}
                          style={{padding:"8px 12px"}}
                          className={`rounded-lg text-sm font-medium transition ${
                            user.role === 'admin' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {updatingUserId === user.id ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              Updating...
                            </span>
                          ) : (
                            user.role === 'admin' ? 'Demote' : 'Promote'
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          disabled={deletingUserId === user.id || user.id === currentUser?.id}
                          style={{padding:"8px 12px"}}
                          className="rounded-lg text-sm font-medium transition bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          title={user.id === currentUser?.id ? "Cannot delete yourself" : "Delete user"}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ padding: '20px' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" style={{ padding: '24px' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg" style={{ padding: '16px', marginBottom: '20px' }}>
              <p className="text-gray-700" style={{ marginBottom: '8px' }}>
                Are you sure you want to delete this user?
              </p>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{deleteConfirmModal.user?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ marginTop: '4px' }}>
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{deleteConfirmModal.user?.email}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deletingUserId !== null}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingUserId !== null}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingUserId !== null ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </span>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
