import { Package } from 'lucide-react';
import ProductForm from '../products/ProductForm/ProductForm';

function AdminProducts() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ padding: '40px 20px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-black" />
            <div>
              <h1 className="text-3xl font-bold text-black">Product Management</h1>
              <p className="text-gray-600" style={{ marginTop: '4px' }}>
                Manage your product inventory
              </p>
            </div>
          </div>
        </div>

        {/* Product Form */}
        <ProductForm />
      </div>
    </div>
  );
}

export default AdminProducts;
