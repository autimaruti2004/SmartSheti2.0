const jwt = require('jsonwebtoken');
const {
  createUser,
  findUserByMobile,
  findUserById,
  verifyPassword,
} = require('../models/userModel');
const EmailService = require('../services/emailService');

function signToken(user) {
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  return jwt.sign(
    { sub: String(user._id), mobile: user.mobile },
    secret,
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  try {
    const { name, address, mobile, email, gender, password } = req.body || {};
    if (!name || !mobile || !password) {
      return res.status(400).json({ message: 'name, mobile and password are required' });
    }

    const existing = await findUserByMobile(mobile);
    if (existing) {
      return res.status(409).json({ message: 'Mobile already registered' });
    }

    const user = await createUser({ name, address, mobile, email, gender, password });
    const token = signToken(user);

    // Welcome email पाठवा
    if (email) {
      try {
        await EmailService.sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.error('Welcome email sending failed:', emailError);
        // Email error doesn't block registration
      }
    }

    return res.status(201).json({
      token,
      user: { _id: user._id, name, address, mobile, email: email || null, gender: gender || null },
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate key', error: err });
    }
    return res.status(500).json({ message: 'Registration failed', error: String(err) });
  }
}

async function login(req, res) {
  try {
    const { mobile, password } = req.body || {};
    if (!mobile || !password) {
      return res.status(400).json({ message: 'mobile and password are required' });
    }
    const user = await findUserByMobile(mobile);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await verifyPassword(user, password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user);
    return res.json({
      token,
      user: { _id: user._id, name: user.name, address: user.address, mobile: user.mobile, email: user.email, gender: user.gender },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: String(err) });
  }
}

async function me(req, res) {
  try {
    const userId = req.user && req.user.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: { _id: user._id, name: user.name, address: user.address, mobile: user.mobile, email: user.email, gender: user.gender } });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch profile', error: String(err) });
  }
}

module.exports = { register, login, me };


