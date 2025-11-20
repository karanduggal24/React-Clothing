import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  selectAllOrders, 
  updateOrderStatus, 
  updateShippingId, 
  updateShippingCompany,
  fetchOrdersFromBackend,
  updateOrderInBackend,
  deleteOrderFromBackend
} from "../../Slices/OrdersSlice";
import { toast } from "react-toastify";
import { RefreshCw } from "lucide-react";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal/DeleteConfirmModal";
import OrderRow from "./OrderRow";

function OrderTable() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const loading = useSelector((state) => state.orders.loading);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [tempShippingId, setTempShippingId] = useState("");
  const [editingShippingCompany, setEditingShippingCompany] = useState(null);
  const [tempShippingCompany, setTempShippingCompany] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    document.title = "Clothing Store-Orders";
    // Fetch orders from backend on mount
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchOrdersFromBackend()).unwrap();
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Update local state
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    
    // Update backend
    try {
      await dispatch(updateOrderInBackend({ 
        orderId, 
        updates: { status: newStatus } 
      })).unwrap();
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error(`Failed to update status: ${error}`);
    }
  };

  const handleShippingIdEdit = (orderId, currentShippingId) => {
    setEditingShippingId(orderId);
    setTempShippingId(currentShippingId || "");
  };

  const handleShippingIdSave = async (orderId) => {
    // Update local state
    dispatch(updateShippingId({ orderId, shippingId: tempShippingId }));
    
    // Update backend
    try {
      await dispatch(updateOrderInBackend({ 
        orderId, 
        updates: { shipping_id: tempShippingId } 
      })).unwrap();
      toast.success('Shipping ID updated successfully');
    } catch (error) {
      toast.error(`Failed to update shipping ID: ${error}`);
    }
    
    setEditingShippingId(null);
    setTempShippingId("");
  };

  const handleShippingIdCancel = () => {
    setEditingShippingId(null);
    setTempShippingId("");
  };

  const handleShippingCompanyEdit = (orderId, currentShippingCompany) => {
    setEditingShippingCompany(orderId);
    setTempShippingCompany(currentShippingCompany || "");
  };

  const handleShippingCompanySave = async (orderId) => {
    // Update local state
    dispatch(updateShippingCompany({ orderId, shippingCompany: tempShippingCompany }));
    
    // Update backend
    try {
      await dispatch(updateOrderInBackend({ 
        orderId, 
        updates: { shipping_company: tempShippingCompany } 
      })).unwrap();
      toast.success('Shipping company updated successfully');
    } catch (error) {
      toast.error(`Failed to update shipping company: ${error}`);
    }
    
    setEditingShippingCompany(null);
    setTempShippingCompany("");
  };
  
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    
    try {
      await dispatch(deleteOrderFromBackend(orderToDelete.id)).unwrap();
      toast.success('Order deleted successfully');
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete order: ${error}`);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const handleShippingCompanyCancel = () => {
    setEditingShippingCompany(null);
    setTempShippingCompany("");
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 animate-fadeInUp"
      style={{ padding: "40px" }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: "32px" }}>
        <h3 className="text-2xl font-light">
          Successful Orders
        </h3>
        <button
  onClick={handleRefresh}
  disabled={refreshing || loading}
  className="flex items-center gap-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  style={{
    paddingLeft: "1rem",   // px-4
    paddingRight: "1rem",
    paddingTop: "0.5rem",  // py-2
    paddingBottom: "0.5rem"
  }}
>
  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
  {refreshing ? 'Refreshing...' : 'Refresh Orders'}
</button>

      </div>

        {orders.length > 0 ? (
          <div
            className="overflow-x-auto border border-gray-200 rounded-md"
            style={{ marginBottom: "0px" }}
          >
            <table className="w-full border-collapse bg-white text-left">
              <thead className="bg-green-100 border-b-2 border-green-600">
                <tr>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Order ID
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Customer Name
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Email
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Phone Number
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Address
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Items Ordered
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Total Items
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Total Price
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Order Date
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Status
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Shipping ID
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest border-r border-gray-200"
                    style={{ padding: "20px" }}
                  >
                    Shipping Company
                  </th>
                  <th
                    className="font-semibold text-sm uppercase tracking-widest"
                    style={{ padding: "20px" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    expandedOrders={expandedOrders}
                    editingShippingId={editingShippingId}
                    tempShippingId={tempShippingId}
                    editingShippingCompany={editingShippingCompany}
                    tempShippingCompany={tempShippingCompany}
                    onToggleExpand={toggleOrderExpansion}
                    onStatusChange={handleStatusChange}
                    onShippingIdEdit={handleShippingIdEdit}
                    onShippingIdSave={handleShippingIdSave}
                    onShippingIdCancel={handleShippingIdCancel}
                    onShippingCompanyEdit={handleShippingCompanyEdit}
                    onShippingCompanySave={handleShippingCompanySave}
                    onShippingCompanyCancel={handleShippingCompanyCancel}
                    onDelete={handleDeleteClick}
                    setTempShippingId={setTempShippingId}
                    setTempShippingCompany={setTempShippingCompany}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p
            className="text-center text-gray-500 text-lg font-light border-2 border-dashed border-gray-300 rounded-md bg-gray-50"
            style={{
              padding: "40px 0px",
            }}
          >
            No orders yet. Orders will appear here when customers complete purchases.
          </p>
        )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={orderToDelete ? `Order ${orderToDelete.id}` : ''}
        loading={loading}
        type="order"
      />
    </div>
  );
}

export default OrderTable;