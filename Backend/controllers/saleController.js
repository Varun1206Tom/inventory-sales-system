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

// Get sales history with timeframe filtering (daily, weekly, monthly)
exports.getSalesHistory = async (req, res) => {
    try {
        const { timeframe = 'daily', startDate, endDate } = req.query;
        let query = { status: 'completed' };

        // Set default date range if not provided
        let dateStart = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        let dateEnd = endDate ? new Date(endDate) : new Date();

        query.createdAt = {
            $gte: dateStart,
            $lte: dateEnd
        };

        const sales = await Order.find(query)
            .populate('customer', 'name email address')
            .populate('items.product')
            .sort({ createdAt: -1 });

        // Group sales by timeframe
        const groupedSales = groupByTimeframe(sales, timeframe);
        
        // Calculate metrics
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalItems = sales.reduce((sum, sale) =>
            sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

        // Top products
        const productStats = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (!productStats[item.product._id]) {
                    productStats[item.product._id] = {
                        productName: item.product.name,
                        category: item.product.category,
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
            sales: groupedSales,
            metrics: {
                totalRevenue,
                totalItems,
                totalOrders: sales.length,
                averageOrderValue: sales.length > 0 ? totalRevenue / sales.length : 0,
                timeframe
            },
            topProducts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch sales history' });
    }
};

// Download sales history as CSV with timeframe
exports.downloadSalesHistoryCSV = async (req, res) => {
    try {
        const { timeframe = 'daily', startDate, endDate } = req.query;
        let query = { status: 'completed' };

        // Set default date range
        let dateStart = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        let dateEnd = endDate ? new Date(endDate) : new Date();

        query.createdAt = {
            $gte: dateStart,
            $lte: dateEnd
        };

        const sales = await Order.find(query)
            .populate('customer', 'name email address')
            .populate('items.product')
            .sort({ createdAt: -1 });

        const data = [];
        sales.forEach(sale => {
            const saleDate = new Date(sale.createdAt);
            const dateStr = formatDateByTimeframe(saleDate, timeframe);
            
            sale.items.forEach((item) => {
                data.push({
                    'Period': dateStr,
                    'Order ID': sale._id.toString().slice(-6),
                    'Customer Name': sale.customer.name,
                    'Customer Email': sale.customer.email,
                    'Product Name': item.product.name,
                    'Category': item.product.category,
                    'Quantity': item.quantity,
                    'Unit Price': '₹' + item.price.toFixed(2),
                    'Line Total': '₹' + (item.price * item.quantity).toFixed(2),
                    'Order Total': '₹' + sale.totalAmount.toFixed(2),
                    'Order Date': saleDate.toLocaleDateString('en-IN'),
                    'Order Time': saleDate.toLocaleTimeString('en-IN'),
                    'Customer Address': sale.customer.address ? 
                        `${sale.customer.address.street}, ${sale.customer.address.city}, ${sale.customer.address.state} ${sale.customer.address.postalCode}` : 
                        'N/A'
                });
            });
        });

        if (data.length === 0) {
            return res.status(400).json({ message: 'No sales data found for the specified period' });
        }

        const parser = new Parser();
        const csv = parser.parse(data);

        const dateRange = `${dateStart.toISOString().split('T')[0]}_to_${dateEnd.toISOString().split('T')[0]}`;
        res.header('Content-Type', 'text/csv');
        res.attachment(`sales-history-${timeframe}-${dateRange}.csv`);
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to download sales history CSV' });
    }
};

// Helper function to group sales by timeframe
function groupByTimeframe(sales, timeframe) {
    const grouped = {};

    sales.forEach(sale => {
        const saleDate = new Date(sale.createdAt);
        let key;

        if (timeframe === 'daily') {
            key = saleDate.toLocaleDateString('en-IN');
        } else if (timeframe === 'weekly') {
            const weekStart = new Date(saleDate);
            weekStart.setDate(saleDate.getDate() - saleDate.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            key = `${weekStart.toLocaleDateString('en-IN')} - ${weekEnd.toLocaleDateString('en-IN')}`;
        } else if (timeframe === 'monthly') {
            key = saleDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
        }

        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(sale);
    });

    return grouped;
}

// Helper function to format date by timeframe
function formatDateByTimeframe(date, timeframe) {
    if (timeframe === 'daily') {
        return date.toLocaleDateString('en-IN');
    } else if (timeframe === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-IN')} - ${weekEnd.toLocaleDateString('en-IN')}`;
    } else if (timeframe === 'monthly') {
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
    }
    return date.toLocaleDateString('en-IN');
}