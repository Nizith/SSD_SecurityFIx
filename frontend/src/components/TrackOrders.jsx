import React, { useState } from "react";
import Footer from "./Footer";
import Header2 from "./Header2";
import { Package, Clock } from "lucide-react";

export default function TrackOrders() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      restaurant: "Tasty Burger",
      items: ["Cheeseburger", "Fries"],
      status: "In delivery",
      estimatedTime: "15-20 min",
    },
    {
      id: 2,
      restaurant: "Pizza Palace",
      items: ["Pepperoni Pizza", "Garlic Bread"],
      status: "Delivered",
      estimatedTime: "0 min",
    },
  ]);
  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Header2 />
      </div>
      <div className="container mx-auto px-4 flex-grow pb-24">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Orders</h2>

            {orders.length === 0 ? (
              <div className="text-center py-6">
                <Package size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No orders yet</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Food
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "In delivery"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{order.restaurant}</p>
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">Items:</span>
                      <ul className="list-disc list-inside ml-2 text-sm">
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock size={16} className="mr-1" />
                      <span>Estimated arrival: {order.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div className="mt-[100px]"> */}
        <Footer />
      {/* </div> */}
    </>
  );
}
