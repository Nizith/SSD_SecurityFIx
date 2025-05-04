import React, { useState } from "react";
import Footer from "./Footer";
import Header3 from "./Header3";
import {
  Mail,
  Phone,
  HelpCircle,
  Users,
  ChefHat,
  Truck,
  MessageSquare,
} from "lucide-react";

export default function ContactRes() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "general",
    message: "",
  });

  const [activeTab, setActiveTab] = useState("customers");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", topic: "general", message: "" });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Header3 />
      </div>

      <div className="min-h-screen pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help! Whether you're a customer, restaurant partner,
              or interested in becoming a delivery driver, find the support you
              need below.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            <button
              onClick={() => setActiveTab("customers")}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === "customers"
                  ? "bg-[#f08116] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              For Customers
            </button>
            <button
              onClick={() => setActiveTab("restaurants")}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === "restaurants"
                  ? "bg-[#f08116] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChefHat className="w-4 h-4 mr-2" />
              For Restaurants
            </button>
            <button
              onClick={() => setActiveTab("drivers")}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === "drivers"
                  ? "bg-[#f08116] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Truck className="w-4 h-4 mr-2" />
              For Drivers
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Common Support Options */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-[#f08116]" />
                  Quick Support
                </h2>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors">
                    <h3 className="text-lg font-medium text-gray-800">
                      24/7 Help Center
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Find answers to frequently asked questions in our Help
                      Center.
                    </p>
                    <a
                      href="#"
                      className="text-[#f08116] font-medium mt-2 inline-block"
                    >
                      Visit Help Center →
                    </a>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors">
                    <h3 className="text-lg font-medium text-gray-800">
                      Live Chat Support
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Chat with our support team for immediate assistance.
                    </p>
                    <button className="mt-2 text-white bg-[#f08116] hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors">
                    <h3 className="text-lg font-medium text-gray-800">
                      Phone Support
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Call us directly for urgent inquiries.
                    </p>
                    <a
                      href="tel:+18001234567"
                      className="text-[#f08116] font-medium mt-2 inline-block"
                    >
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Follow Us
                </h2>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full"
                  >
                    <svg
                      className="h-5 w-5 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full"
                  >
                    <svg
                      className="h-5 w-5 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full"
                  >
                    <svg
                      className="h-5 w-5 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Tab Content */}
            <div className="md:col-span-2">
              {activeTab === "customers" && (
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Customer Support
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Have questions about your order, need help with a refund, or
                    want to provide feedback? We're here to help you with any
                    customer-related inquiries.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="topic"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        What can we help you with?
                      </label>
                      <select
                        id="topic"
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Issue</option>
                        <option value="refund">Refund Request</option>
                        <option value="account">Account Help</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#f08116] hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-150"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "restaurants" && (
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Restaurant Partnership
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Want to grow your restaurant business with us? Join our
                    platform to reach more customers and increase your revenue.
                  </p>

                  <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Why Partner With Us?
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#f08116] mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>
                          Reach more customers and increase your sales
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#f08116] mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>
                          Easy-to-use restaurant dashboard to manage orders
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#f08116] mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>
                          Reliable delivery network and customer service
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#f08116] mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Marketing and promotional opportunities</span>
                      </li>
                    </ul>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Contact Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="topic"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        What are you interested in?
                      </label>
                      <select
                        id="topic"
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                      >
                        <option value="join">Joining as a partner</option>
                        <option value="info">More information</option>
                        <option value="support">Partner support</option>
                        <option value="feedback">Partnership feedback</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Additional Details
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#f08116] hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-150"
                    >
                      Get Started
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "drivers" && (
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Become a Delivery Driver
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Join our team of delivery partners and earn money on your
                    own schedule. Flexible hours, weekly payments, and support
                    along the way.
                  </p>

                  <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Driver Benefits
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#f08116] mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Flexible hours - work when you want</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#f08116] mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Fast and reliable payment system</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#f08116] mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Easy-to-use driver app</span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#f08116] mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Dedicated support for drivers</span>
                      </li>
                    </ul>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="topic"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        What would you like to know?
                      </label>
                      <select
                        id="topic"
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                      >
                        <option value="apply">Apply to become a driver</option>
                        <option value="questions">
                          Questions about driving
                        </option>
                        <option value="support">Driver support</option>
                        <option value="feedback">Driver feedback</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f08116]"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#f08116] hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-150"
                    >
                      Submit Application
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div className=""> */}
        <Footer />
      {/* </div> */}
    </>
  );
}
