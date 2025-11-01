const express = require('express');
const router = express.Router();
const axios = require('axios');

function buildWeatherUrl({ city, lat, lon, forecast = false, apiKey }) {
    const base = forecast
        ? 'https://api.openweathermap.org/data/2.5/forecast'
        : 'https://api.openweathermap.org/data/2.5/weather';

    const params = [];
    if (lat && lon) {
        params.push(`lat=${lat}`, `lon=${lon}`);
    } else if (city) {
        params.push(`q=${encodeURIComponent(city)}`);
    }
    params.push('units=metric');
    params.push(`appid=${apiKey}`);

    return `${base}?${params.join('&')}`;
}

// Weather API endpoint - supports city name or "lat,lon" as :city param
router.get('/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const API_KEY = process.env.WEATHER_API_KEY; // OpenWeatherMap API key
        if (!API_KEY) {
            return res.status(500).json({ message: 'WEATHER_API_KEY not configured on server' });
        }

        // If city looks like "lat,lon" (two numbers), treat accordingly
        let lat, lon, q;
        if (city && city.includes(',')) {
            const parts = city.split(',').map(s => s.trim());
            const n1 = Number(parts[0]);
            const n2 = Number(parts[1]);
            if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
                lat = n1; lon = n2;
            } else {
                q = city;
            }
        } else {
            q = city;
        }

        const url = buildWeatherUrl({ city: q, lat, lon, forecast: false, apiKey: API_KEY });
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Weather fetch error:', error?.response?.data || error.message || error);
        res.status(500).json({ 
            message: 'Failed to fetch weather data',
            error: error.response ? error.response.data : error.message 
        });
    }
});

// 5-day forecast
router.get('/forecast/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const API_KEY = process.env.WEATHER_API_KEY;
        if (!API_KEY) {
            return res.status(500).json({ message: 'WEATHER_API_KEY not configured on server' });
        }

        let lat, lon, q;
        if (city && city.includes(',')) {
            const parts = city.split(',').map(s => s.trim());
            const n1 = Number(parts[0]);
            const n2 = Number(parts[1]);
            if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
                lat = n1; lon = n2;
            } else {
                q = city;
            }
        } else {
            q = city;
        }

        const url = buildWeatherUrl({ city: q, lat, lon, forecast: true, apiKey: API_KEY });
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Forecast fetch error:', error?.response?.data || error.message || error);
        res.status(500).json({ 
            message: 'Failed to fetch forecast data',
            error: error.response ? error.response.data : error.message 
        });
    }
});

module.exports = router;