const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, communityController.getPosts);
router.post('/', authMiddleware, communityController.createPost);
router.post('/:id/reply', authMiddleware, communityController.createReply);

module.exports = router;
