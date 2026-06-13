const db = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    const list = await db.getNotificationsByUserId(req.user.id);
    
    // Seed initial notifications if empty
    if (list.length === 0) {
      let seeded = [];
      if (user && user.role === 'teacher') {
        seeded = [
          {
            userId: req.user.id,
            title: '⚠️ At-Risk Student Alert',
            message: 'Jordan Smith (CS-402) has missed 3 consecutive lab sessions and their quiz average has dropped to 45%. Immediate intervention is recommended.',
            type: 'students',
            priority: 'high',
            icon: 'warning',
            iconColor: '#ba1a1a',
            iconBg: '#ffdad6',
            actions: [{ label: 'View Student', primary: true }, { label: 'Send Message', primary: false }]
          },
          {
            userId: req.user.id,
            title: 'New Assignment Submission',
            message: 'Alex Chen submitted OS Assignment 4 — "Thread Scheduling Algorithms" in CS-402. Awaiting your review and grading.',
            type: 'students',
            priority: 'normal',
            icon: 'assignment_turned_in',
            iconColor: '#006b5f',
            iconBg: '#d1fae5',
            actions: [{ label: 'Grade Now', primary: true }]
          },
          {
            userId: req.user.id,
            title: '3 New Forum Questions',
            message: 'Students in CS-520 (Machine Learning) have posted 3 unanswered questions in the discussion board. Topics include gradient descent and vanishing gradients.',
            type: 'courses',
            priority: 'normal',
            icon: 'forum',
            iconColor: '#09007b',
            iconBg: '#e1e0ff',
            actions: [{ label: 'Open Forum', primary: true }]
          },
          {
            userId: req.user.id,
            title: 'AI Insight: Engagement Drop Detected',
            message: 'CS-402 has shown a 15% drop in participation over the past two weeks. EduSphere AI suggests generating a review session or interactive quiz to re-engage students.',
            type: 'ai',
            priority: 'normal',
            icon: 'auto_awesome',
            iconColor: '#006b5f',
            iconBg: '#62fae3',
            actions: [{ label: 'Generate Quiz', primary: true }, { label: 'View Analytics', primary: false }]
          },
          {
            userId: req.user.id,
            title: 'Grading Deadline: ML Project',
            message: '14 ML Project submissions in CS-520 are pending your grade. The grading deadline is tomorrow at 5:00 PM. Students are waiting for feedback.',
            type: 'courses',
            priority: 'high',
            icon: 'rate_review',
            iconColor: '#ba1a1a',
            iconBg: '#ffdad6',
            actions: [{ label: 'Start Grading', primary: true }]
          }
        ];
      } else {
        seeded = [
          {
            userId: req.user.id,
            title: 'Welcome to EduSphere AI!',
            message: 'Explore your student dashboard, schedule planner, and upload lecture slides to start analyzing.',
            type: 'system'
          },
          {
            userId: req.user.id,
            title: 'Quantum Physics Mid-term Study Alert',
            message: 'Don\'t forget your scheduled review session tomorrow morning at 9:00 AM.',
            type: 'deadline'
          }
        ];
      }
      
      for (const n of seeded) {
        await db.saveNotification(n);
      }
      return res.json(await db.getNotificationsByUserId(req.user.id));
    }
    
    res.json(list);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const updated = await db.markNotificationRead(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, priority, icon, iconColor, iconBg, actions, userId } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }
    const notif = await db.saveNotification({
      userId: userId || req.user.id,
      title,
      message,
      type: type || 'system',
      priority: priority || 'normal',
      icon: icon || 'notifications',
      iconColor: iconColor || '#002045',
      iconBg: iconBg || '#eceef0',
      actions: actions || null
    });
    res.status(201).json(notif);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
