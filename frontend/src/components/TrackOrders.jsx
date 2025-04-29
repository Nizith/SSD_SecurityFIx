import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header2 from "./Header2";
import { Package, Clock } from "lucide-react";

export default function TrackOrders() {
  const [orders, setOrders] = useState([]);
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

    fetchOrders();
  }, []);

  return (
    <>
      <Header2 />
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">Track Orders</h1>
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order._id} className="border p-4 rounded-lg mb-4">
                <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                <p>Status: {order.status}</p>
                <p>Estimated Time: {order.estimatedTime}</p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.name} - Quantity: {item.quantity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
