import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from './api';

export default function EditItem() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Textbook',
    condition: 'New',
    price: '',
    description: '',
  });

const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get('/items');
        const currentItem = res.data.find((item) => item._id === id);
        if (currentItem) {
          setFormData({
            title: currentItem.title,
            category: currentItem.category,
            condition: currentItem.condition,
            price: currentItem.price,
            description: currentItem.description,
          });
        }
      } catch (error) {
        console.error('Failed to fetch item details', error);
      }
    };
    fetchItem();
  }, [id]);

// This function will give a warning to user before closing the edit menu!!
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);


  const handleNavClick = (path) => {
    const isModified = JSON.stringify(formData) !== JSON.stringify(initialData);
    if (isModified) {
      if (window.confirm('You have unsaved changes. Do you really want to leave?')) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/items/${id}`, formData);
      alert('Item updated successfully!');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update item');
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#1e293b',
      color: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
    }
    }
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        Edit Item Listing
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#334155', color: '#fff' }}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#334155', color: '#fff' }}
        >
          <option value="Textbook">Textbook</option>
          <option value="Tech">Tech</option>
          <option value="Other">Other</option>
        </select>
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#334155', color: '#fff' }}
        >
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#334155', color: '#fff' }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#334155', color: '#fff', resize: 'vertical' }}
        />
        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }
        }
        >
          Update Item
        </button>
      </form>
    </div>
  );
}