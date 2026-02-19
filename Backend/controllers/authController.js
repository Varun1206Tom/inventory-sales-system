const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService');

exports.register = async (req, res) => {
  const { name, email, password, address } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "customer",
    address
  });

  res.json(user);
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  // HARDCODED ADMIN LOGIN
  if (email === "admin@gmail.com" && password === "admin") {

    const token = jwt.sign(
      { id: "admin-id", role: "admin" },
      process.env.JWT_SECRET
    );

    return res.json({
      token,
      user: { name: "admin@gmail.com", role: "admin" }
    });
  }

  // Normal user login
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  const html = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;
  await sendEmail(user.email, 'Password Reset', html);

  res.json({ message: "Reset email sent" });
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};

// Update profile
exports.updateProfile = async (req, res) => {
  const { name, address } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  if (address) {
    user.address = { ...user.address, ...address };
  }
  await user.save();

  res.json(user);
};

// Get all users (for admin/staff)
exports.getUsers = async (req, res) => {
  try {
    console.log('getUsers called - User:', req.user);
    const users = await User.find().select('-password -resetToken -resetTokenExpiry');
    console.log('Users found:', users.length);
    res.json(users);
  } catch (err) {
    console.error('Error in getUsers:', err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};