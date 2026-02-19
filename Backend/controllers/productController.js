const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

exports.upload = upload.single('image'); // Middleware for single file upload

exports.addProduct = async (req, res) => {
    try {
        const { name, price, mrp, discount, productTag, stock, lowStockThreshold, description, category } = req.body;

        // Validation
        if (discount < 0 || discount > 100) {
            return res.status(400).json({ message: 'Discount must be between 0 and 100' });
        }
        if (mrp < price) {
            return res.status(400).json({ message: 'MRP should be greater than or equal to selling price' });
        }

        const image = req.file ? req.file.filename : '';

        const product = await Product.create({
            name,
            price,
            mrp,
            discount,
            productTag,
            stock,
            lowStockThreshold: lowStockThreshold || 5,
            description,
            category,
            image
        });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: "Failed to add product" });
    }
};

exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: 'Invalid product id' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, mrp, discount, productTag, stock, description, category } = req.body;

        // Validation
        if (discount < 0 || discount > 100) {
            return res.status(400).json({ message: 'Discount must be between 0 and 100' });
        }
        if (mrp < price) {
            return res.status(400).json({ message: 'MRP should be greater than or equal to selling price' });
        }

        const updateData = { name, price, mrp, discount, productTag, stock, description, category };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(product);
    } catch {
        res.status(400).json({ message: "Update failed" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch {
        res.status(400).json({ message: "Delete failed" });
    }
};

exports.getLowStockProducts = async (req, res) => {
    const threshold = 5; // We can set according to requirements

    const products = await Product.find({
        stock: { $lte: threshold }
    });

    res.json(products);
};
