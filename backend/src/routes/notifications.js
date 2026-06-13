const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, notificationsController.getNotifications);
router.post('/', authMiddleware, notificationsController.createNotification);
router.post('/:id/read', authMiddleware, notificationsController.markRead);

module.exports = router;
