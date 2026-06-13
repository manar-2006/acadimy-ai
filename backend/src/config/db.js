const fs = require('fs/promises');
const path = require('path');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '../../data.json');

let dbPromise = Promise.resolve();

// Mutex / Queue wrapper to prevent concurrent read-modify-write race conditions
function runLocked(fn) {
  return (...args) => {
    const nextPromise = dbPromise.then(() => fn(...args));
    dbPromise = nextPromise.catch(() => { });
    return nextPromise;
  };
}

async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Ensure all collections exist
    if (!parsed.users) parsed.users = [];
    if (!parsed.analyses) parsed.analyses = [];
    if (!parsed.plannerEvents) parsed.plannerEvents = [];
    if (!parsed.posts) parsed.posts = [];
    if (!parsed.notifications) parsed.notifications = [];
    if (!parsed.courses) parsed.courses = [];
    if (!parsed.assignments) parsed.assignments = [];
    if (!parsed.studentRecords) parsed.studentRecords = [];
    if (!parsed.submissions) parsed.submissions = [];
    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        users: [],
        analyses: [],
        plannerEvents: [],
        posts: [],
        notifications: [],
        courses: [],
        assignments: [],
        studentRecords: [],
        submissions: []
      };
    }
    console.error('Database file read/parse error. Creating backup...', error);
    try {
      const backupPath = `${DB_FILE}.corrupted.${Date.now()}`;
      await fs.copyFile(DB_FILE, backupPath);
      console.log(`Backup created at: ${backupPath}`);
    } catch (backupError) {
      console.error('Failed to create database backup:', backupError);
    }
    return {
      users: [],
      analyses: [],
      plannerEvents: [],
      posts: [],
      notifications: [],
      courses: [],
      assignments: [],
      studentRecords: [],
      submissions: []
    };
  }
}

async function writeDB(data) {
  // Ensure the database directory exists
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const getUsers = async () => {
  const db = await readDB();
  return db.users || [];
};

const getUserByEmail = async (email) => {
  const db = await readDB();
  return (db.users || []).find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
};

const getUserById = async (id) => {
  const db = await readDB();
  return (db.users || []).find(u => u.id === id);
};

const saveUser = async (user) => {
  const db = await readDB();
  if (!db.users) db.users = [];

  const exists = (db.users || []).some(u => u.email && u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) {
    throw new Error('User already exists');
  }

  const newUser = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...user
  };
  db.users.push(newUser);
  await writeDB(db);
  return newUser;
};

const getAnalysesByUserId = async (userId) => {
  const db = await readDB();
  return (db.analyses || []).filter(a => a.userId === userId);
};

const getAnalysisById = async (id) => {
  const db = await readDB();
  return (db.analyses || []).find(a => a.id === id);
};

const saveAnalysis = async (analysis) => {
  const db = await readDB();
  if (!db.analyses) db.analyses = [];
  const newAnalysis = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...analysis
  };
  db.analyses.push(newAnalysis);
  await writeDB(db);
  return newAnalysis;
};

const updateUser = async (id, updatedFields) => {
  const db = await readDB();
  if (!db.users) db.users = [];
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }

  // Prevent accidental modification of user ID, email, or password hash through general updates
  const { id: _, email: __, passwordHash: ___, ...safeFields } = updatedFields;
  db.users[index] = {
    ...db.users[index],
    ...safeFields,
    updatedAt: new Date().toISOString()
  };
  await writeDB(db);
  return db.users[index];
};

const updatePassword = async (id, passwordHash) => {
  const db = await readDB();
  if (!db.users) db.users = [];
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }
  db.users[index] = {
    ...db.users[index],
    passwordHash,
    updatedAt: new Date().toISOString()
  };
  await writeDB(db);
  return db.users[index];
};

const getPlannerEventsByUserId = async (userId) => {
  const db = await readDB();
  return (db.plannerEvents || []).filter(e => e.userId === userId);
};

