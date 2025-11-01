require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const testRoutes = require('./src/routes/testRoutes');
const passwordResetRoutes = require('./src/routes/passwordResetRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');
const govSchemesRoutes = require('./src/routes/govSchemesRoutes');
const marketPriceRoutes = require('./src/routes/marketPriceRoutes');
const applicationsRoutes = require('./src/routes/applicationRoutes');
const path = require('path');

const app = express();
const { authMiddleware } = require('./src/middleware/auth');

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'smartsheti-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/password', passwordResetRoutes);
app.use('/api/locations', locationRoutes);
// Protect API routes that should require authentication
// If you want specific endpoints to remain public, move them outside the middleware wrapper.
app.use('/api/weather', authMiddleware, weatherRoutes);
app.use('/api/schemes', authMiddleware, govSchemesRoutes);
app.use('/api/market', authMiddleware, marketPriceRoutes);
app.use('/api/applications', authMiddleware, applicationsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});