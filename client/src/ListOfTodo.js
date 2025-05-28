import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const ListOfTodo = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    Age: "",
  });
  const [itemId, setItemId] = useState(null);
  const [error, setError] = useState(null); // State for error messages

  // Backend: This function fetches items, including authentication with a Firebase ID token.
  const fetchItems = useCallback(async () => {
    setError(null);
    try {
      const token = localStorage.getItem("testfirebasenodetoken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }
      const response = await axios.get(`${process.env.REACT_APP_FIREBASE_DB_API_URL}/items`, {
        headers: {
          Authorization: `Bearer ${token}`, // Security: Send ID token for backend verification.
        },
      });
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load items. Please try again.");
      // Security: If 401/403, advise user to re-authenticate.
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError("Authentication failed. Please log in again.");
      }
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem("testfirebasenodetoken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }
      const response = await axios.post(`${process.env.REACT_APP_FIREBASE_DB_API_URL}/items`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Security: Authenticate the request.
        },
      });
      setItems((prevItems) => [...prevItems, response.data]);
      setFormData({ firstName: "", lastName: "", Age: "" });
    } catch (err) {
      console.error("Error creating item:", err);
      setError("Failed to create item. Please check your input.");
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError("Authentication required to create item.");
      }
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem("testfirebasenodetoken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }
      await axios.put(`${process.env.REACT_APP_FIREBASE_DB_API_URL}/items/${itemId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Security: Authenticate the request.
        },
      });
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, ...formData } : item
        )
      );
      setFormData({ firstName: "", lastName: "", Age: "" });
      setItemId(null);
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item. Please try again.");
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError("Authentication required to update item.");
      }
    }
  };

  const handleDeleteItem = async (id) => {
    setError(null);
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("testfirebasenodetoken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }
      await axios.delete(`${process.env.REACT_APP_FIREBASE_DB_API_URL}/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Security: Authenticate the request.
        },
      });
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item. Please try again.");
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError("Authentication required to delete item.");
      }
    }
  };

  const handleEditItem = (item) => {
    setFormData({
      firstName: item.firstName,
      lastName: item.lastName,
      Age: item.Age,
    });
    setItemId(item.id);
  };

  return (
    <div>
      <h2>Manage Todos</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <form onSubmit={itemId ? handleUpdateItem : handleCreateItem}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          required
        />
        <input
          type="number"
          name="Age"
          value={formData.Age}
          onChange={handleInputChange}
          placeholder="Age"
          required
        />
        <button type="submit">
          {itemId ? "Update Item" : "Create Item"}
        </button>
      </form>
      <button onClick={fetchItems} style={{ marginTop: '10px' }}>Refresh List</button>
      <ul>
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id}>
              {item.firstName} {item.lastName}, Age: {item.Age}
              <button onClick={() => handleEditItem(item)}>Edit</button>
              <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No items found. Create one!</p>
        )}
      </ul>
    </div>
  );
};

export default ListOfTodo;