const savePlannerEvent = async (event) => {
  const db = await readDB();
  if (!db.plannerEvents) db.plannerEvents = [];
  const newEvent = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...event
  };
  db.plannerEvents.push(newEvent);
  await writeDB(db);
  return newEvent;
};

const deletePlannerEvent = async (id) => {
  const db = await readDB();
  if (!db.plannerEvents) db.plannerEvents = [];
  db.plannerEvents = db.plannerEvents.filter(e => e.id !== id);
  await writeDB(db);
  return true;
};

const getPosts = async () => {
  const db = await readDB();
  return db.posts || [];
};

const savePost = async (post) => {
  const db = await readDB();
  if (!db.posts) db.posts = [];
  const newPost = {
    id: Date.now().toString(),
    likes: 0,
    replies: [],
    timestamp: new Date().toISOString(),
    ...post
  };
  db.posts.unshift(newPost);
  await writeDB(db);
  return newPost;
};

const addReply = async (postId, reply) => {
  const db = await readDB();
  if (!db.posts) db.posts = [];
  const index = db.posts.findIndex(p => p.id === postId);
  if (index !== -1) {
    if (!db.posts[index].replies) db.posts[index].replies = [];
    db.posts[index].replies.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...reply
    });
    await writeDB(db);
    return db.posts[index];
  }
  throw new Error('Post not found');
};

const getNotificationsByUserId = async (userId) => {
  const db = await readDB();
  return (db.notifications || []).filter(n => n.userId === userId);
};

const saveNotification = async (notif) => {
  const db = await readDB();
  if (!db.notifications) db.notifications = [];
  const newNotif = {
    id: Date.now().toString(),
    read: false,
    createdAt: new Date().toISOString(),
    ...notif
  };
  db.notifications.unshift(newNotif);
  await writeDB(db);
  return newNotif;
};

const markNotificationRead = async (id) => {
  const db = await readDB();
  if (!db.notifications) db.notifications = [];
  const index = db.notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    db.notifications[index].read = true;
    await writeDB(db);
    return db.notifications[index];
  }
  throw new Error('Notification not found');
};

const getCoursesByTeacherId = async (teacherId) => {
  const db = await readDB();
  return (db.courses || []).filter(c => c.teacherId === teacherId);
};

const saveCourse = async (course) => {
  const db = await readDB();
  if (!db.courses) db.courses = [];
  const newCourse = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...course
  };
  db.courses.push(newCourse);
  await writeDB(db);
  return newCourse;
};

const getCourseById = async (id) => {
  const db = await readDB();
  return (db.courses || []).find(c => c.id === id);
};

const updateCourse = async (id, updates) => {
  const db = await readDB();
  if (!db.courses) db.courses = [];
  const index = db.courses.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Course not found');
  }
  const { id: _, teacherId: __, ...safeFields } = updates;
  db.courses[index] = {
    ...db.courses[index],
    ...safeFields,
    updatedAt: new Date().toISOString()
  };
  await writeDB(db);
  return db.courses[index];
};

const deleteCourse = async (id) => {
  const db = await readDB();
  if (!db.courses) db.courses = [];
  db.courses = db.courses.filter(c => c.id !== id);
  db.assignments = (db.assignments || []).filter(a => a.courseId !== id);
  db.studentRecords = (db.studentRecords || []).filter(s => s.courseId !== id);
  db.submissions = (db.submissions || []).filter(s => s.courseId !== id);
  await writeDB(db);
  return true;
};

const saveAssignment = async (assignment) => {
  const db = await readDB();
  if (!db.assignments) db.assignments = [];
  const newAssignment = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...assignment
  };
  db.assignments.push(newAssignment);
  await writeDB(db);
  return newAssignment;
};

const getAssignmentsByCourseId = async (courseId) => {
  const db = await readDB();
  return (db.assignments || []).filter(a => a.courseId === courseId);
};

