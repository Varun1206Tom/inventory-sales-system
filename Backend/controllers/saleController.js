const Sale = require('../models/Sale');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { Parser } = require('json2csv');

// Get detailed sales report
exports.getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, category, productId } = req.query;
        let query = { status: 'completed' };

        // Filter by date range
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        let sales = await Order.find(query)
            .populate('customer', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        // Filter by category if provided
        if (category && category !== 'all') {
            sales = sales.filter(sale =>
                sale.items.some(item => item.product.category === category)
            );
        }

        // Filter by product if provided
        if (productId) {
            sales = sales.filter(sale =>
                sale.items.some(item => item.product._id.toString() === productId)
            );
        }

        // Calculate metrics
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalItems = sales.reduce((sum, sale) =>
            sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

        // Group by date for trend
        const trendData = {};
        sales.forEach(sale => {
            const date = new Date(sale.createdAt).toLocaleDateString();
            trendData[date] = (trendData[date] || 0) + sale.totalAmount;
        });

        // Top products
        const productStats = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (!productStats[item.product._id]) {
                    productStats[item.product._id] = {
                        productName: item.product.name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productStats[item.product._id].quantity += item.quantity;
                productStats[item.product._id].revenue += item.price * item.quantity;
            });
        });

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        res.json({
            sales,
            metrics: {
                totalRevenue,
                totalItems,
                totalOrders: sales.length,
                averageOrderValue: sales.length > 0 ? totalRevenue / sales.length : 0
            },
            trend: trendData,
            topProducts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch sales report' });
    }
};

// Download sales report as CSV
exports.downloadSalesCSV = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = { status: 'completed' };

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const sales = await Order.find(query)
            .populate('customer', 'name email')
            .populate('items.product');

        const data = [];
        sales.forEach(sale => {
            sale.items.forEach((item, idx) => {
                data.push({
                    OrderId: sale._id.toString().slice(-6),
                    Customer: sale.customer.name,
                    Email: sale.customer.email,
                    Product: item.product.name,
                    Category: item.product.category,
                    Quantity: item.quantity,
                    UnitPrice: item.price,
                    Total: item.price * item.quantity,
                    OrderTotal: sale.totalAmount,
                    Date: new Date(sale.createdAt).toLocaleDateString(),
                    Status: sale.status
                });
            });
        });

        const parser = new Parser();
        const csv = parser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment(`sales-report-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to download CSV' });
    }
};