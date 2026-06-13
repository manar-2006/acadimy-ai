const db = require('../config/db');

// ─── Teacher Analytics ───────────────────────────────────────────────────────

exports.getTeacherAnalytics = async (req, res) => {
  try {
    const courses = await db.getCoursesByTeacherId(req.user.id);

    const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
    const avgCompletion = courses.length
      ? Math.round(courses.reduce((sum, c) => sum + (c.completion || 0), 0) / courses.length)
      : 0;

    const assignments = [];
    for (const course of courses) {
      const courseAssignments = await db.getAssignmentsByCourseId(course.id);
      assignments.push(...courseAssignments);
    }
    const pendingGrades = assignments.reduce((sum, a) => sum + Math.max(0, (a.submissions || 0) - (a.graded || 0)), 0);

    const studentRecords = await db.getAllStudentRecordsByTeacher(req.user.id);
    const atRiskCount = studentRecords.filter(s => s.riskLevel === 'At Risk').length;

    // Weekly engagement trend (mock data for now)
    const engagementTrend = [
      { week: 'Week 8',  engagement: 68 },
      { week: 'Week 9',  engagement: 74 },
      { week: 'Week 10', engagement: 71 },
      { week: 'Week 11', engagement: 79 },
      { week: 'Week 12', engagement: 74 },
    ];

    // Quiz score distribution across all courses
    const scoreDistribution = [
      { range: '0–20%',  count: 2  },
      { range: '21–40%', count: 6  },
      { range: '41–60%', count: 18 },
      { range: '61–80%', count: 45 },
      { range: '81–100%', count: 29 },
    ];

    res.json({
      summary: {
        totalStudents,
        activeCourses: courses.length,
        avgEngagement: avgCompletion,
        pendingGrades,
        atRiskCount,
      },
      courses: courses.map(c => ({
        id: c.id,
        name: c.name,
        code: c.code,
        students: c.students || 0,
        completion: c.completion || 0,
        color: c.color || '#002045',
      })),
      engagementTrend,
      scoreDistribution,
    });
  } catch (error) {
    console.error('Teacher analytics error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getCourseAnalytics = async (req, res) => {
  try {
    const course = await db.getCourseById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const assignments = await db.getAssignmentsByCourseId(req.params.courseId);
    const studentRecords = await db.getStudentRecordsByCourseId(req.params.courseId);

    res.json({
      course,
      assignments,
      stats: {
        totalStudents: course.students || 0,
        avgQuizScore: studentRecords.length
          ? Math.round(studentRecords.reduce((s, r) => s + (r.quizAvg || 0), 0) / studentRecords.length)
          : 0,
        avgAttendance: studentRecords.length
          ? Math.round(studentRecords.reduce((s, r) => s + (r.attendance || 0), 0) / studentRecords.length)
          : 0,
        atRisk: studentRecords.filter(s => s.riskLevel === 'At Risk').length,
      },
    });
  } catch (error) {
    console.error('Course analytics error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getStudentPerformance = async (req, res) => {
  try {
    const studentRecords = await db.getStudentRecordsByCourseId(req.params.courseId);
    res.json(studentRecords);
  } catch (error) {
    console.error('Student performance error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// ─── Student Analytics (for logged-in student) ───────────────────────────────

exports.getStudentAnalytics = async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Simulated analytics for the student
    res.json({
      weeklyStudyHours: [
        { day: 'Mon', hours: 3.5 },
        { day: 'Tue', hours: 5 },
        { day: 'Wed', hours: 2 },
        { day: 'Thu', hours: 4 },
        { day: 'Fri', hours: 6 },
        { day: 'Sat', hours: 1.5 },
        { day: 'Sun', hours: 2.5 },
      ],
      coursePerformance: [
        { course: 'CS-402',  score: 84, assignments: 12, completed: 10 },
        { course: 'CS-520',  score: 91, assignments: 8,  completed: 8  },
        { course: 'CS-301',  score: 77, assignments: 15, completed: 12 },
      ],
      recentActivity: [
        { date: 'Today',     type: 'quiz',    description: 'Completed Neural Networks Quiz – 88%' },
        { date: 'Yesterday', type: 'upload',  description: 'Uploaded OS lecture slides for analysis' },
        { date: '2 days ago',type: 'planner', description: 'Added study session for Data Structures' },
      ],
      streakDays: 7,
      totalHoursThisWeek: 24.5,
    });
  } catch (error) {
    console.error('Student analytics error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
