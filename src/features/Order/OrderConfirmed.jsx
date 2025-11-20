import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';
import { selectAllOrders } from "../Slices/OrdersSlice";
import { CheckCircle, Package, Calendar, CreditCard, MapPin, ArrowLeft } from 'lucide-react';
import Loader from '../../components/Loader/Loader';

function OrderConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useSelector(selectAllOrders);
  
  const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
  
  useEffect(() => {
    document.title = "Order Confirmed - Clothing Store";
    
    if (!latestOrder) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [latestOrder, navigate]);

  if (!latestOrder) {
    return <Loader fullScreen text="Loading order details..." />;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ padding: '2rem 1rem' }}>
      <div className="max-w mx-auto" style={{ marginBottom: '0' }}>
        
        {/* Success Header */}
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full"
            style={{ marginBottom: '1rem' }}
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ marginBottom: '0.5rem' }}
          >
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden" style={{ marginBottom: '1.5rem' }}>
          
          {/* Order Header */}
          <div className="bg-green-50 border-b border-green-200" style={{ padding: '1.5rem' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900" style={{ marginBottom: '0.25rem' }}>
                  Order Details
                </h2>
                <p className="text-green-700 font-medium">Order ID: {latestOrder.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium text-gray-900">{formatDate(latestOrder.orderDate)}</p>
              </div>
            </div>
          </div>

          {/* Order Content */}
          <div style={{ padding: '1.5rem' }}>
            
            {/* Shipping Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                <MapPin className="w-5 h-5" />
                Shipping Information
              </h3>
              <div className="bg-gray-50 rounded-lg" style={{ padding: '1rem' }}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{latestOrder.userInfo?.name}</p>
                    <p className="text-gray-600">{latestOrder.userInfo?.email}</p>
                    <p className="text-gray-600">{latestOrder.userInfo?.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-900">{latestOrder.userInfo?.address}</p>
                    <p className="text-gray-600">
                      {[latestOrder.userInfo?.city, latestOrder.userInfo?.state, latestOrder.userInfo?.pincode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                <Package className="w-5 h-5" />
                Items Ordered
              </h3>
              <div className="space-y-4">
                {latestOrder.orderInfo?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border border-gray-200 rounded-lg"
                    style={{ padding: '1rem' }}
                  >
                    <img
  src={item.img}
  alt={item.name}
  className="rounded border bg-white"
  style={{
    width: "90px",
    height: "90px",
    objectFit: "contain",
    padding: "4px",
  }}
/>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200" style={{ paddingTop: '1.5rem' }}>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                <CreditCard className="w-5 h-5" />
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-lg" style={{ padding: '1rem' }}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{latestOrder.orderInfo?.totalItems}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-300" style={{ paddingTop: '0.5rem' }}>
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{latestOrder.orderInfo?.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-blue-50 rounded-lg border border-blue-200" style={{ marginTop: '1.5rem', padding: '1rem' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Order Status</span>
              </div>
              <p className="text-blue-800">
                <span className="inline-block bg-blue-100 text-blue-800 rounded-full text-sm font-medium" style={{ padding: '0.25rem 0.75rem' }}>
                  {latestOrder.status || 'Confirmed'}
                </span>
              </p>
              <p className="text-sm text-blue-700" style={{ marginTop: '0.5rem' }}>
                You will receive an email confirmation shortly. We'll notify you when your order ships.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/ProductsList')}
            className="border-2 border-black text-black bg-white rounded-lg hover:bg-black hover:text-white transition-colors"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmed;
