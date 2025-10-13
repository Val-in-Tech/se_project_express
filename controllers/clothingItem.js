const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');

const pickFirstString = (...vals) => {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim() !== '') return v.trim();
    if (v != null && v !== '') return String(v).trim();
  }
  return '';
};

const createItem = (req, res) => {
  /* eslint-disable-next-line no-console */
  console.log('Request headers:', req.headers);
  /* eslint-disable-next-line no-console */
  console.log('Request body:', req.body);

  const { name, weather, imageUrl } = req.body || {};

  const nameVal = pickFirstString(name, req.body?.itemName, req.body?.title);
  const weatherVal = pickFirstString(weather, req.body?.condition, req.body?.climate);
  const imageUrlVal = pickFirstString(imageUrl, req.body?.image, req.body?.image_url, req.body?.img);

  if (!nameVal || !weatherVal || !imageUrlVal) {
    return res.status(400).json({
      message: 'Missing required fields: name, weather and imageUrl are required',
    });
  }

  return ClothingItem.create({ name: nameVal, weather: weatherVal, imageUrl: imageUrlVal })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error('Creation error:', err);
      if (err && err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message).join(', ');
        return res.status(400).json({ message: messages });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};

const getItems = (req, res) => {
  return ClothingItem.find({})
    .then((items) => res.status(200).json(items))
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: 'Invalid item ID' });
  }
  return ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.status(200).json({ message: 'Item deleted successfully' });
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = (req.user && req.user._id) || req.body.userId || req.body._id || '000000000000000000000000';

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: 'Invalid item ID' });
  }

  return ClothingItem.findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.status(200).json(item);
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = (req.user && req.user._id) || req.body.userId || req.body._id || '000000000000000000000000';

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: 'Invalid item ID' });
  }

  return ClothingItem.findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.status(200).json(item);
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
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