import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header2 from "./Header2";
import {
  Truck,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  User,
  AlertCircle,
  Utensils,
} from "lucide-react";

const DeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "John Doe",
      available: true,
      position: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: 2,
      name: "Jane Smith",
      available: true,
      position: { lat: 40.7282, lng: -73.987 },
    },
    {
      id: 3,
      name: "Mike Johnson",
      available: true,
      position: { lat: 40.735, lng: -74.0 },
    },
  ]);
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "Alice Brown",
      address: "123 Main St, Apt 4B",
      position: { lat: 40.715, lng: -74.008 },
      status: "pending",
      items: 3,
      restaurant: "Tasty Bites",
      createdAt: "10:00 AM",
    },
    {
      id: 2,
      customer: "Bob Wilson",
      address: "456 Oak Ave",
      position: { lat: 40.72, lng: -73.99 },
      status: "pending",
      items: 2,
      restaurant: "Pizza Palace",
      createdAt: "10:15 AM",
    },
  ]);
  const [tracking, setTracking] = useState({});

  // Calculate distance between two points
  const calculateDistance = (point1, point2) => {
    return (
      Math.sqrt(
        Math.pow(point1.lat - point2.lat, 2) +
          Math.pow(point1.lng - point2.lng, 2)
      ) * 100
    ); // Simplified distance in miles
  };

  // Auto-assign drivers to pending orders
  useEffect(() => {
    const assignDrivers = () => {
      setOrders((prevOrders) => {
        return prevOrders.map((order) => {
          if (order.status === "pending" && !order.driverId) {
            const availableDriver = drivers
              .filter((d) => d.available)
              .sort(
                (a, b) =>
                  calculateDistance(a.position, order.position) -
                  calculateDistance(b.position, order.position)
              )[0];

            if (
              availableDriver &&
              calculateDistance(availableDriver.position, order.position) < 5
            ) {
              setDrivers((prevDrivers) =>
                prevDrivers.map((d) =>
                  d.id === availableDriver.id ? { ...d, available: false } : d
                )
              );
              return {
                ...order,
                driverId: availableDriver.id,
                driverName: availableDriver.name,
                estimatedDelivery: "15 min",
              };
            }
          }
          return order;
        });
      });
    };

    const interval = setInterval(assignDrivers, 5000);
    return () => clearInterval(interval);
  }, [drivers]);

  // Simulate real-time tracking
  useEffect(() => {
    const updateTracking = () => {
      setTracking((prev) => {
        const newTracking = { ...prev };
        orders.forEach((order) => {
          if (order.status === "out for delivery" && order.driverId) {
            newTracking[order.id] = {
              position: {
                lat: order.position.lat + (Math.random() - 0.5) * 0.001,
                lng: order.position.lng + (Math.random() - 0.5) * 0.001,
              },
              updatedAt: new Date().toLocaleTimeString(),
            };
          }
        });
        return newTracking;
      });
    };

    const interval = setInterval(updateTracking, 3000);
    return () => clearInterval(interval);
  }, [orders]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus };
          if (newStatus === "delivered") {
            setDrivers((prevDrivers) =>
              prevDrivers.map((d) =>
                d.id === order.driverId ? { ...d, available: true } : d
              )
            );
          }
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const renderOrderCard = (order) => {
    const statusConfig = {
      pending: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        nextStatus: "preparing",
        action: "Prepare Order",
        icon: Clock,
      },
      preparing: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        nextStatus: "confirmed",
        action: "Confirm Order",
        icon: Utensils,
      },
      confirmed: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        nextStatus: "out for delivery",
        action: "Mark Out for Delivery",
        icon: Package,
      },
      "out for delivery": {
        bg: "bg-purple-100",
        text: "text-purple-800",
        nextStatus: "delivered",
        action: "Mark Delivered",
        icon: Truck,
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[order.status];
    const Icon = config.icon;

    return (
      <div key={order.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between mb-3">
          <span className="font-medium text-lg">{order.address}</span>
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center">
            <User size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{order.customer}</span>
          </div>
          <div className="flex items-center">
            <Utensils size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{order.restaurant}</span>
          </div>
          <div className="flex items-center">
            <Package size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{order.items} items</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{order.createdAt}</span>
          </div>
          {order.driverName && (
            <div className="flex items-center">
              <Truck size={16} className="mr-2 text-gray-500" />
              <span className="text-sm">{order.driverName}</span>
            </div>
          )}
          {tracking[order.id] && (
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-gray-500" />
              <span className="text-sm">
                Last updated: {tracking[order.id].updatedAt}
              </span>
            </div>
          )}
        </div>

        {order.status !== "delivered" && (
          <button
            onClick={() => updateOrderStatus(order.id, config.nextStatus)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md flex items-center justify-center"
          >
            <Icon size={18} className="mr-2" />
            {config.action}
          </button>
        )}

        {order.status === "delivered" && (
          <div className="text-sm text-gray-600 flex items-center">
            <CheckCircle size={16} className="mr-2 text-green-500" />
            Delivered at: {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>
    );
  };

  const renderOrderList = () => {
    const filteredOrders = orders.filter((order) => order.status === activeTab);
    return filteredOrders.length > 0 ? (
      filteredOrders.map((order) => renderOrderCard(order))
    ) : (
      <div className="text-center py-16">
        <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-700">
          No {activeTab} Orders
        </h3>
        <p className="text-gray-500">Check other tabs for orders</p>
      </div>
    );
  };

  const tabs = [
    "pending",
    "preparing",
    "confirmed",
    "out for delivery",
    "delivered",
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Header2 />
      </div>
      <div className="container mx-auto px-4 flex-grow pb-24">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Delivery Management Dashboard
            </h1>
            <div className="flex items-center">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                Active
              </div>
              <p className="text-gray-600">Managing delivery operations</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-5 gap-4">
              {tabs.map((tab) => (
                <div key={tab} className="bg-white rounded-lg p-4 shadow-md">
                  <p className="text-gray-500 text-sm">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </p>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === tab).length}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 font-medium ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="order-list">{renderOrderList()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DeliveryDashboard;
