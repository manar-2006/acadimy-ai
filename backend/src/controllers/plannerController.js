const db = require('../config/db');

exports.getEvents = async (req, res) => {
  try {
    const list = await db.getPlannerEventsByUserId(req.user.id);
    res.json(list);
  } catch (error) {
    console.error('Fetch planner events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, date, time, type, description } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const newEvent = await db.savePlannerEvent({
      userId: req.user.id,
      title,
      date,
      time: time || '12:00',
      type: type || 'Study',
      description: description || ''
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Create planner event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const success = await db.deletePlannerEvent(req.params.id);
    res.json({ success });
  } catch (error) {
    console.error('Delete planner event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
