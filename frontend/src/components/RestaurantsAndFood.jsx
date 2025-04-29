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
  
  // User address for order - would come from profile in a real app
  const [userAddress, setUserAddress] = useState({
    no: "123",
    street: "Main Street"
  });
  
  // User location for order
  const [userLocation, setUserLocation] = useState({
    latitude: 37.7749, 
    longitude: -122.4194
  });

  const token = localStorage.getItem("token");
  
  // Define separate API URLs for different services
  const RESTAURANT_API_URL = "http://localhost:4700"; // for restaurant and menu
  const ORDER_API_URL = "http://localhost:5000"; // for cart and orders
  
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get(`${RESTAURANT_API_URL}/api/restaurants/all`);
        setRestaurants(response.data.data);
      } catch (err) {
        setError("Failed to load restaurants. Please try again later.");
        console.error("Restaurant fetch error:", err);
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
          `${RESTAURANT_API_URL}/api/menu/${selectedRestaurant._id}/menu`
        );
        setFoodItems(response.data);
      } catch (err) {
        setError("Failed to load menu items. Please try again later.");
        console.error("Menu fetch error:", err);
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
      const response = await axiosInstance.get(`${ORDER_API_URL}/api/cart`);
      setCart(response.data);
      
      // If we have cart items and selectedRestaurant is not set,
      // we should set it based on the first cart item's restaurantId
      if (response.data.length > 0 && !selectedRestaurant) {
        const cartRestaurantId = response.data[0].restaurantId;
        if (cartRestaurantId) {
          // Find the restaurant in our restaurants list
          const restaurant = restaurants.find(r => r._id === cartRestaurantId);
          if (restaurant) {
            setSelectedRestaurant(restaurant);
          } else {
            // If restaurant isn't in our list yet, fetch it
            try {
              const restaurantResponse = await axiosInstance.get(
                `${RESTAURANT_API_URL}/api/restaurants/${cartRestaurantId}`
              );
              setSelectedRestaurant(restaurantResponse.data);
            } catch (err) {
              console.error("Failed to fetch restaurant details:", err);
            }
          }
        }
      }
      
      console.log("Cart data:", response.data);
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
      const response = await axiosInstance.get(`${ORDER_API_URL}/api/order`);
      setOrders(response.data);
      console.log("Orders data:", response.data);
    } catch (err) {
      setError("Failed to load orders. Please try again later.");
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    // Make sure we have a selected restaurant
    if (!selectedRestaurant || !selectedRestaurant._id) {
      toast.error("Restaurant information is missing. Please select a restaurant first.");
      return;
    }
    
    try {
      const response = await axiosInstance.post(`${ORDER_API_URL}/api/cart/add`, {
        menuItemId: item._id,
        restaurantId: selectedRestaurant._id, // Ensure restaurant ID is included
        quantity: 1,
        name: item.name,
        price: item.price,
        imageUrl: item.image
      });
      
      if (response.status === 201) {
        toast.success("Item added to cart successfully!");
        fetchCart(); // Refresh cart after adding item
      }
    } catch (err) {
      toast.error("Failed to add item to cart. Please try again later.");
      console.error("Add to cart error:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axiosInstance.delete(`${ORDER_API_URL}/api/cart/${itemId}`);
      toast.success("Item removed from cart");
      fetchCart(); // Refresh cart to reflect changes
    } catch (err) {
      toast.error("Failed to remove item from cart. Please try again later.");
      console.error("Remove from cart error:", err);
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      const response = await axiosInstance.put(`${ORDER_API_URL}/api/cart/update/${itemId}`, {
        quantity: quantity
      });
      if (response.status === 200) {
        fetchCart(); // Refresh cart after updating quantity
      }
    } catch (err) {
      toast.error("Failed to update item quantity.");
      console.error("Update quantity error:", err);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Check if all cart items belong to the same restaurant
      const firstRestaurantId = cart[0].restaurantId;
      const allSameRestaurant = cart.every(item => item.restaurantId === firstRestaurantId);
      
      if (!allSameRestaurant) {
        toast.error("All items in your cart must be from the same restaurant");
        return;
      }
      
      // Ensure we have a restaurant ID from the cart
      const restaurantId = cart[0].restaurantId;
      if (!restaurantId) {
        toast.error("Restaurant information is missing from cart. Please try again.");
        return;
      }
      
      // Format the order data according to backend requirements
      const orderData = {
        restaurantId: restaurantId,
        paymentMethod: "CashOnDelivery",
        addressNo: userAddress.no,
        addressStreet: userAddress.street,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        deliveryCharge: 5.00 // Default delivery charge
      };

      console.log("Placing order with data:", orderData);
      
      const response = await axiosInstance.post(
        `${ORDER_API_URL}/api/order/place`,
        orderData
      );
      
      if (response.data.order) {
        toast.success("Order placed successfully!");
        // Clear the cart after successful order
        setCart([]);
        setActiveTab("track");
        // Refresh orders list
        fetchOrders();
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order placement error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to place order. Please try again later.");
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Confirmed":
        return "bg-indigo-100 text-indigo-800";
      case "Preparing":
        return "bg-yellow-100 text-yellow-800";
      case "OutForDelivery":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to handle restaurant selection
  const handleSelectRestaurant = (restaurant) => {
    // If there are items in the cart from a different restaurant, confirm with user
    if (cart.length > 0) {
      const cartRestaurantId = cart[0].restaurantId;
      if (cartRestaurantId && cartRestaurantId !== restaurant._id) {
        if (window.confirm("Selecting a new restaurant will clear your current cart. Continue?")) {
          // Clear cart and select new restaurant
          axiosInstance.delete(`${ORDER_API_URL}/api/cart`)
            .then(() => {
              setCart([]);
              setSelectedRestaurant(restaurant);
              toast.info("Cart cleared due to restaurant change");
            })
            .catch(err => {
              console.error("Failed to clear cart:", err);
              // Still change restaurant if clearing cart fails
              setSelectedRestaurant(restaurant);
            });
        }
      } else {
        // Same restaurant or no restaurant ID in cart, just select it
        setSelectedRestaurant(restaurant);
      }
    } else {
      // No items in cart, simply select restaurant
      setSelectedRestaurant(restaurant);
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
                      onClick={() => handleSelectRestaurant(restaurant)}
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
              <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
              {error && <p className="text-red-500">{error}</p>}
              {loading ? (
                <p>Loading...</p>
              ) : cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div>
                  {/* Display restaurant name if available */}
                  {cart.length > 0 && cart[0].restaurantId && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium">
                        Restaurant: {selectedRestaurant ? selectedRestaurant.name : "Loading restaurant info..."}
                      </h3>
                    </div>
                  )}
                  
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border-b py-4"
                    >
                      <div className="flex items-center">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                        )}
                        <div>
                          <h2 className="font-semibold text-lg">{item.name}</h2>
                          <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                          <div className="flex items-center mt-2">
                            <button 
                              onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                            >
                              -
                            </button>
                            <span className="mx-3">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="font-semibold text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Delivery Fee:</span>
                      <span>$5.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${(cartTotal + 5).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={placeOrder}
                    className="mt-6 bg-[#008083] text-white px-6 py-3 w-full rounded-lg hover:bg-[#005f60] transition-colors font-semibold"
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
              <h1 className="text-2xl font-bold mb-6">Track Orders</h1>
              {error && <p className="text-red-500">{error}</p>}
              {loading ? (
                <p>Loading...</p>
              ) : orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                          Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                        {order.restaurantId && (
                          <p className="text-gray-600 text-sm mt-1">
                            Restaurant ID: {order.restaurantId}
                          </p>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-medium mb-2">Order Items:</h3>
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>
                                {item.name} x {item.quantity}
                              </span>
                              <span>${item.totalPrice ? item.totalPrice.toFixed(2) : (item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery:</span>
                            <span>${order.deliveryCharge.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold mt-2">
                            <span>Total:</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center text-gray-600">
                          <Clock size={16} className="mr-1" />
                          <span>
                            {order.status === "Delivered" 
                              ? "Delivered" 
                              : order.status === "Pending" 
                                ? "Waiting for confirmation" 
                                : "Estimated delivery in 30-45 minutes"}
                          </span>
                        </div>
                      </div>
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