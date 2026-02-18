const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "customer"  
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