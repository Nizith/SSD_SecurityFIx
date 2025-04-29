import React, { useState, useEffect } from "react";
import Footer from "../Footer";
import Header3 from "../Header3";
import RestaurantDetails from "./RestaurantDetails";
import MenuManagement from "./MenuManagement";
import OrderManagement from "./OrderManagement";
import PaymentManagement from "./PaymentManagement";

const API_BASE_URL = "http://localhost:4700/api";

export default function RestaurantAdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      if (!userId || !token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`${API_BASE_URL}/restaurants/owner/my-restaurant`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch restaurant details");
      }

      const data = await response.json();
      setRestaurant(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-6 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Header3 />
      </div>

      <div className="container mx-auto px-4 flex-grow py-6 pb-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Restaurant Admin Dashboard</h1>

        <RestaurantDetails restaurant={restaurant} setRestaurant={setRestaurant} apiBaseUrl={API_BASE_URL} />

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

        {activeTab === "orders" && <OrderManagement restaurantId={restaurant._id} />}
        {activeTab === "menu" && <MenuManagement restaurantId={restaurant._id} apiBaseUrl={API_BASE_URL} />}
        {activeTab === "payments" && <PaymentManagement />}
      </div>
      <Footer />
    </>
  );
}