const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../utils/errors');

const pickFirstString = (...vals) => {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim() !== '') return v.trim();
    if (v != null && v !== '') return String(v).trim();
  }
  return '';
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body || {};
  /* eslint-disable-next-line no-console */
  console.log('createItem called with body:', JSON.stringify(req.body));
  const nameVal = pickFirstString(name, req.body?.itemName, req.body?.title);
  const weatherVal = pickFirstString(weather, req.body?.condition, req.body?.climate);
  const imageUrlVal = pickFirstString(imageUrl, req.body?.image, req.body?.image_url, req.body?.img);
  const owner = req.user && req.user._id;

  if (!nameVal || !weatherVal || !imageUrlVal) {
    /* eslint-disable-next-line no-console */
    console.warn('Validation failed in createItem — parsed:', { nameVal, weatherVal, imageUrlVal });
    return next(new BadRequestError('Missing required fields: name, weather and imageUrl are required'));
  }

  return ClothingItem.create({ name: nameVal, weather: weatherVal, imageUrl: imageUrlVal, owner })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error('Creation error:', err);
      if (err && err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message).join(', ');
        return next(new BadRequestError(messages));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  return ClothingItem.find({})
    .then((items) => res.status(200).json(items))
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError('Invalid item ID'));
  }
  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) return next(new NotFoundError('Item not found'));
      if (String(item.owner) !== String(req.user._id)) {
        return next(new ForbiddenError('You do not have permission to delete this item'));
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .then(() => res.status(200).json({ message: 'Item deleted successfully' }));
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = (req.user && req.user._id) || req.body.userId || req.body._id || '000000000000000000000000';

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError('Invalid item ID'));
  }

  return ClothingItem.findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) return next(new NotFoundError('Item not found'));
      return res.status(200).json(item);
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = (req.user && req.user._id) || req.body.userId || req.body._id || '000000000000000000000000';

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError('Invalid item ID'));
  }

  return ClothingItem.findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) return next(new NotFoundError('Item not found'));
      return res.status(200).json(item);
    })
    .catch((err) => {
      /* eslint-disable-next-line no-console */
      console.error(err);
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};