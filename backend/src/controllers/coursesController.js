const db = require('../config/db');

// ─── Seed data for demo ─────────────────────────────────────────────────────
const SEED_COURSES = [
  {
    name: 'CS-402: Operating Systems',
    code: 'CS-402',
    description: 'Deep dive into OS concepts: processes, threads, memory management, file systems, and scheduling algorithms.',
    students: 128,
    completion: 85,
    color: '#002045',
    schedule: 'Mon / Wed 10:00–11:30',
    semester: 'Spring 2026',
    status: 'active',
  },
  {
    name: 'CS-520: Machine Learning',
    code: 'CS-520',
    description: 'Foundations of machine learning: supervised and unsupervised learning, neural networks, gradient descent, and model evaluation.',
    students: 64,
    completion: 42,
    color: '#3cddc7',
    schedule: 'Tue / Thu 14:00–15:30',
    semester: 'Spring 2026',
    status: 'active',
  },
  {
    name: 'CS-301: Data Structures',
    code: 'CS-301',
    description: 'Core data structures: arrays, linked lists, trees, graphs, heaps, and their algorithmic applications.',
    students: 98,
    completion: 60,
    color: '#09007b',
    schedule: 'Mon / Wed / Fri 09:00–10:00',
    semester: 'Spring 2026',
    status: 'active',
  },
  {
    name: 'CS-415: Network Security',
    code: 'CS-415',
    description: 'Cryptography, network protocols, threat modeling, intrusion detection, and secure system design.',
    students: 52,
    completion: 78,
    color: '#1a365d',
    schedule: 'Tue / Thu 11:00–12:30',
    semester: 'Spring 2026',
    status: 'active',
  },
];

const SEED_ASSIGNMENTS = [
  { courseCode: 'CS-402', title: 'OS Assignment 4 – Thread Scheduling', dueDate: '2026-06-15T23:59:00Z', totalPoints: 100, submissions: 95, graded: 81 },
  { courseCode: 'CS-520', title: 'ML Project – Neural Network Classifier', dueDate: '2026-06-14T23:59:00Z', totalPoints: 200, submissions: 50, graded: 36 },
  { courseCode: 'CS-301', title: 'Data Structures – Graph Traversal Lab', dueDate: '2026-06-20T23:59:00Z', totalPoints: 50, submissions: 30, graded: 30 },
];

const SEED_STUDENTS = [
  { name: 'Alex Sterling',   email: 'alex.s@university.edu',    courseCode: 'CS-402', quizAvg: 92, attendance: 96, riskLevel: 'High Achiever', lastActive: 'Today, 10:42 AM' },
  { name: 'Maya Chen',       email: 'm.chen@university.edu',    courseCode: 'CS-402', quizAvg: 78, attendance: 88, riskLevel: 'Developing',    lastActive: 'Yesterday' },
  { name: 'Jordan Smith',    email: 'jsmith@university.edu',     courseCode: 'CS-402', quizAvg: 45, attendance: 62, riskLevel: 'At Risk',       lastActive: '4 days ago' },
  { name: 'Sarah Williams',  email: 's.williams@university.edu', courseCode: 'CS-520', quizAvg: 88, attendance: 94, riskLevel: 'High Achiever', lastActive: 'Today, 08:15 AM' },
  { name: 'Ethan Brooks',    email: 'e.brooks@university.edu',   courseCode: 'CS-520', quizAvg: 71, attendance: 82, riskLevel: 'Developing',    lastActive: '2 days ago' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

async function ensureSeeded(userId) {
  const existing = await db.getCoursesByTeacherId(userId);
  if (existing.length === 0) {
    for (const course of SEED_COURSES) {
      const saved = await db.saveCourse({ ...course, teacherId: userId });
      // Seed assignments for this course
      const matchingAssignments = SEED_ASSIGNMENTS.filter(a => a.courseCode === course.code);
      for (const assignment of matchingAssignments) {
        await db.saveAssignment({ ...assignment, courseId: saved.id, teacherId: userId });
      }
      // Seed students for this course
      const matchingStudents = SEED_STUDENTS.filter(s => s.courseCode === course.code);
      for (const student of matchingStudents) {
        await db.saveStudentRecord({ ...student, courseId: saved.id, teacherId: userId });
      }
    }
    return db.getCoursesByTeacherId(userId);
  }
  return existing;
}

// ─── Controller exports ──────────────────────────────────────────────────────

exports.getCourses = async (req, res) => {
  try {
    const courses = await ensureSeeded(req.user.id);
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await db.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacherId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.json(course);
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { name, code, description, schedule, semester, color } = req.body;
    if (!name || !code) return res.status(400).json({ message: 'Course name and code are required' });

    // If multer processed a file, store its relative path
    let syllabusFile = null;
    let syllabusOriginalName = null;
    if (req.file) {
      syllabusFile = `/uploads/syllabi/${req.file.filename}`;
      syllabusOriginalName = req.file.originalname;
    }

    const course = await db.saveCourse({
      name, code,
      description: description || '',
      schedule: schedule || '',
      semester: semester || 'Spring 2026',
      color: color || '#002045',
      students: 0,
      completion: 0,
      status: 'active',
      teacherId: req.user.id,
      syllabusFile,
      syllabusOriginalName,
    });
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await db.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacherId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const updated = await db.updateCourse(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await db.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacherId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await db.deleteCourse(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const course = await db.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const assignments = await db.getAssignmentsByCourseId(req.params.id);
    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { title, dueDate, totalPoints, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const assignment = await db.saveAssignment({
      courseId: req.params.id,
      teacherId: req.user.id,
      title,
      description: description || '',
      dueDate: dueDate || new Date().toISOString(),
      totalPoints: totalPoints || 100,
      submissions: 0,
      graded: 0,
    });
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await db.getSubmissionsByAssignmentId(req.params.assignmentId);
    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    if (grade === undefined) return res.status(400).json({ message: 'Grade is required' });

    const updated = await db.gradeSubmission(req.params.submissionId, { grade, feedback: feedback || '' });
    res.json(updated);
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
