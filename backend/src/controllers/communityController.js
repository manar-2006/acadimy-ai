const db = require('../config/db');

exports.getPosts = async (req, res) => {
  try {
    const posts = await db.getPosts();
    
    // Seed initial posts if DB is empty
    if (posts.length === 0) {
      const seeded = [
        {
          id: 'seed-1',
          authorName: 'Sarah Jenkins',
          authorAvatar: 'SJ',
          content: 'Does anyone have a study guide for the upcoming Quantum Physics mid-term? I\'m struggling with superposition equations.',
          likes: 5,
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          replies: [
            {
              id: 'reply-1',
              authorName: 'Alex Sterling',
              content: 'Yes! Check out the PDF Analyzer page. I uploaded my lecture 4 notes there and the AI summary is super helpful.',
              timestamp: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        },
        {
          id: 'seed-2',
          authorName: 'David Cho',
          authorAvatar: 'DC',
          content: 'The study planner Pomodoro feature is awesome. Managed to get 4 hours of focus done today!',
          likes: 8,
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
          replies: []
        }
      ];
      
      for (const p of seeded) {
        await db.savePost(p);
      }
      return res.json(await db.getPosts());
    }

    res.json(posts);
  } catch (error) {
    console.error('Fetch posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const user = await db.getUserById(req.user.id);
    const authorName = user ? user.fullName || user.email.split('@')[0] : 'Anonymous';
    
    const authorAvatar = authorName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newPost = await db.savePost({
      userId: req.user.id,
      authorName,
      authorAvatar,
      content
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    const user = await db.getUserById(req.user.id);
    const authorName = user ? user.fullName || user.email.split('@')[0] : 'Anonymous';

    const updatedPost = await db.addReply(id, {
      userId: req.user.id,
      authorName,
      content
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
