const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

// GET teacher's overall performance analytics dashboard
router.get('/teacher', authMiddleware, analyticsController.getTeacherAnalytics);

// GET per-course analytics
router.get('/teacher/course/:courseId', authMiddleware, analyticsController.getCourseAnalytics);

// GET student list with performance for a course
router.get('/teacher/course/:courseId/students', authMiddleware, analyticsController.getStudentPerformance);

// GET student performance analytics (for student view)
router.get('/student', authMiddleware, analyticsController.getStudentAnalytics);

module.exports = router;
