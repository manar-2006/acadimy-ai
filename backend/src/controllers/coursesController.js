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

async function ensureGlobalSeeded() {
  const users = await db.getUsers();
  let teachers = users.filter(u => u.role === 'teacher');
  
  if (teachers.length === 0) {
    const bcrypt = require('bcryptjs');
    const defaultTeacherHash = await bcrypt.hash('password123', 10);
    const newTeacher = await db.saveUser({
      email: 'drmanar@gmail.com',
      passwordHash: defaultTeacherHash,
      fullName: 'Dr. Manar Nadji',
      school: 'École Supérieure en Sciences et Technologies de l\'Informatique et du Numérique (ESTIN)',
      year: 'Professor',
      major: 'Computer Science',
      role: 'teacher',
      bio: 'Professor of Computer Science & AI researcher.',
      specializations: ['Artificial Intelligence', 'Operating Systems', 'Machine Learning']
    });
    teachers = [newTeacher];
  }

  const allCourses = await db.getAllCourses();
  if (allCourses.length === 0) {
    for (let i = 0; i < SEED_COURSES.length; i++) {
      const course = SEED_COURSES[i];
      let teacher = teachers[i % teachers.length];
      
      if (course.code === 'CS-402') {
        const found = teachers.find(t => t.email === 'drmanar@gmail.com');
        if (found) teacher = found;
      } else if (course.code === 'CS-520') {
        const found = teachers.find(t => t.email === 'manar5@gmail.com');
        if (found) teacher = found;
      } else if (course.code === 'CS-301') {
        const found = teachers.find(t => t.email === 'manar9@gmail.com');
        if (found) teacher = found;
      } else if (course.code === 'CS-415') {
        const found = teachers.find(t => t.email === 'manar456@gmail.com');
        if (found) teacher = found;
      }

      const saved = await db.saveCourse({ ...course, teacherId: teacher.id });

      const matchingAssignments = SEED_ASSIGNMENTS.filter(a => a.courseCode === course.code);
      for (const assignment of matchingAssignments) {
        await db.saveAssignment({ ...assignment, courseId: saved.id, teacherId: teacher.id });
      }

      const matchingStudents = SEED_STUDENTS.filter(s => s.courseCode === course.code);
      for (const student of matchingStudents) {
        await db.saveStudentRecord({ ...student, courseId: saved.id, teacherId: teacher.id });
      }
    }
  }
}

// ─── Controller exports ──────────────────────────────────────────────────────

