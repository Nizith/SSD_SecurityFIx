import React, { useState } from "react";
import Footer from "./Footer";
import Header2 from "./Header2";

export default function CurtainSections() {
  const handleClick = () => {
    // Navigate to the restaurants page
    window.location.href = "/restaurants-and-food";
  };
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleNumber: "",
    vehicleType: "",
  });

  const handleClick2 = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };
  const handleClick3 = () => {
    setShowPopup2(true);
  };

  const handleClose2 = () => {
    setShowPopup2(false);
  };

  const handleVehicleDetailsChange = (e) => {
    const { name, value } = e.target;
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const restaurantData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:4700/api/restaurants/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(restaurantData),
      });

      if (response.ok) {
        alert("Restaurant registered successfully!");
        setShowPopup(false);
        window.location.href = "/restaurant-admin-dashboard"; // Redirect to RestaurantAdminDashboard
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error registering restaurant:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDriverRegistration = async (e) => {
    e.preventDefault();

    // Get the user ID and location from localStorage or set default values
    const userId = localStorage.getItem("userId");
    
    // Create a properly structured request body that matches the backend expectations
    const driverData = {
      userId: userId,
      currentLocation: {
        latitude: 40.7128, // Default coordinates - could be obtained from geolocation API
        longitude: -74.0060
      },
      vehicleDetails: {
        vehicleNumber: vehicleDetails.vehicleNumber,
        vehicleType: vehicleDetails.vehicleType
      }
    };

    try {
      console.log("Sending driver registration data:", driverData);
      
      const response = await fetch("http://localhost:4900/api/delivery/drivers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(driverData),
      });

      if (response.ok) {
        alert("Driver registered successfully!");
        localStorage.setItem("role", "delivery");
        window.location.href = "/delivery-dashboard"; // Redirect to DeliveryDashboard
      } else {
        const errorData = await response.json();
        console.error("Registration error response:", errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error registering driver:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const sections = [
    {
      id: "browse",
      title: "Browse Food & Restaurants",
      color: "bg-[#008083]",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      content: (
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Find Your Perfect Meal</h3>
          <p className="mb-6">
            Browse through thousands of restaurants and cuisines in your area.
          </p>
          <button
            onClick={handleClick}
            className="bg-white text-[#f08116] px-6 py-2 rounded-full font-medium"
          >
            Explore Restaurants
          </button>
        </div>
      ),
    },
    {
      id: "restaurant",
      title: "Restaurant Owners",
      color: "bg-[#f08116]",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      content: (
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Grow Your Business</h3>
          <p className="mb-6">
            Partner with us to reach more customers and boost your restaurant's
            revenue.
          </p>
          <button
            onClick={handleClick2}
            className="bg-white text-[#008083] px-6 py-2 rounded-full font-medium"
          >
            Join as Partner
          </button>
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center text-slate-800">
                  Register Your Restaurant
                </h2>
                <form className="flex flex-col gap-3" onSubmit={handleRestaurantSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Restaurant Name"
                    className="border border-gray-300 focus:border-[1px] outline-none focus:border-slate-800 rounded px-3 py-2 text-black"
                    required
                  />
                  <input
                    type="text"
                    name="contactNumber"
                    placeholder="Contact Number"
                    className="border border-gray-300 focus:border-[1px] outline-none focus:border-slate-800 rounded px-3 py-2 text-black"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border border-gray-300 focus:border-[1px] outline-none focus:border-slate-800 rounded px-3 py-2 text-black"
                    required
                  />
                  <input
                    type="text"
                    name="address[street]"
                    placeholder="Street"
                    className="border border-gray-300 focus:border-[1px] outline-none focus:border-slate-800 rounded px-3 py-2 text-black"
                    required
                  />
                  <input
                    type="text"
                    name="address[city]"
                    placeholder="City"
                    className="border border-gray-300 focus:border-[1px] outline-none focus:border-slate-800 rounded px-3 py-2 text-black"
                    required
                  />
                  <input
                    type="text"
                    name="address[state]"
                    placeholder="State"
                    className="border border-gray-300 focus:border-[1px] outline-none focus:border-slate-800 rounded px-3 py-2 text-black"
                    required
                  />
                  <input
                    type="text"
                    name="address[zipCode]"
                    placeholder="Zip Code"
                    className="border border-gray-300 focus:border-[1px] outline-none focus:border-slate-800 rounded px-3 py-2 text-black"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "driver",
      title: "Become a Delivery Partner",
      color: "bg-[#008083]",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      ),
      content: (
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Earn On Your Schedule</h3>
          <p className="mb-6">
            Set your own hours and earn money delivering food in your community.
          </p>
          <button onClick={handleClick3} className="bg-white text-[#f08116] px-6 py-2 rounded-full font-medium">
            Start Driving
          </button>
          {showPopup2 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center text-slate-800">
                  Register Your Vehicle
                </h2>
                <form className="flex flex-col gap-3" onSubmit={handleDriverRegistration}>
                  <input
                    type="text"
                    placeholder="Vehicle Number"
                    name="vehicleNumber"
                    value={vehicleDetails.vehicleNumber}
                    onChange={handleVehicleDetailsChange}
                    className="border border-gray-300 focus:border-[1px] outline-none focus:border-slate-800 rounded px-3 py-2 text-black"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Vehicle Type"
                    name="vehicleType"
                    value={vehicleDetails.vehicleType}
                    onChange={handleVehicleDetailsChange}
                    className="border border-gray-300 focus:border-[1px] outline-none focus:border-slate-800 rounded px-3 py-2 text-black"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleClose2}
                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Header2 />
      </div>

      <div className="flex flex-col w-full">
        {/* First section - Browse */}
        <div
          className={`${sections[0].color} text-white relative overflow-hidden flex-1`}
        >
          <div className="flex flex-col justify-center items-center py-16">
            <h2 className="text-white text-4xl font-bold mb-5 text-center">
              {sections[0].title}
            </h2>

            {/* Content always visible */}
            <div className="w-full max-w-md mx-auto">{sections[0].content}</div>

            {/* Curved boundary between first and second section */}
            <svg
              className="absolute bottom-0 left-0 w-full h-20"
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
            >
              <path
                fill="#f08116"
                d="M0,0 C720,140 1440,0 1440,0 V100 H0 V0 Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Second section - Restaurant Owners */}
        <div
          className={`${sections[1].color} text-white relative overflow-hidden flex-1`}
        >
          <div className="flex flex-col justify-center items-center py-16">
            <h2 className="text-white text-4xl font-bold mb-5 text-center">
              {sections[1].title}
            </h2>

            {/* Content always visible */}
            <div className="w-full max-w-md mx-auto">{sections[1].content}</div>

            {/* Curved boundary between second and third section */}
            <svg
              className="absolute bottom-0 left-0 w-full h-20"
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
            >
              <path
                fill="#008083"
                d="M0,0 C720,140 1440,0 1440,0 V100 H0 V0 Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Third section - Become a Driver */}
        <div
          className={`${sections[2].color} text-white relative overflow-hidden flex-1`}
        >
          <div className="flex flex-col justify-center items-center py-16">
            <h2 className="text-white text-4xl font-bold mb-5 text-center">
              {sections[2].title}
            </h2>

            {/* Content always visible */}
            <div className="w-full max-w-md mx-auto">{sections[2].content}</div>

            {/* Curved boundary to white footer */}
            <hr className="border-t border-white w-full" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}