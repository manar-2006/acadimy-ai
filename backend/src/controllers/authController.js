const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.signup = async (req, res) => {
  try {
    const { email, password, fullName, school, year, major, role, bio, specializations } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.saveUser({
      email,
      passwordHash,
      fullName: fullName || '',
      school: school || '',
      year: year || '',
      major: major || '',
      role: role || 'student',
      bio: bio || '',
      specializations: Array.isArray(specializations) ? specializations : [],
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...userWithoutHash } = user;

    res.status(201).json({
      token,
      user: userWithoutHash
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message || 'Server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...userWithoutHash } = user;

    res.json({
      token,
      user: userWithoutHash
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { passwordHash: _, ...userWithoutHash } = user;
    res.json(userWithoutHash);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetCodes = new Map();

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email address' });
    }

    // Generate a 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 15 * 60 * 1000; // 15 mins

    resetCodes.set(email.toLowerCase(), { code, expires });

    console.log(`[RESET CODE] Email: ${email}, Code: ${code}`);

    // Send the verification code via email if configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mailOptions = {
        from: `"EduSphere AI Portal" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'EduSphere AI Password Reset Verification Code',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e0e3e5; border-radius: 16px; background-color: #ffffff; color: #191c1e;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 28px; font-weight: bold; color: #002045;">EduSphere <span style="color: #006b5f;">AI</span></span>
            </div>
            <h2 style="font-size: 20px; font-weight: bold; color: #002045; margin-top: 0; margin-bottom: 12px; text-align: center;">Reset Your Password</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #43474e; margin-bottom: 24px;">We received a request to recover the password associated with this email. Use the 6-digit verification code below to set a new password. This code will expire in <strong>15 minutes</strong>.</p>
            <div style="background-color: #f2f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #006b5f; font-family: monospace;">${code}</span>
            </div>
            <p style="font-size: 13px; line-height: 1.6; color: #74777f; margin-bottom: 24px; text-align: center;">If you did not request a password reset, please ignore this email. Your password remains secure.</p>
            <hr style="border: 0; border-top: 1px solid #e0e3e5; margin: 24px 0;" />
            <p style="font-size: 11px; text-align: center; color: #74777f; margin: 0;">This is an automated security transmission. Please do not reply directly.</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SENT] Verification code successfully sent to ${email}`);
      return res.json({
        message: 'Verification code sent successfully'
      });
    } else {
      console.warn("WARNING: SMTP_USER and SMTP_PASS are not configured in your .env file. The verification code was only logged to the console.");
      return res.json({
        message: 'Verification code generated successfully',
        code: code,
        devMode: true
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, verification code, and new password are required' });
    }

    const cached = resetCodes.get(email.toLowerCase());
    if (!cached) {
      return res.status(400).json({ message: 'No verification code found or it has expired' });
    }

    if (cached.code !== code.trim()) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (Date.now() > cached.expires) {
      resetCodes.delete(email.toLowerCase());
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.updatePassword(user.id, newHash);

    // Clean up code
    resetCodes.delete(email.toLowerCase());

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
