const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: "Failed to add product" });
    }
};

exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
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
