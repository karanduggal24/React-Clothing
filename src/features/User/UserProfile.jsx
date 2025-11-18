import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Package, Calendar, MapPin, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

function UserProfile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/orders/?customer_email=${user.email}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"
            style={{ margin: '0 auto' }}
          ></div>
          <p className="text-gray-600" style={{ marginTop: '16px' }}>
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ padding: '40px 20px' }}>
      <div className="max-w-screen" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '32px', marginBottom: '24px' }}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-black">{user?.name}</h1>
              <div className="flex flex-wrap gap-4" style={{ marginTop: '12px' }}>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{user?.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
          <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '20px' }}>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-black">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '20px' }}>
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-gray-600 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-black">
                  ₹{orders.reduce((sum, order) => sum + order.total_price, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '20px' }}>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-gray-600 text-sm">Items Ordered</p>
                <p className="text-2xl font-bold text-black">
                  {orders.reduce((sum, order) => sum + order.total_items, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 className="text-2xl font-bold text-black">Order History</h2>
            <p className="text-gray-600" style={{ marginTop: '4px' }}>
              View and track all your orders
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center" style={{ padding: '60px 20px' }}>
              <Package 
                className="w-16 h-16 text-gray-400" 
                style={{ marginBottom: '16px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} 
              />
              <h3 className="text-xl font-semibold text-gray-900" style={{ marginBottom: '8px' }}>
                No Orders Yet
              </h3>
              <p className="text-gray-600" style={{ marginBottom: '24px' }}>
                Start shopping to see your orders here
              </p>
              <a
                href="/ProductsList"
                className="inline-block bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                style={{ padding: '12px 24px' }}
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div style={{ padding: '24px' }}>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    {/* Order Header */}
                    <div
                      className="bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                      style={{ padding: '16px' }}
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-gray-900">
                              Order #{order.order_id}
                            </h3>
                            <span 
                              className={`rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                              style={{ padding: '4px 12px' }}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: '8px' }}>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.order_date)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {order.total_items} items
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              ₹{order.total_price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div>
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expanded) */}
                    {expandedOrder === order.id && (
                      <div style={{ padding: '16px' }}>
                        {/* Shipping Address */}
                        <div style={{ marginBottom: '16px' }}>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2" style={{ marginBottom: '8px' }}>
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                          </h4>
                          <div className="text-sm text-gray-600 bg-gray-50 rounded" style={{ padding: '12px' }}>
                            <p>{order.customer_name}</p>
                            <p>{order.address}</p>
                            <p>{order.city}, {order.state} - {order.pincode}</p>
                            <p>{order.country}</p>
                            <p style={{ marginTop: '4px' }}>Phone: {order.customer_phone}</p>
                          </div>
                        </div>

                        {/* Shipping Info */}
                        {(order.shipping_id || order.shipping_company) && (
                          <div style={{ marginBottom: '16px' }}>
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2" style={{ marginBottom: '8px' }}>
                              <Package className="w-4 h-4" />
                              Shipping Information
                            </h4>
                            <div className="text-sm text-gray-600 bg-gray-50 rounded" style={{ padding: '12px' }}>
                              {order.shipping_company && <p>Company: {order.shipping_company}</p>}
                              {order.shipping_id && <p>Tracking ID: {order.shipping_id}</p>}
                            </div>
                          </div>
                        )}

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900" style={{ marginBottom: '12px' }}>
                            Order Items
                          </h4>
                          <div className="space-y-3">
                            {order.order_items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 bg-gray-50 rounded" 
                                style={{ padding: '12px' }}
                              >
                                {item.img && (
                                  <img
                                    src={item.img}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-600">{item.category}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ₹{item.price} each
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Total */}
                        <div className="border-t border-gray-200" style={{ marginTop: '16px', paddingTop: '16px' }}>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total Amount</span>
                            <span className="text-xl font-bold text-black">
                              ₹{order.total_price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;