import React, { useState } from "react";
import Footer from "./Footer";
import Header2 from "./Header2";
import { ShoppingCart } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: orders.length + 1,
      restaurant: cart[0].restaurant,
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
          <div>
            {cart.length === 0 ? (
              <div className="text-center py-6">
                <ShoppingCart
                  size={48}
                  className="mx-auto text-gray-400 mb-2"
                />
                <p className="text-gray-600">Your cart is empty</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 bg-[#008083] text-white px-4 py-2 rounded-lg hover:bg-[#005f60] transition-colors"
                >
                  Browse Food
                </button>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md mr-4"
                        />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {item.restaurant}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-4">
                          ${item.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-[#008083]">
                    $
                    {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={placeOrder}
                  className="w-full bg-[#008083] text-white py-3 rounded-lg font-medium hover:bg-[#005f60] transition-colors"
                >
                  Place Order
                </button>
              </>
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
