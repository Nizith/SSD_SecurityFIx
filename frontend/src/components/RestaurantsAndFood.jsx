import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header2 from "./Header2";
import { ShoppingCart, Utensils, Package, Clock } from "lucide-react";
import { toast } from "react-toastify";

export default function RestaurantsAndFood() {
  const [activeTab, setActiveTab] = useState("browse");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:4700/api/restaurants/all");
        setRestaurants(response.data.data);
      } catch (err) {
        setError("Failed to load restaurants. Please try again later.");
      }
    };

    fetchRestaurants();
    fetchCart();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) return;

    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `http://localhost:4700/api/menu/${selectedRestaurant._id}/menu`
        );
        setFoodItems(response.data);
      } catch (err) {
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedRestaurant]);

  // Calculate cart total whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("http://localhost:5000/api/cart");
      setCart(response.data);
    } catch (err) {
      setError("Failed to load cart items. Please try again later.");
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("http://localhost:5000/api/order");
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders. Please try again later.");
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    try {
      const response = await axiosInstance.post("http://localhost:5000/api/cart/add", {
        menuItemId: item._id,
        quantity: 1,
      });
      if (response.status === 201) {
        toast.success("Item added to cart successfully!");
        fetchCart(); // Refresh cart after adding item
      }
    } catch (err) {
      toast.error("Failed to add item to cart. Please try again later.");
      console.error(err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axiosInstance.delete(`http://localhost:5000/api/cart/${itemId}`);
      setCart(cart.filter((item) => item._id !== itemId));
    } catch (err) {
      setError("Failed to remove item from cart. Please try again later.");
      console.error(err);
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      const response = await axiosInstance.put(`http://localhost:5000/api/cart/update/${itemId}`, {
        quantity: quantity
      });
      if (response.status === 200) {
        fetchCart(); // Refresh cart after updating quantity
      }
    } catch (err) {
      toast.error("Failed to update item quantity.");
      console.error(err);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/orderxx`x",
        {
          items: cart.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        }
      );
      alert("Order placed successfully!");
      setCart([]);
      setActiveTab("track");
    } catch (err) {
      setError("Failed to place order. Please try again later.");
      console.error(err);
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Order placed":
        return "bg-blue-100 text-blue-800";
      case "Preparing":
        return "bg-yellow-100 text-yellow-800";
      case "Out for delivery":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                      <p className="text-gray-600">{restaurant.address?.city || "City not available"}</p>
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

          {/* Cart Tab */}
          {activeTab === "cart" && (
            <div>
              <h1 className="text-2xl font-bold">Your Cart</h1>
              {error && <p className="text-red-500">{error}</p>}
              {loading ? (
                <p>Loading...</p>
              ) : cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div>
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <div>
                        <h2>{item.name}</h2>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={placeOrder}
                    className="mt-4 bg-[#008083] text-white px-4 py-2 rounded hover:bg-[#005f60] transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Track Orders Tab */}
          {activeTab === "track" && (
            <div>
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
                          <li key={index}>
                            {item.name} - Quantity: {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}