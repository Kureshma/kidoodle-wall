const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'mysecretkey',
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const emailNorm = email.trim().toLowerCase();
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [emailNorm]);
    if (existing.length) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username.trim(), emailNorm, hash]
    );
    const user = { id: result.insertId, username: username.trim(), email: emailNorm };
    const token = signToken(user);
    return res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const emailNorm = email.trim().toLowerCase();
    const [rows] = await pool.query(
      'SELECT id, username, email, password FROM users WHERE email = ?',
      [emailNorm]
    );
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const row = rows[0];
    const match = await bcrypt.compare(password, row.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = { id: row.id, username: row.username, email: row.email };
    const token = signToken(user);
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during login' });
  }
}

async function checkEmailForReset(req, res) {
  try {
    const { email } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const emailNorm = email.trim().toLowerCase();
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [emailNorm]);
    if (!rows.length) {
      return res.status(404).json({ message: 'No account found with this email' });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;
    if (!email?.trim() || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const emailNorm = email.trim().toLowerCase();
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [emailNorm]);
    if (!rows.length) {
      return res.status(404).json({ message: 'No account found with this email' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hash, emailNorm]);
    return res.json({ message: 'Password updated. You can now sign in.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login, checkEmailForReset, resetPassword };
