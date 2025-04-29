import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header2 from "./Header2";
import { ShoppingCart } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/api/cart"
        );
        setCart(response.data);
      } catch (err) {
        setError("Failed to load cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const removeFromCart = async (itemId) => {
    try {
      await axiosInstance.delete(`http://localhost:5000/api/cart/${itemId}`);
      setCart(cart.filter((item) => item._id !== itemId));
    } catch (err) {
      setError("Failed to remove item from cart. Please try again later.");
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
    } catch (err) {
      setError("Failed to place order. Please try again later.");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Header2 />
      </div>
      <div className="container mx-auto px-4 py-4">
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
              // className="bg-[#008083] text-white px-3 py-1 rounded-lg hover:bg-[#005f60] transition-colors"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
