import { User, Mail, Trash2 } from 'lucide-react';

function DeleteUserModal({ show, user, deleting, onConfirm, onCancel }) {
  if (!show) return null;

  return (
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
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ marginTop: '4px' }}>
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{user?.email}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={deleting} className="flex-1 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed" style={{ padding: '8px 16px' }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting} className="flex-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed" style={{ padding: '8px 16px' }}>
            {deleting ? (
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
  );
}

export default DeleteUserModal;
