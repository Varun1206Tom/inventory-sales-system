const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: { type: String, default: 'pending' },
  statusHistory: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
      updatedByName: { type: String } // Store name/email for admin or when ObjectId is not available
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);