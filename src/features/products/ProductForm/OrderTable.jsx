import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllOrders, deleteOrder, updateOrderStatus, updateShippingId, updateShippingCompany } from "../../Slices/OrdersSlice";

function OrderTable() {
  useEffect(() => {
    document.title = "Clothing Store-Orders";
  }, []);

  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [tempShippingId, setTempShippingId] = useState("");
  const [editingShippingCompany, setEditingShippingCompany] = useState(null);
  const [tempShippingCompany, setTempShippingCompany] = useState("");

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const handleShippingIdEdit = (orderId, currentShippingId) => {
    setEditingShippingId(orderId);
    setTempShippingId(currentShippingId || "");
  };

  const handleShippingIdSave = (orderId) => {
    dispatch(updateShippingId({ orderId, shippingId: tempShippingId }));
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

  const handleShippingCompanySave = (orderId) => {
    dispatch(updateShippingCompany({ orderId, shippingCompany: tempShippingCompany }));
    setEditingShippingCompany(null);
    setTempShippingCompany("");
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
      <h3
        className="text-2xl font-light text-center"
        style={{ marginBottom: "32px" }}
      >
        Successful Orders
      </h3>

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
                  <tr
                    key={order.id}
                    className="border-b border-gray-200 even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td style={{ padding: "16px" }} className="font-mono text-sm">
                      {order.id}
                    </td>
                    <td style={{ padding: "16px" }}>
                      {order.userInfo?.name || order.customerName || 'N/A'}
                    </td>
                    <td style={{ padding: "16px" }}>
                      {order.userInfo?.email || order.email || 'N/A'}
                    </td>
                    <td style={{ padding: "16px" }}>
                      {order.userInfo?.phone || 'N/A'}
                    </td>
                    <td style={{ padding: "16px", maxWidth: "250px" }}>
                      {order.userInfo?.address ? (
                        <div className="text-sm">
                          <div>{order.userInfo.address}</div>
                          {(order.userInfo.city || order.userInfo.state || order.userInfo.pincode) && (
                            <div className="text-gray-600 text-xs mt-1">
                              {[order.userInfo.city, order.userInfo.state, order.userInfo.pincode]
                                .filter(Boolean)
                                .join(', ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td style={{ padding: "16px", maxWidth: "300px" }}>
                      {order.orderInfo?.items && order.orderInfo.items.length > 0 ? (
                        <div>
                          <button
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 flex items-center gap-1"
                          >
                            {expandedOrders.has(order.id) ? '▼' : '▶'} 
                            {order.orderInfo.items.length} item{order.orderInfo.items.length > 1 ? 's' : ''}
                          </button>
                          
                          {expandedOrders.has(order.id) && (
                            <div className="space-y-2">
                              {order.orderInfo.items.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-2 rounded border text-xs">
                                  <div className="font-semibold text-blue-600">ID: {item.id}</div>
                                  <div className="text-gray-700">{item.name}</div>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-gray-600">Qty: {item.quantity}</span>
                                    <span className="font-medium text-green-600">₹{item.price}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No items data</span>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      {order.orderInfo?.totalItems || order.totalItems || 0}
                    </td>
                    <td style={{ padding: "16px" }}>
                      ₹{order.orderInfo?.totalPrice || order.totalPrice || 0}
                    </td>
                    <td style={{ padding: "16px" }}>
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <select
                        value={order.status || 'Confirmed'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          order.status === 'Shipped' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                      </select>
                    </td>
                    <td style={{ padding: "16px" }}>
                      {editingShippingId === order.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tempShippingId}
                            onChange={(e) => setTempShippingId(e.target.value)}
                            placeholder="Enter shipping ID"
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-32 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            onClick={() => handleShippingIdSave(order.id)}
                            className="bg-green-600 text-white rounded px-2 py-1 text-xs hover:bg-green-700 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleShippingIdCancel}
                            className="bg-gray-500 text-white rounded px-2 py-1 text-xs hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">
                            {order.shippingId || 'Not assigned'}
                          </span>
                          <button
                            onClick={() => handleShippingIdEdit(order.id, order.shippingId)}
                            className="bg-blue-600 text-white rounded px-2 py-1 text-xs hover:bg-blue-700 transition"
                          >
                            {order.shippingId ? 'Edit' : 'Add'}
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      {editingShippingCompany === order.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={tempShippingCompany}
                            onChange={(e) => setTempShippingCompany(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-32 focus:outline-none focus:border-blue-500"
                          >
                            <option value="">Select Company</option>
                            <option value="DTDC">DTDC</option>
                            <option value="Professional">Professional</option>
                            <option value="Tirpuati">Tirupati</option>
                            <option value="Blue Dart">Blue Dart</option>
                            <option value="DTDC">DTDC</option>
                            <option value="India Post">India Post</option>
                            <option value="Delhivery">Delhivery</option>
                            <option value="Ekart">Ekart</option>
                            <option value="Xpressbees">Xpressbees</option>
                          </select>
                          <button
                            onClick={() => handleShippingCompanySave(order.id)}
                            className="bg-green-600 text-white rounded px-2 py-1 text-xs hover:bg-green-700 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleShippingCompanyCancel}
                            className="bg-gray-500 text-white rounded px-2 py-1 text-xs hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {order.shippingCompany || 'Not selected'}
                          </span>
                          <button
                            onClick={() => handleShippingCompanyEdit(order.id, order.shippingCompany)}
                            className="bg-purple-600 text-white rounded px-2 py-1 text-xs hover:bg-purple-700 transition"
                          >
                            {order.shippingCompany ? 'Edit' : 'Select'}
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <button
                        onClick={() => dispatch(deleteOrder(order.id))}
                        className="border-2 border-red-600 text-red-600 bg-white rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition"
                        style={{ padding: "4px 12px" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
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
    </div>
  );
}

export default OrderTable;