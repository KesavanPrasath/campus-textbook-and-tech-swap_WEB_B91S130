const express = require('express');
const router = express.Router();
const {
  getItems,
  createItem,
  updateItem,
  
  deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getItems).post(protect, createItem);
router.route('/:id').delete(protect, deleteItem).put(protect, updateItem);

module.exports = router;

module.exports = router;