const express = require('express');
const router = express.Router();
const universitiesController = require('../controllers/universitiesController');

router.get('/', universitiesController.getUniversities);

module.exports = router;
