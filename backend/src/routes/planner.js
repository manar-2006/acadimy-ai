const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, plannerController.getEvents);
router.post('/', authMiddleware, plannerController.createEvent);
router.delete('/:id', authMiddleware, plannerController.deleteEvent);

module.exports = router;
