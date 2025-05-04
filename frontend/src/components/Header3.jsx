import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfPic from "/assets/profile.png";

export default function Header3() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleHeaderClick = () => {
    navigate("/restaurant-admin-dashboard");
  };

  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  const handleNavClick = (path, e) => {
    e.stopPropagation(); // Prevent triggering header's onClick
    navigate(path);
  };

  // Function to determine if link is active
  const isActiveLink = (path) => {
    return currentPath === path;
  };

  // Logout function
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("id");

    // Navigate to the login page
    navigate("/login");
  };

  return (
    <header
      className="flex justify-between items-center cursor-pointer"
      // onClick={handleHeaderClick}
    >
      <div className="flex items-center">
        <h1 onClick={handleHeaderClick} className="text-2xl font-bold">
          <span className="text-[#008083]">Foo</span>
          <span className="text-white bg-[#f08116]">dies</span>
        </h1>
      </div>

      <nav className="hidden md:flex space-x-8" onClick={(e) => e.stopPropagation()}>
        <a 
          // href="#" 
          onClick={(e) => handleNavClick("/restaurant-admin-dashboard", e)} 
          className={`${isActiveLink("/restaurant-admin-dashboard") ? "text-[#005f60] border-b-2 border-[#008083]" : "text-gray-600"} hover:text-[#005f60]`}
        >
          Dashboard
        </a>
        {/* <a 
          onClick={(e) => handleNavClick("/restaurants-and-food", e)} 
          className={`${isActiveLink("/restaurants-and-food") ? "text-[#005f60] border-b-2 border-[#008083]" : "text-gray-600"} hover:text-[#005f60]`}
        >
          Restaurants
        </a> */}
        {/* <a 
          href="#" 
          onClick={(e) => handleNavClick("/about", e)} 
          className={`${isActiveLink("/about") ? "text-[#005f60] border-b-2 border-[#008083]" : "text-gray-600"} hover:text-[#005f60]`}
        >
          About
        </a> */}
        {/* <a 
          onClick={(e) => handleNavClick("/cart", e)} 
          className={`${isActiveLink("/cart") ? "text-[#005f60] border-b-2 border-[#008083]" : "text-gray-600"} hover:text-[#005f60]`}
        >
          Cart
        </a>
        <a 
          onClick={(e) => handleNavClick("/track-orders", e)} 
          className={`${isActiveLink("/track-orders") ? "text-[#005f60] border-b-2 border-[#008083]" : "text-gray-600"} hover:text-[#005f60]`}
        >
          Track Orders
        </a> */}
        <a 
          onClick={(e) => handleNavClick("/contact-res", e)} 
          className={`${isActiveLink("/contact-res") ? "text-[#005f60] border-b-2 border-[#008083]" : "text-gray-600"} hover:text-[#005f60]`}
        >
          Contact
        </a>
      </nav>

      <div className="flex gap-3">
              <img
                onClick={handleProfileClick}
                src={ProfPic}
                alt="Profile"
                className="w-8 rounded-full"
              />
              <button
                onClick={handleLogout}
                className="bg-blue-500 py-1 px-3 rounded font-semibold text-white"
              >
                Logout
              </button>
            </div>

      {/* <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-white py-2 pl-4 pr-10 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300 w-48"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <div className="relative">
          <ShoppingBag className="text-[#005f60] w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>
        </div>
      </div> */}
    </header>
  );
}