import React, { useState } from "react";

export default function RestaurantDetails({ restaurant, setRestaurant, apiBaseUrl }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const updateRestaurant = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiBaseUrl}/restaurants/${restaurant._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update restaurant");
            }

            const updatedRestaurant = await response.json();
            setRestaurant(updatedRestaurant);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Failed to update restaurant");
        }
    };

    const deleteRestaurant = async () => {
        if (!window.confirm("Are you sure you want to delete this restaurant?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiBaseUrl}/restaurants/${restaurant._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete restaurant");
            }

            // Redirect or handle deletion
            alert("Restaurant deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to delete restaurant");
        }
    };

    const toggleAvailability = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${apiBaseUrl}/restaurants/${restaurant._id}/toggle-availability`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errMessage = await response.text();
                throw new Error(`Failed to toggle availability: ${errMessage}`);
            }

            const updated = await response.json();
            if (updated && typeof updated.isAvailable !== "undefined") {
                setRestaurant((prev) => ({ ...prev, isAvailable: updated.isAvailable }));
            } else {
                // Fallback in case your API doesn't return the whole restaurant object
                setRestaurant((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
            }
        } catch (err) {
            console.error(err);
            alert("Failed to toggle availability");
        }
    };


    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Restaurant Details</h2>
            {isEditing ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Restaurant Name"
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Address"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Phone"
                    />
                    <div className="flex space-x-2">
                        <button onClick={updateRestaurant} className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded">
                            Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-gray-600 mb-2">
                        <strong>Name:</strong> {restaurant.name}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <strong>Address:</strong> {restaurant.address}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <strong>Phone:</strong> {restaurant.phone}
                    </p>
                    <p className="text-gray-600 mb-4">
                        <strong>Status:</strong>{" "}
                        <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${restaurant.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                        >
                            {restaurant.isAvailable ? "Available" : "Unavailable"}
                        </span>
                    </p>
                    <div className="flex space-x-2">
                        <button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                            Edit
                        </button>
                        <button onClick={deleteRestaurant} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                            Delete
                        </button>
                        <button
                            onClick={toggleAvailability}
                            className={`text-white px-4 py-2 rounded ${restaurant.isAvailable ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            {restaurant.isAvailable ? "Mark Unavailable" : "Mark Available"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}