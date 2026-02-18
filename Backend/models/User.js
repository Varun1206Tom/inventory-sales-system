const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);