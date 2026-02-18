const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, default: 0 },
    discount: { type: Number, default: 0 }, // percentage
    productTag: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    description: String,
    category: { type: String, required: true },
    image: { type: String, default: '' } // This will store the filename/path
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);