exports.getCourses = async (req, res) => {
  try {
    await ensureGlobalSeeded();
    
    const user = await db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'teacher') {
      const courses = await db.getCoursesByTeacherId(req.user.id);
      res.json(courses);
    } else {
      const studentRecords = await db.getStudentRecordsByStudentId(req.user.id);
      const enrolledCourseIds = studentRecords.map(r => r.courseId);
      
      const allCourses = await db.getAllCourses();
      const enrolledCourses = allCourses.filter(c => enrolledCourseIds.includes(c.id));
      
      const resolved = [];
      for (const course of enrolledCourses) {
        const teacher = await db.getUserById(course.teacherId);
        resolved.push({
          ...course,
          teacherName: teacher ? teacher.fullName : 'Assistant Professor',
          teacherEmail: teacher ? teacher.email : '',
          progress: studentRecords.find(r => r.courseId === course.id)?.progress || 65
        });
      }
      res.json(resolved);
    }
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await db.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const user = await db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'teacher') {
      if (course.teacherId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    } else {
      const records = await db.getStudentRecordsByStudentId(req.user.id);
      const isEnrolled = records.some(r => r.courseId === course.id);
      if (!isEnrolled) return res.status(403).json({ message: 'Not enrolled in this course' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    await ensureGlobalSeeded();
    
    const allCourses = await db.getAllCourses();
    const resolved = [];
    
    for (const course of allCourses) {
      const teacher = await db.getUserById(course.teacherId);
      resolved.push({
        ...course,
        teacher: teacher ? {
          id: teacher.id,
          fullName: teacher.fullName,
          email: teacher.email,
          school: teacher.school,
          bio: teacher.bio,
          specializations: teacher.specializations
        } : null
      });
    }
    res.json(resolved);
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await db.getCourseById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const student = await db.getUserById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student user not found' });

    const records = await db.getStudentRecordsByStudentId(student.id);
    const isEnrolled = records.some(r => r.courseId === courseId);
    if (isEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    await db.saveStudentRecord({
      name: student.fullName || 'Student User',
      email: student.email,
      courseCode: course.code,
      courseId: course.id,
      teacherId: course.teacherId,
      studentId: student.id,
      quizAvg: 85,
      attendance: 100,
      riskLevel: 'High Achiever',
      lastActive: 'Just now',
      progress: 65 // Starting mock progress
    });

    const currentStudents = course.students || 0;
    await db.updateCourse(course.id, {
      students: currentStudents + 1
    });

    await db.saveNotification({
      userId: course.teacherId,
      title: 'New Student Enrollment',
      message: `${student.fullName || student.email} has enrolled in your course: ${course.name}.`,
      type: 'students',
      priority: 'normal',
      icon: 'person_add',
      iconColor: '#006b5f',
      iconBg: '#d1fae5',
      actions: [
        {
          label: 'View Students',
          primary: true
        }
      ]
    });

    await db.saveNotification({
      userId: student.id,
      title: 'Course Enrolled Successfully',
      message: `You are now enrolled in ${course.name}. Welcome!`,
      type: 'system',
      priority: 'normal',
      icon: 'check_circle',
      iconColor: '#006b5f',
      iconBg: '#d1fae5'
    });

    res.json({ message: 'Enrolled successfully', courseId });
  } catch (error) {
    console.error('Enroll course error:', error);
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

exports.submitAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Submission content is required' });
    }

    const student = await db.getUserById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student user not found' });
    }

    const course = await db.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const submission = await db.saveSubmission({
      courseId,
      assignmentId,
      studentId: req.user.id,
      studentName: student.fullName || student.email,
      studentEmail: student.email,
      content,
      status: 'submitted'
    });

    // Create notification for the teacher
    await db.saveNotification({
      userId: course.teacherId,
      title: 'New Assignment Submission',
      message: `${student.fullName || student.email} submitted their assignment for course ${course.code || course.name}.`,
      icon: 'assignment_turned_in',
      iconBg: '#e0f5f2'
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    if (grade === undefined) return res.status(400).json({ message: 'Grade is required' });

    const updated = await db.gradeSubmission(req.params.submissionId, { grade, feedback: feedback || '' });

    // Notify the student that their work has been graded
    try {
      const course = await db.getCourseById(req.params.courseId);
      if (updated.studentId && course) {
        await db.saveNotification({
          userId: updated.studentId,
          title: '📝 Assignment Graded',
          message: `Your submission for "${course.code || course.name}" was graded. Score: ${grade} pts.${feedback ? ` Feedback: "${feedback}"` : ''}`,
          icon: 'grade',
          iconBg: '#d1fae5'
        });
      }
    } catch (notifErr) {
      console.warn('Could not send grade notification:', notifErr.message);
    }

    res.json(updated);
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getStudentAssignments = async (req, res) => {
  try {
    const studentRecords = await db.getStudentRecordsByStudentId(req.user.id);
    const enrolledCourseIds = studentRecords.map(r => r.courseId);
    
    const allAssignments = [];
    for (const courseId of enrolledCourseIds) {
      const course = await db.getCourseById(courseId);
      if (course) {
        const assignments = await db.getAssignmentsByCourseId(courseId);
        // check if student has a submission for each assignment
        for (const a of assignments) {
          const submissions = await db.getSubmissionsByAssignmentId(a.id);
          const studentSub = submissions.find(s => s.studentId === req.user.id);
          allAssignments.push({
            ...a,
            courseName: course.name,
            courseCode: course.code,
            submitted: !!studentSub,
            grade: studentSub ? studentSub.grade : null,
            status: studentSub ? studentSub.status : 'pending',
            feedback: studentSub ? studentSub.feedback : null
          });
        }
      }
    }
    res.json(allAssignments);
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
