import React from "react";
import Footer from "./Footer";
import Header3 from "./Header3";

export default function DeliveryDashboard() {
  return (
    <>
      <Header3 />
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">Delivery Personnel Dashboard</h1>
        <p>Welcome to the delivery dashboard. Manage your deliveries here.</p>
      </div>
      <Footer />
    </>
  );
}