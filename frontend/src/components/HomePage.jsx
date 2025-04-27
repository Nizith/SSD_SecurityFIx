import React from "react";
import { useNavigate } from "react-router-dom";
import Soup from "/assets/soup.png";
import Footer from "./Footer";
import Header from "./Header";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -left-16 top-20 w-32 h-32 border-4 border-[#008083] rounded-full opacity-20"></div>
        <div className="absolute -right-16 top-10 w-40 h-40 border-4 border-[#f08116] rounded-full opacity-20"></div>
        <div className="absolute left-16 bottom-8 w-24 h-24 border-4 border-[#008083] rounded-full opacity-20"></div>
        <div className="absolute right-8 bottom-16 w-32 h-32 border-4 border-[#f08116] rounded-full opacity-20"></div>

        {/* Main container */}
        <div className="container mx-auto px-4 py-4">
          {/* Header/Navigation */}
          <Header />
        </div>
        {/* Hero Section */}
        <div className="container mx-auto">
          <div className="flex gap-8 items-center justify-between p-8">
            {/* Left Column */}
            <div className="">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gray-800">Fastest </span>
                <span className="text-[#008083]">Delivery</span>
                <span className="text-gray-800"> & Easy </span>
                <br />
                <span className="text-[#008083]">Pickup.</span>
              </h2>
              <p className="text-gray-600 mb-8 max-w-md">
                We deliver to your doorstep with the fastest delivery service in
                town.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleLogin}
                  className="bg-[#008083] text-white px-6 py-3 rounded hover:bg-[#005f60] transition font-medium"
                >
                  Login
                </button>
                {/* <button className="border border-[#008083] text-[#005f60] px-6 py-3 rounded flex items-center hover:bg-teal-50 transition font-medium">
                <Play className="mr-2 w-4 h-4 fill-current" /> Order Process
              </button> */}
              </div>
            </div>

            {/* Right Column */}
            <div className="">
              <img
                src={Soup}
                width={500}
                height={500}
                alt="Soup"
                className=""
              />
            </div>
            {/* <div className="md:w-1/2 flex justify-center">
            <div className="bg-gradient-to-r from-teal-300 to-pink-300 rounded-lg p-4 w-full max-w-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-200 rounded-lg p-2">
                  <div className="bg-pink-300 rounded-full p-4">
                    <div className="bg-pink-200 rounded-full p-10 relative">
                      <div className="absolute inset-0 rounded-full bg-pink-100 m-2"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-teal-200 rounded-lg p-2">
                  <div className="bg-teal-300 rounded-full p-4">
                    <div className="bg-white rounded-full p-10 relative">
                      <div className="absolute inset-0 rounded-full bg-white m-2"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-teal-200 rounded-lg p-2">
                  <div className="bg-teal-300 rounded-full p-4">
                    <div className="bg-pink-100 rounded-full p-10 relative">
                      <div className="absolute inset-0 rounded-full bg-pink-100 m-2"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-pink-200 rounded-lg p-2">
                  <div className="bg-pink-300 rounded-full p-4">
                    <div className="bg-white rounded-full p-10 relative">
                      <div className="absolute inset-0 rounded-full bg-white m-2"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-teal-200 rounded-lg p-2">
                  <div className="bg-teal-300 rounded-full p-4">
                    <div className="bg-blue-100 rounded-full p-10 relative">
                      <div className="absolute inset-0 rounded-full bg-blue-100 m-2"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-pink-200 rounded-lg p-2">
                  <div className="bg-pink-300 rounded-full p-4">
                    <div className="bg-pink-100 rounded-full p-10 relative">
                      <div className="absolute inset-0 rounded-full border-2 border-pink-200 m-2 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
