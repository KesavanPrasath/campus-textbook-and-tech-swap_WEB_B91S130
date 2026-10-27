const Item = require('../models/Item');

const getItems = async (req, res) => {
  try {
    const items = await Item.find({}).populate('user', 'name email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const { title, category, condition, description, price } = req.body;

    if (!title || !category || !condition || !description) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const item = await Item.create({
      user: req.user._id,
      title,
      category,
      condition,
      description,
      price: price !== undefined ? price : 0,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Deleting an item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // this below comand verify that, logged-in user owns the item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export deleteItem wwith controllers
module.exports = {
  getItems,
  createItem,
  deleteItem,
};


// Deleting an item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // this below comand verify that, logged-in user owns the item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export deleteItem wwith controllers
module.exports = {
  // reports!
  deleteItem,
};