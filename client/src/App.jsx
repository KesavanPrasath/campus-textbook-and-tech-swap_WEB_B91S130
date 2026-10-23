import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import API from './api';

// Navigation Bar
const Navbar = ({ user, handleLogout }) => (
  <nav style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', background: '#1e293b', color: '#fff' }}>
    <h2 style={{ margin: 0 }}>Campus Swap</h2>
    <div>
      <Link to="/" style={{ color: '#fff', marginRight: 20, textDecoration: 'none' }}>Marketplace</Link>
      {user ? (
        <>
          <Link to="/create" style={{ color: '#38bdf8', marginRight: 20, textDecoration: 'none' }}>+ Post Item</Link>
          <span style={{ marginRight: 20 }}>Hello, {user.name}</span>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: '#fff', marginRight: 20, textDecoration: 'none' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
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
    <div style={{ padding: 30, maxWidth: 1000, margin: '0 auto' }}>
      <h3>Available Listings</h3>
      {items.length === 0 ? (
        <p>No items listed yet. Be the first to post!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {items.map((item) => (
            <div key={item._id} style={{ border: '1px solid #cbd5e1', padding: 20, borderRadius: 8, background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>{item.title}</h4>
              <p style={{ margin: '5px 0' }}><strong>Category:</strong> {item.category}</p>
              <p style={{ margin: '5px 0' }}><strong>Condition:</strong> {item.condition}</p>
              <p style={{ margin: '5px 0' }}><strong>Price:</strong> ${item.price}</p>
              <p style={{ margin: '10px 0 0 0', color: '#475569' }}>{item.description}</p>
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