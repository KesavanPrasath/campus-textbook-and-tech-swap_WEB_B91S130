const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    

    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Textbook', 'Tech', 'Other'],
    },
    condition: {
      type: String,
      required: [true, 'Please specify item condition'],
      enum: ['New', 'Like New', 'Good', 'Fair'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please specify price (0 for swap/free)'],
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Item', itemSchema);