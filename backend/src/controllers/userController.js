const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, school, year, major, bio, specializations, gpa, minor } = req.body;
    
    const updatedUser = await db.updateUser(req.user.id, {
      fullName: fullName || '',
      school: school || '',
      year: year || '',
      major: major || '',
      bio: bio || '',
      specializations: Array.isArray(specializations) ? specializations : [],
      gpa: gpa || '',
      minor: minor || '',
    });

    const { passwordHash: _, ...userWithoutHash } = updatedUser;
    res.json(userWithoutHash);
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.updatePassword(req.user.id, newHash);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
