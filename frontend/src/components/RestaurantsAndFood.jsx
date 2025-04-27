import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header2 from "./Header2";
import { ShoppingCart, Utensils, Package, Clock } from "lucide-react";

export default function RestaurantsAndFood() {
  const [activeTab, setActiveTab] = useState("browse");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]); // State for restaurants
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Selected restaurant
  const [foodItems, setFoodItems] = useState([]); // State for menu items
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem("token");

  // Axios instance with Authorization header
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch restaurants on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:4700/api/restaurants/all"
        );
        console.log("Backend Response:", response.data); // Debugging: Log the response
        setRestaurants(response.data.data); // Update state with fetched restaurants
      } catch (error) {
        console.error(
          "Error fetching restaurants:",
          error.response?.data || error.message
        );
        setError("Failed to load restaurants. Please try again later.");
      }
    };

    fetchRestaurants();
  }, []);

  // Fetch menu items when a restaurant is selected
  useEffect(() => {
    if (!selectedRestaurant) return;

    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `http://localhost:4700/api/menu/${selectedRestaurant._id}/menu`
        );
        setFoodItems(response.data); // Update state with fetched menu items
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError("Failed to load menu items. Please try again later.");
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedRestaurant]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: orders.length + 1,
      restaurant: selectedRestaurant.name,
      items: cart.map((item) => item.name),
      status: "Order placed",
      estimatedTime: "25-35 min",
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveTab("track");
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Header2 />
      </div>

      <div className="container mx-auto px-4 flex-grow pb-24">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">
            Hello, Welcome to Foodies
          </h1>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex items-center px-4 py-2 mr-4 ${
                activeTab === "browse"
                  ? "text-[#f08116] border-b-2 border-[#f08116] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("browse")}
            >
              <Utensils className="mr-2" size={18} />
              Browse Food
            </button>
            <button
              className={`flex items-center px-4 py-2 mr-4 ${
                activeTab === "cart"
                  ? "text-[#f08116] border-b-2 border-[#f08116] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("cart")}
            >
              <ShoppingCart className="mr-2" size={18} />
              Cart ({cart.length})
            </button>
            <button
              className={`flex items-center px-4 py-2 ${
                activeTab === "track"
                  ? "text-[#f08116] border-b-2 border-[#f08116] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("track")}
            >
              <Package className="mr-2" size={18} />
              Track Orders
            </button>
          </div>

          {/* Browse Food Tab */}
          {activeTab === "browse" && (
            <div>
              {error && <p className="text-red-500">{error}</p>}
              {!selectedRestaurant ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedRestaurant(restaurant)}
                    >
                      <h3 className="text-lg font-semibold">
                        {restaurant.name}
                      </h3>
                      <p className="text-gray-600">{restaurant.address.city}</p>
                      <p className="text-gray-600">
                        Rating: {restaurant.rating} / 5
                      </p>
                      <p
                        className={`text-sm ${
                          restaurant.isOpen ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {restaurant.isOpen ? "Open Now" : "Closed"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back to Restaurants
                  </button>
                  {loading ? (
                    <p>Loading menu items...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {foodItems.map((food) => (
                        <div
                          key={food._id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="text-lg font-semibold">
                              {food.name}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {selectedRestaurant.name}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-[#008083] font-bold">
                                ${food.price.toFixed(2)}
                              </span>
                              <button
                                onClick={() => addToCart(food)}
                                className="bg-[#008083] text-white px-3 py-1 rounded-lg hover:bg-[#005f60] transition-colors"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* <div className=""> */}
        <Footer />
      {/* </div> */}
    </>
  );
}
