const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', authMiddleware, upload.single('pdf'), pdfController.analyzePdf);
router.get('/history', authMiddleware, pdfController.getHistory);

module.exports = router;