const saveStudentRecord = async (record) => {
  const db = await readDB();
  if (!db.studentRecords) db.studentRecords = [];
  const newRecord = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...record
  };
  db.studentRecords.push(newRecord);
  await writeDB(db);
  return newRecord;
};

const getStudentRecordsByCourseId = async (courseId) => {
  const db = await readDB();
  return (db.studentRecords || []).filter(s => s.courseId === courseId);
};

const getAllStudentRecordsByTeacher = async (teacherId) => {
  const db = await readDB();
  return (db.studentRecords || []).filter(s => s.teacherId === teacherId);
};

const saveSubmission = async (submission) => {
  const db = await readDB();
  if (!db.submissions) db.submissions = [];
  const newSubmission = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...submission
  };
  db.submissions.push(newSubmission);
  await writeDB(db);
  return newSubmission;
};

const getSubmissionsByAssignmentId = async (assignmentId) => {
  const db = await readDB();
  return (db.submissions || []).filter(s => s.assignmentId === assignmentId);
};

const gradeSubmission = async (submissionId, updates) => {
  const db = await readDB();
  if (!db.submissions) db.submissions = [];
  const index = db.submissions.findIndex(s => s.id === submissionId);
  if (index === -1) {
    throw new Error('Submission not found');
  }
  db.submissions[index] = {
    ...db.submissions[index],
    grade: updates.grade,
    feedback: updates.feedback || '',
    gradedAt: new Date().toISOString(),
    status: 'graded'
  };

  const assignmentId = db.submissions[index].assignmentId;
  const assignments = db.assignments || [];
  const aIdx = assignments.findIndex(a => a.id === assignmentId);
  if (aIdx !== -1) {
    const assignmentSubmissions = db.submissions.filter(s => s.assignmentId === assignmentId);
    assignments[aIdx].submissions = assignmentSubmissions.length;
    assignments[aIdx].graded = assignmentSubmissions.filter(s => s.status === 'graded').length;
  }

  await writeDB(db);
  return db.submissions[index];
};

module.exports = {
  getUsers: runLocked(getUsers),
  getUserByEmail: runLocked(getUserByEmail),
  getUserById: runLocked(getUserById),
  saveUser: runLocked(saveUser),
  getAnalysesByUserId: runLocked(getAnalysesByUserId),
  getAnalysisById: runLocked(getAnalysisById),
  saveAnalysis: runLocked(saveAnalysis),
  updateUser: runLocked(updateUser),
  updatePassword: runLocked(updatePassword),
  getPlannerEventsByUserId: runLocked(getPlannerEventsByUserId),
  savePlannerEvent: runLocked(savePlannerEvent),
  deletePlannerEvent: runLocked(deletePlannerEvent),
  getPosts: runLocked(getPosts),
  savePost: runLocked(savePost),
  addReply: runLocked(addReply),
  getNotificationsByUserId: runLocked(getNotificationsByUserId),
  saveNotification: runLocked(saveNotification),
  markNotificationRead: runLocked(markNotificationRead),
  
  getCoursesByTeacherId: runLocked(getCoursesByTeacherId),
  saveCourse: runLocked(saveCourse),
  getCourseById: runLocked(getCourseById),
  updateCourse: runLocked(updateCourse),
  deleteCourse: runLocked(deleteCourse),
  saveAssignment: runLocked(saveAssignment),
  getAssignmentsByCourseId: runLocked(getAssignmentsByCourseId),
  saveStudentRecord: runLocked(saveStudentRecord),
  getStudentRecordsByCourseId: runLocked(getStudentRecordsByCourseId),
  getAllStudentRecordsByTeacher: runLocked(getAllStudentRecordsByTeacher),
  saveSubmission: runLocked(saveSubmission),
  getSubmissionsByAssignmentId: runLocked(getSubmissionsByAssignmentId),
  gradeSubmission: runLocked(gradeSubmission)
};
