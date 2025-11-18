import { X } from 'lucide-react';

function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        style={{ margin: 0, padding: 0 }}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fadeInUp" style={{ margin: '0', padding: '0' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200" style={{ padding: '20px', margin: 0 }}>
          <h3 className="text-xl font-semibold text-gray-900" style={{ margin: 0, padding: 0 }}>Confirm Delete</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={loading}
            style={{ margin: 0, padding: 0 }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', margin: 0 }}>
          <div className="flex items-start gap-4" style={{ margin: 0, padding: 0 }}>
            <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center" style={{ margin: 0, padding: 0 }}>
              <svg 
                className="w-6 h-6 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ margin: 0, padding: 0 }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <div className="flex-1" style={{ margin: 0, padding: 0 }}>
              <p className="text-gray-700" style={{ marginBottom: '8px', marginTop: 0, padding: 0 }}>
                Are you sure you want to delete this product?
              </p>
              {productName && (
                <p className="text-sm font-medium text-gray-900 bg-gray-50 rounded" style={{ padding: '8px', margin: 0 }}>
                  {productName}
                </p>
              )}
              <p className="text-sm text-red-600" style={{ marginTop: '12px', padding: 0 }}>
                This action cannot be undone. The product will be permanently removed from the database.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50" style={{ padding: '16px 24px', margin: 0 }}>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ margin: 0, padding: '8px 16px' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ margin: 0, padding: '8px 16px' }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" style={{ margin: 0, padding: 0 }}></div>
                Deleting...
              </>
            ) : (
              'Delete Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
