const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const coursesController = require('../controllers/coursesController');
const authMiddleware = require('../middleware/auth');

// Multer setup – store uploaded syllabi on disk under uploads/syllabi/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/syllabi'));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF, Word, and PowerPoint files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

// GET all available courses (with teacher profiles)
router.get('/all', authMiddleware, coursesController.getAllCourses);

// GET all courses for the authenticated teacher/student
router.get('/', authMiddleware, coursesController.getCourses);

// GET all assignments for the enrolled student's courses
router.get('/student/assignments', authMiddleware, coursesController.getStudentAssignments);

// GET a single course by ID
router.get('/:id', authMiddleware, coursesController.getCourseById);

// POST enroll a student in a course
router.post('/:id/enroll', authMiddleware, coursesController.enrollCourse);

// POST create a new course (optional syllabus file)
router.post('/', authMiddleware, upload.single('syllabus'), coursesController.createCourse);

// PUT update a course
router.put('/:id', authMiddleware, coursesController.updateCourse);

// DELETE a course
router.delete('/:id', authMiddleware, coursesController.deleteCourse);

// --- Assignments sub-routes ---
// GET assignments for a course
router.get('/:id/assignments', authMiddleware, coursesController.getAssignments);

// POST create assignment for a course
router.post('/:id/assignments', authMiddleware, coursesController.createAssignment);

// --- Submissions sub-routes ---
// GET all submissions for an assignment
router.get('/:courseId/assignments/:assignmentId/submissions', authMiddleware, coursesController.getSubmissions);

// POST submit an assignment
router.post('/:courseId/assignments/:assignmentId/submissions', authMiddleware, coursesController.submitAssignment);

// PUT grade a submission
router.put('/:courseId/assignments/:assignmentId/submissions/:submissionId', authMiddleware, coursesController.gradeSubmission);

module.exports = router;
