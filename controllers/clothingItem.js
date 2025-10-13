const ClothingItem = require('../models/clothingItem');
const mongoose = require('mongoose');

const createItem = (req, res) => {
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  const { name, weather, imageUrl } = req.body;

  // normalize and trim inputs
  const nameVal = typeof name === 'string' ? name.trim() : (name ? String(name).trim() : '');
  const weatherVal = typeof weather === 'string' ? weather.trim() : (weather ? String(weather).trim() : '');
  const imageUrlVal = typeof imageUrl === 'string' ? imageUrl.trim() : (imageUrl ? String(imageUrl).trim() : '');

  // missing or empty fields -> 400
  if (!nameVal || !weatherVal || !imageUrlVal) {
    return res.status(400).json({
      message: 'Missing required fields: name, weather and imageUrl are required',
    });
  }

  return ClothingItem.create({ name: nameVal, weather: weatherVal, imageUrl: imageUrlVal })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      console.error('Creation error:', err);
      if (err && err.name === 'ValidationError') {
        const messages = Object.values(err.errors)
          .map((e) => e.message)
          .join(', ');
        return res.status(400).json({ message: messages });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};

const getItems = (req, res) => {
    ClothingItem.find({})
        .then(items => res.json(items))
        .catch(err => {
            console.error(err);
            // return 500 for server errors
            res.status(500).json({ message: 'Internal Server Error' });
        });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  // validate ObjectId first — invalid IDs should return 400
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: 'Invalid item ID' });
  }

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.status(200).json({ message: 'Item deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};

// add like handler
const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId =
    (req.user && req.user._id) || req.body.userId || req.body._id || '000000000000000000000000';

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).json({ message: 'Item not found' });
      }
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};

// add dislike handler
const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId =
    (req.user && req.user._id) || req.body.userId || req.body._id || '000000000000000000000000';

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).json({ message: 'Item not found' });
      }
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};