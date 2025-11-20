import { useState } from "react";

function OrderRow({ 
  order, 
  expandedOrders, 
  editingShippingId, 
  tempShippingId, 
  editingShippingCompany, 
  tempShippingCompany,
  onToggleExpand,
  onStatusChange,
  onShippingIdEdit,
  onShippingIdSave,
  onShippingIdCancel,
  onShippingCompanyEdit,
  onShippingCompanySave,
  onShippingCompanyCancel,
  onDelete,
  setTempShippingId,
  setTempShippingCompany
}) {
  const shippingCompanies = ["DTDC", "Professional", "Tirupati", "Blue Dart", "India Post", "Delhivery", "Ekart", "Xpressbees"];

  return (
    <tr className="border-b border-gray-200 even:bg-gray-50 hover:bg-gray-100 transition">
      <td style={{ padding: "16px" }} className="font-mono text-sm">{order.id}</td>
      <td style={{ padding: "16px" }}>{order.userInfo?.name || order.customerName || 'N/A'}</td>
      <td style={{ padding: "16px" }}>{order.userInfo?.email || order.email || 'N/A'}</td>
      <td style={{ padding: "16px" }}>{order.userInfo?.phone || 'N/A'}</td>
      <td style={{ padding: "16px", maxWidth: "250px" }}>
        {order.userInfo?.address ? (
          <div className="text-sm">
            <div>{order.userInfo.address}</div>
            {(order.userInfo.city || order.userInfo.state || order.userInfo.pincode) && (
              <div className="text-gray-600 text-xs" style={{ marginTop: "4px" }}>
                {[order.userInfo.city, order.userInfo.state, order.userInfo.pincode].filter(Boolean).join(', ')}
              </div>
            )}
          </div>
        ) : 'N/A'}
      </td>
      <td style={{ padding: "16px", maxWidth: "300px" }}>
        {order.orderInfo?.items && order.orderInfo.items.length > 0 ? (
          <div>
            <button onClick={() => onToggleExpand(order.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center" style={{ marginBottom: "8px", gap: "4px" }}>
              {expandedOrders.has(order.id) ? '▼' : '▶'} {order.orderInfo.items.length} item{order.orderInfo.items.length > 1 ? 's' : ''}
            </button>
            {expandedOrders.has(order.id) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {order.orderInfo.items.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded border text-xs" style={{ padding: "8px" }}>
                    <div className="font-semibold text-blue-600">ID: {item.id}</div>
                    <div className="text-gray-700">{item.name}</div>
                    <div className="flex justify-between items-center" style={{ marginTop: "4px" }}>
                      <span className="text-gray-600">Qty: {item.quantity}</span>
                      <span className="font-medium text-green-600">₹{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : <span className="text-gray-500 text-sm">No items data</span>}
      </td>
      <td style={{ padding: "16px" }}>{order.orderInfo?.totalItems || order.totalItems || 0}</td>
      <td style={{ padding: "16px" }}>₹{order.orderInfo?.totalPrice || order.totalPrice || 0}</td>
      <td style={{ padding: "16px" }}>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
      <td style={{ padding: "16px" }}>
        <select value={order.status || 'Confirmed'} onChange={(e) => onStatusChange(order.id, e.target.value)} className={`rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`} style={{ padding: "4px 8px" }}>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
        </select>
      </td>
      <td style={{ padding: "16px" }}>
        {editingShippingId === order.id ? (
          <div className="flex items-center" style={{ gap: "8px" }}>
            <input type="text" value={tempShippingId} onChange={(e) => setTempShippingId(e.target.value)} placeholder="Enter shipping ID" className="border border-gray-300 rounded text-xs w-32 focus:outline-none focus:border-blue-500" style={{ padding: "4px 8px" }} />
            <button onClick={() => onShippingIdSave(order.id)} className="bg-green-600 text-white rounded text-xs hover:bg-green-700 transition" style={{ padding: "4px 8px" }}>Save</button>
            <button onClick={onShippingIdCancel} className="bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition" style={{ padding: "4px 8px" }}>Cancel</button>
          </div>
        ) : (
          <div className="flex items-center" style={{ gap: "8px" }}>
            <span className="text-sm font-mono">{order.shippingId || 'Not assigned'}</span>
            <button onClick={() => onShippingIdEdit(order.id, order.shippingId)} className="bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition" style={{ padding: "4px 8px" }}>{order.shippingId ? 'Edit' : 'Add'}</button>
          </div>
        )}
      </td>
      <td style={{ padding: "16px" }}>
        {editingShippingCompany === order.id ? (
          <div className="flex items-center" style={{ gap: "8px" }}>
            <select value={tempShippingCompany} onChange={(e) => setTempShippingCompany(e.target.value)} className="border border-gray-300 rounded text-xs w-32 focus:outline-none focus:border-blue-500" style={{ padding: "4px 8px" }}>
              <option value="">Select Company</option>
              {shippingCompanies.map(company => <option key={company} value={company}>{company}</option>)}
            </select>
            <button onClick={() => onShippingCompanySave(order.id)} className="bg-green-600 text-white rounded text-xs hover:bg-green-700 transition" style={{ padding: "4px 8px" }}>Save</button>
            <button onClick={onShippingCompanyCancel} className="bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition" style={{ padding: "4px 8px" }}>Cancel</button>
          </div>
        ) : (
          <div className="flex items-center" style={{ gap: "8px" }}>
            <span className="text-sm">{order.shippingCompany || 'Not selected'}</span>
            <button onClick={() => onShippingCompanyEdit(order.id, order.shippingCompany)} className="bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition" style={{ padding: "4px 8px" }}>{order.shippingCompany ? 'Edit' : 'Select'}</button>
          </div>
        )}
      </td>
      <td style={{ padding: "16px", textAlign: "center" }}>
        <button onClick={() => onDelete(order)} className="border-2 border-red-600 text-red-600 bg-white rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition" style={{ padding: "4px 12px" }}>Delete</button>
      </td>
    </tr>
  );
}

export default OrderRow;
