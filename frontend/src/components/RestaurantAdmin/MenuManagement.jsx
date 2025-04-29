import React, { useState, useEffect } from "react";

export default function MenuManagement({ restaurantId, apiBaseUrl }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", category: "", price: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editItemValues, setEditItemValues] = useState({ name: "", category: "", price: "" });

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/menu/${restaurantId}/menu`);
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMenuItem = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiBaseUrl}/menu/${restaurantId}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error("Failed to create menu item");
      }

      await fetchMenuItems();
      setNewItem({ name: "", category: "", price: "" });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create menu item");
    }
  };

  const updateMenuItem = async (id, updatedItem) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiBaseUrl}/menu/${restaurantId}/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error("Failed to update menu item");
      }

      await fetchMenuItems();
      setEditItem(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update menu item");
    }
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiBaseUrl}/menu/${restaurantId}/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete menu item");
      }

      await fetchMenuItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete menu item");
    }
  };

  const toggleMenuItemAvailability = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiBaseUrl}/menu/${restaurantId}/menu/${id}/toggle-availability`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle availability");
      }

      await fetchMenuItems();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle availability");
    }
  };

  if (loading) return <div>Loading menu items...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Menu Items</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#008083] hover:bg-[#005f60] text-white px-4 py-2 rounded"
        >
          Add New Item
        </button>
      </div>

      {isAdding && (
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-2">
              <button onClick={createMenuItem} className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editItem && (
        <div className="p-6 border-b border-gray-200 bg-yellow-50">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={editItemValues.name}
              onChange={(e) => setEditItemValues({ ...editItemValues, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={editItemValues.category}
              onChange={(e) => setEditItemValues({ ...editItemValues, category: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={editItemValues.price}
              onChange={(e) => setEditItemValues({ ...editItemValues, price: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => updateMenuItem(editItem._id, editItemValues)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditItem(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(item.price).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleMenuItemAvailability(item._id)}
                      className={`text-white px-3 py-1 rounded text-sm ${
                        item.isAvailable ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                    </button>
                    <button
                      onClick={() => {
                        setEditItem(item);
                        setEditItemValues({
                          name: item.name,
                          category: item.category,
                          price: item.price,
                        });
                      }}
                      className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item._id)}
                      className="text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
