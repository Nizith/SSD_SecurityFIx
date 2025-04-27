import React, { useState } from "react";
import Footer from "./Footer";
import Header3 from "./Header3";

export default function RestaurantAdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  
  // Sample data for demonstration
  const [orders, setOrders] = useState([
    { id: 1, table: "5", items: ["Margherita Pizza", "Caesar Salad", "Coke"], status: "pending", total: 32.50 },
    { id: 2, table: "12", items: ["Pasta Carbonara", "Garlic Bread", "Tiramisu"], status: "preparing", total: 41.75 },
    { id: 3, table: "8", items: ["Burger", "Fries", "Milkshake"], status: "ready", total: 25.99 },
  ]);
  
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Margherita Pizza", category: "Main", price: 16.99, available: true },
    { id: 2, name: "Caesar Salad", category: "Starters", price: 9.50, available: true },
    { id: 3, name: "Tiramisu", category: "Desserts", price: 8.99, available: false },
    { id: 4, name: "Pasta Carbonara", category: "Main", price: 17.50, available: true },
    { id: 5, name: "Garlic Bread", category: "Sides", price: 5.99, available: true },
  ]);
  
  const [payments, setPayments] = useState([
    { id: 1, orderId: 3, amount: 25.99, method: "Credit Card", status: "completed", timestamp: "2025-04-27 12:34" },
    { id: 2, orderId: 1, amount: 32.50, method: "Cash", status: "pending", timestamp: "2025-04-27 12:45" },
  ]);
  
  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? {...order, status: newStatus} : order
    ));
  };
  
  const toggleMenuItemAvailability = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? {...item, available: !item.available} : item
    ));
  };
  
  const completePayment = (id) => {
    setPayments(payments.map(payment => 
      payment.id === id ? {...payment, status: "completed"} : payment
    ));
  };

  return (
    <>

        <div className="container mx-auto px-4 py-4">
          <Header3 />
        </div>
      
      <div className="container mx-auto px-4 flex-grow py-6 pb-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Restaurant Admin Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab("orders")} 
            className={`py-2 px-4 font-medium ${activeTab === "orders" ? "text-lime-600 border-b-2 border-lime-600" : "text-gray-500"}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab("menu")} 
            className={`py-2 px-4 font-medium ${activeTab === "menu" ? "text-lime-600 border-b-2 border-lime-600" : "text-gray-500"}`}
          >
            Menu Management
          </button>
          <button 
            onClick={() => setActiveTab("payments")} 
            className={`py-2 px-4 font-medium ${activeTab === "payments" ? "text-lime-600 border-b-2 border-lime-600" : "text-gray-500"}`}
          >
            Payments
          </button>
        </div>
        
        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Active Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Table {order.table}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <ul className="list-disc list-inside">
                          {order.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                            >
                              Start Preparing
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm"
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="text-white bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded text-sm"
                            >
                              Complete Order
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Menu Management Tab */}
        {activeTab === "menu" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Menu Items</h2>
              <button className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded">
                Add New Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menuItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => toggleMenuItemAvailability(item.id)}
                            className={`text-white px-3 py-1 rounded text-sm ${
                              item.available ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            {item.available ? 'Mark Unavailable' : 'Mark Available'}
                          </button>
                          <button className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Payment Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{payment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{payment.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${payment.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {payment.status === 'pending' && (
                          <button 
                            onClick={() => completePayment(payment.id)}
                            className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm"
                          >
                            Mark Paid
                          </button>
                        )}
                        {payment.status === 'completed' && (
                          <button className="text-white bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm">
                            View Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>     
      <Footer />
    </>
  );
}