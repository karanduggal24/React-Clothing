import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package, ShoppingBag, Users, LayoutDashboard, Home, Menu, X } from 'lucide-react';
import Header from '../../components/Header/Header';
import { useState } from 'react';

function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview'
    },
    {
      path: '/admin/products',
      icon: Package,
      label: 'Products',
      description: 'Manage inventory'
    },
    {
      path: '/admin/orders',
      icon: ShoppingBag,
      label: 'Orders',
      description: 'View orders'
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'Users',
      description: 'Manage users'
    }
  ];

  // Removed px-4, py-3, gap-3 from here
  const navLinkClass = ({ isActive }) =>
    `flex items-center rounded-lg transition-all ${
      isActive
        ? 'bg-black text-white shadow-lg'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <>
      {/* Main Navbar */}
      <Header />
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition"
        style={{ padding: '12px' }}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className={`
          w-64 bg-white border-r border-gray-200 flex flex-col
          fixed lg:sticky left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
        >
        
        {/* Sidebar Header */}
        {/* p-6 converted to padding: 24px */}
        <div 
          className="border-b border-gray-200" 
          style={{ padding: '24px' }}
        >
          {/* gap-3 converted to gap: 12px */}
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Admin Panel</h2>
              <p className="text-xs text-gray-500">Clothing Store</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {/* p-4 converted to padding: 16px */}
        <div 
          className="border-b border-gray-200 bg-gray-50" 
          style={{ padding: '16px' }}
        >
          {/* gap-3 converted to gap: 12px */}
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {/* p-4 -> padding: 16px. space-y-2 -> gap: 8px (added flex-col to support gap) */}
        <nav 
          className="flex-1 flex flex-col" 
          style={{ padding: '16px', gap: '8px' }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
              // px-4 -> 16px, py-3 -> 12px, gap-3 -> 12px
              style={{ padding: '12px 16px', gap: '12px' }}
            >
              <item.icon className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs opacity-75">{item.description}</p>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {/* p-4 converted to padding: 16px */}
        <div 
          className="border-t border-gray-200" 
          style={{ padding: '16px' }}
        >
          <button
            onClick={() => navigate('/')}
            // px-4 -> 16px, py-3 -> 12px, gap-3 -> 12px
            className="w-full flex items-center rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
            style={{ padding: '12px 16px', gap: '12px' }}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium text-sm">Back to Store</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        <Outlet />
      </main>
      </div>
    </>
  );
}

export default AdminLayout;