const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ADMIN_EMAIL, ADMIN_PASSWORD_HASHED } = require('../adminConfig');


// @route   POST /api/register
// @desc    Register a user
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (forced role to 'user')
    user = new User({
      name,
      email,
      password,
      role: 'user',
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/admin-login
// @desc    Authenticate admin & get token
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check against fixed admin email
    if (email !== ADMIN_EMAIL) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Compare password with hashed admin password
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASHED);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Create JWT payload for admin
    const payload = {
      user: {
        id: 'admin-fixed-id',
        role: 'admin',
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '12h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: 'admin-fixed-id', name: 'Campus Admin', email: ADMIN_EMAIL, role: 'admin' } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
