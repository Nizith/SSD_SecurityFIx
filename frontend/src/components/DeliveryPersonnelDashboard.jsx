import React, { useState } from "react";
import Footer from "./Footer";
import Header3 from "./Header3";
import { Truck, CheckCircle, Clock, Package, MapPin, User, AlertCircle } from "lucide-react";

export default function DeliveryPersonnelDashboard() {
  const [activeTab, setActiveTab] = useState("available");
  const [deliveries, setDeliveries] = useState({
    available: [
      { id: 1, address: "123 Main St, Apt 4B", customer: "John Doe", items: 3, distance: "1.2 miles", estimatedTime: "15 min", status: "Available" },
      { id: 2, address: "456 Oak Ave", customer: "Jane Smith", items: 2, distance: "0.8 miles", estimatedTime: "10 min", status: "Available" },
      { id: 3, address: "789 Pine Blvd", customer: "Robert Johnson", items: 5, distance: "2.4 miles", estimatedTime: "25 min", status: "Available" },
    ],
    accepted: [
      { id: 4, address: "321 Elm St", customer: "Sarah Williams", items: 1, distance: "1.5 miles", estimatedTime: "18 min", status: "Accepted", acceptedAt: "10:30 AM" },
    ],
    completed: [
      { id: 5, address: "654 Maple Rd", customer: "Michael Brown", items: 4, distance: "1.9 miles", estimatedTime: "22 min", status: "Completed", completedAt: "9:45 AM" },
      { id: 6, address: "987 Cedar Ln", customer: "Emily Davis", items: 2, distance: "0.5 miles", estimatedTime: "8 min", status: "Completed", completedAt: "9:15 AM" },
    ]
  });

  const acceptDelivery = (id) => {
    const updatedAvailable = deliveries.available.filter(delivery => delivery.id !== id);
    const deliveryToAccept = deliveries.available.find(delivery => delivery.id === id);
    
    if (deliveryToAccept) {
      const acceptedDelivery = {
        ...deliveryToAccept,
        status: "Accepted",
        acceptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setDeliveries({
        ...deliveries,
        available: updatedAvailable,
        accepted: [...deliveries.accepted, acceptedDelivery]
      });
    }
  };

  const completeDelivery = (id) => {
    const updatedAccepted = deliveries.accepted.filter(delivery => delivery.id !== id);
    const deliveryToComplete = deliveries.accepted.find(delivery => delivery.id === id);
    
    if (deliveryToComplete) {
      const completedDelivery = {
        ...deliveryToComplete,
        status: "Completed",
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setDeliveries({
        ...deliveries,
        accepted: updatedAccepted,
        completed: [completedDelivery, ...deliveries.completed]
      });
    }
  };

  const renderDeliveryCard = (delivery, actionType) => {
    return (
      <div key={delivery.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between mb-3">
          <span className="font-medium text-lg">{delivery.address}</span>
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
            delivery.status === "Available" ? "bg-blue-100 text-blue-800" : 
            delivery.status === "Accepted" ? "bg-yellow-100 text-yellow-800" : 
            "bg-green-100 text-green-800"
          }`}>
            {delivery.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center">
            <User size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{delivery.customer}</span>
          </div>
          <div className="flex items-center">
            <Package size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{delivery.items} items</span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{delivery.distance}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{delivery.estimatedTime}</span>
          </div>
        </div>
        
        {actionType === "accept" && (
          <button 
            onClick={() => acceptDelivery(delivery.id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md flex items-center justify-center"
          >
            <Truck size={18} className="mr-2" />
            Accept Delivery
          </button>
        )}
        
        {actionType === "complete" && (
          <div>
            <div className="flex items-center mb-3 text-sm text-gray-600">
              <Clock size={16} className="mr-2" />
              Accepted at: {delivery.acceptedAt}
            </div>
            <button 
              onClick={() => completeDelivery(delivery.id)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md flex items-center justify-center"
            >
              <CheckCircle size={18} className="mr-2" />
              Mark as Completed
            </button>
          </div>
        )}
        
        {actionType === "details" && (
          <div className="text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle size={16} className="mr-2 text-green-500" />
              Completed at: {delivery.completedAt}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDeliveryList = () => {
    if (activeTab === "available") {
      return deliveries.available.length > 0 ? (
        deliveries.available.map(delivery => renderDeliveryCard(delivery, "accept"))
      ) : (
        <div className="text-center py-16">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700">No Available Deliveries</h3>
          <p className="text-gray-500">Check back soon for new delivery requests</p>
        </div>
      );
    } else if (activeTab === "accepted") {
      return deliveries.accepted.length > 0 ? (
        deliveries.accepted.map(delivery => renderDeliveryCard(delivery, "complete"))
      ) : (
        <div className="text-center py-16">
          <Truck size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700">No Accepted Deliveries</h3>
          <p className="text-gray-500">Accept deliveries to see them here</p>
        </div>
      );
    } else {
      return deliveries.completed.length > 0 ? (
        deliveries.completed.map(delivery => renderDeliveryCard(delivery, "details"))
      ) : (
        <div className="text-center py-16">
          <CheckCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700">No Completed Deliveries</h3>
          <p className="text-gray-500">Your completed deliveries will appear here</p>
        </div>
      );
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Header3 />
      </div>
      <div className="container mx-auto px-4 flex-grow py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Delivery Dashboard</h1>
          <div className="flex items-center">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-2">Active</div>
            <p className="text-gray-600">Ready to accept deliveries</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="stats-container grid grid-cols-3 gap-4">
            <div className="stat-card bg-white rounded-lg p-4 shadow-md">
              <p className="text-gray-500 text-sm">Available</p>
              <p className="text-2xl font-bold">{deliveries.available.length}</p>
            </div>
            <div className="stat-card bg-white rounded-lg p-4 shadow-md">
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-2xl font-bold">{deliveries.accepted.length}</p>
            </div>
            <div className="stat-card bg-white rounded-lg p-4 shadow-md">
              <p className="text-gray-500 text-sm">Completed Today</p>
              <p className="text-2xl font-bold">{deliveries.completed.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="tabs flex border-b">
            <button 
              className={`py-2 px-4 font-medium ${activeTab === "available" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("available")}
            >
              Available
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === "accepted" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("accepted")}
            >
              In Progress
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === "completed" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="delivery-list">
          {renderDeliveryList()}
        </div>
      </div>
      <Footer />
    </>
  );
}