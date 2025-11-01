require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const testRoutes = require('./src/routes/testRoutes');
const passwordResetRoutes = require('./src/routes/passwordResetRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');
const govSchemesRoutes = require('./src/routes/govSchemesRoutes');
const marketPriceRoutes = require('./src/routes/marketPriceRoutes');
const applicationsRoutes = require('./src/routes/applicationRoutes');
const path = require('path');

const app = express();

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
app.use('/api/weather', weatherRoutes);
app.use('/api/schemes', govSchemesRoutes);
app.use('/api/market', marketPriceRoutes);
app.use('/api/applications', applicationsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});