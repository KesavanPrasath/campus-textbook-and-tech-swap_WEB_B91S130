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
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Item Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-slate-700 border border-slate-600"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700 border border-slate-600"
        >
          <option value="Textbook">Textbook</option>
          <option value="Tech">Tech</option>
          <option value="Other">Other</option>
        </select>
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700 border border-slate-600"
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
          className="w-full p-2 rounded bg-slate-700 border border-slate-600"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-slate-700 border border-slate-600"
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
        >
          Update Item
        </button>
      </form>
    </div>
  );
}