const router = require('express').Router();

const { createItem, getItems, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingItem');

router.get('/', getItems);

router.post('/', createItem);

router.delete('/:itemId', deleteItem);

// add like / dislike routes
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;