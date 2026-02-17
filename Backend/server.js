require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

app.use('/api/staff', require('./routes/staffdashboardRoutes')); // for dashboard/orders/sales


app.listen(5000, () => console.log("Server running"));