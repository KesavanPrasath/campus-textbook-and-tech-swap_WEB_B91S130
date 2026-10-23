import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import API from './api';

// Navigation bar
const Navbar = ({ user, handleLogout }) => (
  <nav style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
    <h2>Campus Swap</h2>
    <div>
      <Link to="/" style={{ marginRight: 15 }}>Marketplace</Link>
      {user ? (
        <>
          <span style={{ marginRight: 15 }}>Hello, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 15 }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  </nav>
);

// Marketplace Component, mean display items are,
const Marketplace = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get('/items')
      .then((res) => setItems(res.data))
      .catch((err) => console.error('Failed to fetch items:', err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Available Items</h3>
      {items.length === 0 ? (
        <p>No items listed yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15 }}>
          {items.map((item) => (
            <div key={item._id} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 5 }}>
              <h4>{item.title}</h4>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Condition:</strong> {item.condition}</p>
              <p><strong>Price:</strong> ${item.price}</p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Application Component is below
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/login" element={<div style={{ padding: 20 }}>Login Form Component</div>} />
        <Route path="/register" element={<div style={{ padding: 20 }}>Register Form Component</div>} />
      </Routes>
    </Router>
  );
}