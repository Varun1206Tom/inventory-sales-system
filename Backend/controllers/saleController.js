const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { Parser } = require('json2csv');

exports.getSalesReport = async (req, res) => {
    const sales = await Sale.find().populate('product');

    res.json(sales);
};

exports.downloadSalesCSV = async (req, res) => {
    const sales = await Sale.find().populate('product');

    const data = sales.map(s => ({
        product: s.product.name,
        quantity: s.quantity,
        total: s.total,
        date: s.createdAt
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('sales-report.csv');
    res.send(csv);
};