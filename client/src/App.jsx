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
const Marketplace = ({ user }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get('/items')
      .then((res) => setItems(res.data))
      .catch((err) => console.error('Failed to fetch items:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete item');
    }
  };

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

// Register Component
const Register = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '40px auto', border: '1px solid #cbd5e1', borderRadius: 8 }}>
      <h3>Register</h3>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: 10 }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 10 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 10 }} />
        <button type="submit" style={{ padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Register</button>
      </form>
    </div>
  );
};

// Login Component
const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '40px auto', border: '1px solid #cbd5e1', borderRadius: 8 }}>
      <h3>Login</h3>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 10 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 10 }} />
        <button type="submit" style={{ padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  );
};

// Create Item Component
const CreateItem = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Textbook');
  const [condition, setCondition] = useState('Like New');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/items', { title, category, condition, price: Number(price), description });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create item');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: '40px auto', border: '1px solid #cbd5e1', borderRadius: 8 }}>
      <h3>Post a New Item</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: 10 }} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 10 }}>
          <option value="Textbook">Textbook</option>
          <option value="Tech">Tech</option>
          <option value="Other">Other</option>
        </select>
        <select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ padding: 10 }}>
          <option value="Brand New">Brand New</option>
          <option value="Like New">Like New</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
        </select>
        <input type="number" placeholder="Price ($)" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: 10 }} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: 10, height: 80 }} />
        <button type="submit" style={{ padding: 10, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Post Item</button>
      </form>
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
        <Route path="/" element={<Marketplace user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/create" element={<CreateItem />} />
      </Routes>
    </Router>
  );
}