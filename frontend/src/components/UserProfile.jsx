import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header2 from "./Header2";
import { Save, Trash2 } from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const response = await axios.get(
          `http://localhost:4800/api/users/get-user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
        setUser(response.data.data);
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4800/api/users/update-user/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      setUser(response.data.data);
      setEditMode(false);
      showNotification("Profile updated successfully", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Failed to update profile", "error");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `http://localhost:4800/api/users/delete-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      showNotification("Account deleted successfully", "success");
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Error deleting account:", error);
      showNotification("Failed to delete account", "error");
    }
  };

  // Show notification helper
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Header2 />
      </div>

      <div className="container mx-auto px-4 flex-grow py-6 pb-24">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          {/* Notification */}
          {notification.show && (
            <div
              className={`mb-4 p-3 rounded-md ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {notification.message}
            </div>
          )}

          {/* Profile Information Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Profile Information
              </h3>
            </div>

            {!editMode ? (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex mb-4">
                  <div className="w-1/3 text-gray-600">Name</div>
                  <div className="w-2/3 font-medium">{user.name}</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 text-gray-600">Email</div>
                  <div className="w-2/3 font-medium">{user.email}</div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#008083] focus:border-[#008083]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#008083] focus:border-[#008083]"
                  />
                </div>
              </div>
            )}

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="text-[#008083] hover:text-[#005f60] font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  className="bg-[#008083] text-white px-4 py-2 rounded-md hover:bg-[#005f60] flex items-center"
                >
                  <Save className="mr-1 h-4 w-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      ...formData,
                      name: user.name,
                      email: user.email,
                    });
                  }}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Delete Account Section */}
          <div>
            <div className="flex items-center mb-4">
              <Trash2 className="mr-2 h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Delete Account
              </h3>
            </div>

            {!showDeleteConfirm ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 border border-red-300 px-4 py-2 rounded-md hover:bg-red-50"
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <p className="text-red-700 font-medium mb-4">
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
