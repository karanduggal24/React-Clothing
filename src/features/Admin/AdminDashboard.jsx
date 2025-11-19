import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: 0
  });
  const [ordersData, setOrdersData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const processOrdersData = (orders) => {
    // Group orders by date for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.order_date).toISOString().split('T')[0];
        return orderDate === dateStr;
      });

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + (o.total_price || 0), 0)
      });
    }
    return last7Days;
  };

  const processUsersData = (users) => {
    // Group users by registration date for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayUsers = users.filter(u => {
        if (!u.created_at) return false;
        const userDate = new Date(u.created_at).toISOString().split('T')[0];
        return userDate === dateStr;
      });

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: dayUsers.length,
        admins: dayUsers.filter(u => u.role === 'admin').length,
        regularUsers: dayUsers.filter(u => u.role === 'user').length
      });
    }
    return last7Days;
  };

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch products count
      const productsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/products/`);
      const products = await productsRes.json();

      // Fetch orders count
      const ordersRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/orders/`);
      const orders = await ordersRes.json();

      // Fetch users count
      const usersRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/auth/users`);
      const users = await usersRes.json();

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        recentOrders: orders.filter(o => {
          const orderDate = new Date(o.order_date);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return orderDate > dayAgo;
        }).length
      });

      // Process data for charts
      setOrdersData(processOrdersData(orders));
      setUsersData(processUsersData(users));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      link: '/admin/products'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      link: '/admin/orders'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      link: '/admin/users'
    },
    {
      title: 'Recent Orders',
      value: stats.recentOrders,
      icon: TrendingUp,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      link: '/admin/orders'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          {/* mx-auto -> marginLeft/Right: auto */}
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          ></div>
          {/* mt-4 -> marginTop: 16px */}
          <p className="text-gray-600" style={{ marginTop: '16px' }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    // p-8 -> padding: 32px
    <div style={{ padding: '32px' }}>
      {/* Header */}
      {/* mb-8 -> marginBottom: 32px */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        {/* mt-2 -> marginTop: 8px */}
        <p className="text-gray-600" style={{ marginTop: '8px' }}>
            Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      {/* gap-6 -> gap: 24px, mb-8 -> marginBottom: 32px */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" 
        style={{ gap: '24px', marginBottom: '32px' }}
      >
        {statCards.map((stat) => (
          <div
            key={stat.title}
            onClick={() => navigate(stat.link)}
            // p-6 -> padding: 24px
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            style={{ padding: '24px' }}
          >
            {/* mb-4 -> marginBottom: 16px */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            {/* mb-1 -> marginBottom: 4px */}
            <h3 className="text-gray-600 text-sm font-medium" style={{ marginBottom: '4px' }}>
                {stat.title}
            </h3>
            <p className="text-3xl font-bold text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px', marginBottom: '32px' }}>
        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '24px' }}>
          <h2 className="text-xl font-bold text-black" style={{ marginBottom: '16px' }}>
            Orders Tracking (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#000000" 
                strokeWidth={2}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Users Chart */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '24px' }}>
          <h2 className="text-xl font-bold text-black" style={{ marginBottom: '16px' }}>
            User Registrations (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="regularUsers" fill="#3b82f6" name="Regular Users" />
              <Bar dataKey="admins" fill="#10b981" name="Admins" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      {/* p-6 -> padding: 24px */}
      <div 
        className="bg-white rounded-lg shadow-md border border-gray-200" 
        style={{ padding: '24px' }}
      >
        {/* mb-4 -> marginBottom: 16px */}
        <h2 className="text-xl font-bold text-black" style={{ marginBottom: '16px' }}>
            Quick Actions
        </h2>
        {/* gap-4 -> gap: 16px */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
          <button
            onClick={() => navigate('/admin/products')}
            // gap-3 -> gap: 12px, p-4 -> padding: 16px
            className="flex items-center border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
            style={{ gap: '12px', padding: '16px' }}
          >
            <Package className="w-6 h-6 text-black" />
            <div className="text-left">
              <p className="font-medium text-black">Manage Products</p>
              <p className="text-sm text-gray-600">Add, edit, or delete products</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            // gap-3 -> gap: 12px, p-4 -> padding: 16px
            className="flex items-center border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
            style={{ gap: '12px', padding: '16px' }}
          >
            <ShoppingBag className="w-6 h-6 text-black" />
            <div className="text-left">
              <p className="font-medium text-black">View Orders</p>
              <p className="text-sm text-gray-600">Check customer orders</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            // gap-3 -> gap: 12px, p-4 -> padding: 16px
            className="flex items-center border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
            style={{ gap: '12px', padding: '16px' }}
          >
            <Users className="w-6 h-6 text-black" />
            <div className="text-left">
              <p className="font-medium text-black">Manage Users</p>
              <p className="text-sm text-gray-600">View and manage users</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;