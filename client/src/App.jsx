import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import API from './api';
import EditItem from './EditItem';

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

// Marketplace Component
const Marketplace = ({ user }) => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

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


          <div key={item._id} style={{ border: '1px solid #cbd5e1', padding: 20, borderRadius: 8, background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 10px 0' }}>{item.title}</h4>
                <p style={{ margin: '5px 0' }}><strong>Category:</strong> {item.category}</p>
                <p style={{ margin: '5px 0' }}><strong>Condition:</strong> {item.condition}</p>
                <p style={{ margin: '5px 0' }}><strong>Price:</strong> ${item.price}</p>
                <p style={{ margin: '10px 0 0 0', color: '#475569' }}>{item.description}</p>
              </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
  <button
    onClick={() => navigate(`/items/${item._id}`)}
    style={{ background: '#475569', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}
  >
    View Details
  </button>

 {user && item.user && item.user._id === user._id && (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={() => navigate(`/edit/${item._id}`)}
        style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(item._id)}
        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}
      >
        Delete
      </button>
    </div>
  )}
</div>
         
  
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// Item Details component

const ItemDetails = ({ user }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [requested, setRequested] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setRequested(false);
    API.get(`/items/${id}`)
    .then((res) => setItem(res.data)).catch(() => navigate('/'));
  }, [id, navigate]);

  

  if (!item) return <p style={{ padding: 30 }}>Loading...</p>;

  const isOwner = user && item.user && item.user._id === user._id;

  const handleBuyRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await API.post('/messages', {
        itemId: item._id,
        text: `Buy request sent for "${item.title}"!`,
      });
      setRequested(true);
      alert(`Buy request sent for "${item.title}"!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send buy request');
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: '20px auto', border: '1px solid #cbd5e1', borderRadius: 8 }}>
      <button onClick={() => navigate('/')}>← Back</button>
      <h2>{item.title}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Condition:</strong> {item.condition}</p>
      <p><strong>Price:</strong> ${item.price}</p>
      <p>{item.description}</p>
     {!isOwner && (
        <button onClick={handleBuyRequest} disabled={requested}>
          {!user ? 'Login to Buy' : requested ? 'Buy Request Sent' : 'Buy / Contact Seller'}
        </button>
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


// Floating Inbox Widget
const InboxWidget = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [reply, setReply] = useState('');

  const loadThreads = async () => {
    if (!user) return;
    try {
      const res = await API.get('/messages');
      setThreads(res.data);
      if (res.data.length > 0 && !activeId) {
        setActiveId(res.data[0]._id);
      }
    } catch (err) {
      console.error('Inbox fetch failed:', err);
    }
  };

  useEffect(() => {
    if (user) loadThreads();
    else {
      setThreads([]);
      setActiveId(null);
      setOpen(false);
    }
  }, [user]);

  useEffect(() => {
    if (open && user) loadThreads();
  }, [open]);

  if (!user) return null;

  const activeThread = threads.find((t) => t._id === activeId) || threads[0] || null;

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !activeThread) return;
    try {
      const res = await API.post('/messages', {
        itemId: activeThread.item?._id || activeThread.item,
        buyerId: activeThread.buyer?._id || activeThread.buyer,
        text: reply.trim(),
      });
      setThreads((prev) => prev.map((t) => (t._id === res.data._id ? res.data : t)));
      setReply('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #475569',
            padding: '10px 16px',
            borderRadius: 24,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          Inbox ({threads.length})
        </button>
      ) : (
        <div
          style={{
            width: 340,
            maxHeight: 440,
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '10px 14px', background: '#1e293b', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Inbox</strong>
            <div>
              <button onClick={loadThreads} style={{ marginRight: 8, cursor: 'pointer' }}>Refresh</button>
              <button onClick={() => setOpen(false)} style={{ cursor: 'pointer' }}>✕</button>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, minHeight: 260, overflow: 'hidden' }}>
            <div style={{ width: 115, borderRight: '1px solid #e2e8f0', overflowY: 'auto', background: '#f8fafc' }}>
              {threads.length === 0 ? (
                <p style={{ padding: 10, fontSize: 12, color: '#64748b' }}>No messages yet</p>
              ) : (
                threads.map((t) => {
                  const otherName =
                    t.seller?._id === user._id ? t.buyer?.name || 'Buyer' : t.seller?.name || 'Seller';
                  return (
                    <div
                      key={t._id}
                      onClick={() => setActiveId(t._id)}
                      style={{
                        padding: 8,
                        fontSize: 12,
                        cursor: 'pointer',
                        background: activeThread?._id === t._id ? '#e2e8f0' : 'transparent',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{t.item?.title || 'Item'}</div>
                      <div style={{ color: '#475569' }}>{otherName}</div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 10 }}>
              {activeThread ? (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {activeThread.messages.map((m, idx) => (
                      <div
                        key={m._id || idx}
                        style={{
                          padding: '6px 8px',
                          borderRadius: 6,
                          fontSize: 12,
                          background: (m.sender?._id || m.sender) === user._id ? '#dbeafe' : '#f1f5f9',
                          alignSelf: (m.sender?._id || m.sender) === user._id ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div style={{ fontSize: 10, color: '#64748b' }}>{m.sender?.name || 'User'}</div>
                        <div>{m.text}</div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendReply} style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    <input
                      type="text"
                      placeholder="Reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      style={{ flex: 1, padding: 6, fontSize: 12 }}
                    />
                    <button type="submit" style={{ padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>Send</button>
                  </form>
                </>
              ) : (
                <p style={{ fontSize: 12, color: '#64748b' }}>Select a conversation</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Application Component
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
        <Route path="/items/:id" element={<ItemDetails user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/create" element={<CreateItem />} />
        <Route path="/edit/:id" element={<EditItem />} />
      </Routes>
      <InboxWidget user={user} />
    </Router>
  );
}