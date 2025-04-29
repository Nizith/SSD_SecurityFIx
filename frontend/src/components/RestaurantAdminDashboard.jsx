import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header3 from "./Header3";

export default function RestaurantAdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("http://localhost:5000/api/order");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:4700/api/menu");
        setMenuItems(response.data);
      } catch (err) {
        setError("Failed to load menu items. Please try again later.");
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:5000/api/payments");
        setPayments(response.data);
      } catch (err) {
        setError("Failed to load payments. Please try again later.");
      }
    };

    fetchOrders();
    fetchMenuItems();
    fetchPayments();
  }, []);

  const toggleMenuItemAvailability = async (itemId) => {
    try {
      await axiosInstance.patch(`http://localhost:4700/api/menu/${itemId}/toggle-availability`);
      setMenuItems(
        menuItems.map((item) =>
          item._id === itemId ? { ...item, available: !item.available } : item
        )
      );
    } catch (err) {
      setError("Failed to update menu item availability. Please try again later.");
    }
  };

  return (
    <>
      <Header3 />
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">Restaurant Admin Dashboard</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 ${activeTab === "orders" ? "font-bold" : ""}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-2 ${activeTab === "menu" ? "font-bold" : ""}`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2 ${activeTab === "payments" ? "font-bold" : ""}`}
          >
            Payments
          </button>
        </div>

        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold">Orders</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {orders.map((order) => (
                  <li key={order._id}>
                    Order #{order._id} - Status: {order.status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "menu" && (
          <div>
            <h2 className="text-xl font-semibold">Menu Items</h2>
            <ul>
              {menuItems.map((item) => (
                <li key={item._id}>
                  {item.name} - ${item.price} - {item.available ? "Available" : "Unavailable"}
                  <button
                    onClick={() => toggleMenuItemAvailability(item._id)}
                    className="ml-2 text-blue-500"
                  >
                    Toggle Availability
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "payments" && (
          <div>
            <h2 className="text-xl font-semibold">Payments</h2>
            <ul>
              {payments.map((payment) => (
                <li key={payment._id}>
                  Payment #{payment._id} - Amount: ${payment.amount} - Status: {payment.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}