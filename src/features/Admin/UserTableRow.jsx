import { Mail, Phone, Calendar, Shield, User, Trash2 } from 'lucide-react';

function UserTableRow({ user, currentUser, updatingUserId, deletingUserId, onRoleChange, onDelete, formatDate }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
        <span className={`inline-flex items-center gap-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`} style={{ padding: '4px 12px' }}>
          {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
          {user.role.toUpperCase()}
        </span>
      </td>
      <td style={{ padding: '16px' }}>
        <span className={`inline-flex rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} style={{ padding: '4px 12px' }}>
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
          <button onClick={() => onRoleChange(user.id, user.role)} disabled={updatingUserId === user.id || user.id === currentUser?.id} style={{ padding: '8px 12px' }} className={`rounded-lg text-sm font-medium transition ${user.role === 'admin' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {updatingUserId === user.id ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Updating...
              </span>
            ) : (
              user.role === 'admin' ? 'Demote' : 'Promote'
            )}
          </button>
          <button onClick={() => onDelete(user)} disabled={deletingUserId === user.id || user.id === currentUser?.id} style={{ padding: '8px 12px' }} className="rounded-lg text-sm font-medium transition bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" title={user.id === currentUser?.id ? "Cannot delete yourself" : "Delete user"}>
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UserTableRow;
