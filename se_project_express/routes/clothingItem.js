const router = require('express').Router();

const { createItem, getItems, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingItemController');
const validation = require('../middlewares/validation');

router.get('/', getItems);

router.post('/', validation.validateItemBody, createItem);

router.delete('/:itemId', validation.validateId, deleteItem);

// add like / dislike routes
router.put('/:itemId/likes', validation.validateId, likeItem);
router.delete('/:itemId/likes', validation.validateId, dislikeItem);

module.exports = router;