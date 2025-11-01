const express = require('express');
const router = express.Router();
const axios = require('axios');

// Default public mock API used by frontend previously
const DEFAULT_MARKET_API = 'https://6900be19ff8d792314bb4726.mockapi.io/market-prices';

// Get market prices for all commodities
router.get('/', async (req, res) => {
    try {
        const response = await fetchMarketPrices();
        // normalize common wrappers (value, prices, data) to a plain array
        let data = response;
        if (response && typeof response === 'object') {
            data = response.value || response.prices || response.data || response;
        }
        if (!Array.isArray(data)) {
            // if still not array, wrap single object
            data = [data];
        }
        res.json(data);
    } catch (error) {
        console.error('Error fetching market prices:', error?.response?.data || error.message || error);
        res.status(500).json({ message: 'Failed to fetch market prices', error: error.message });
    }
});

// Get prices by commodity
router.get('/commodity/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const response = await fetchCommodityPrices(name);
        res.json(response);
    } catch (error) {
        console.error('Error fetching commodity prices:', error?.response?.data || error.message || error);
        res.status(500).json({ message: 'Failed to fetch commodity prices', error: error.message });
    }
});

// Get prices by market
router.get('/market/:marketId', async (req, res) => {
    try {
        const { marketId } = req.params;
        const response = await fetchMarketDetails(marketId);
        res.json(response);
    } catch (error) {
        console.error('Error fetching market details:', error?.response?.data || error.message || error);
        res.status(500).json({ message: 'Failed to fetch market details', error: error.message });
    }
});

// Helper functions to fetch data from external API
async function fetchMarketPrices() {
    try {
        const api = process.env.MARKET_API_URL || DEFAULT_MARKET_API;
        const response = await axios.get(api);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function fetchCommodityPrices(commodity) {
    try {
        const api = process.env.MARKET_API_URL || DEFAULT_MARKET_API;
        // try a commodity endpoint, or fall back to filtering
        try {
            const response = await axios.get(`${api}/commodity/${encodeURIComponent(commodity)}`);
            return response.data;
        } catch (e) {
            // If commodity endpoint doesn't exist, fetch full list and filter
            const all = await fetchMarketPrices();
            const arr = Array.isArray(all) ? all : all.data || all.prices || [];
            return arr.filter(item => (item.crop || '').toLowerCase() === commodity.toLowerCase());
        }
    } catch (error) {
        throw error;
    }
}

async function fetchMarketDetails(marketId) {
    try {
        const api = process.env.MARKET_API_URL || DEFAULT_MARKET_API;
        try {
            const response = await axios.get(`${api}/market/${encodeURIComponent(marketId)}`);
            return response.data;
        } catch (e) {
            const all = await fetchMarketPrices();
            const arr = Array.isArray(all) ? all : all.data || all.prices || [];
            return arr.filter(item => (item.market || '').toLowerCase() === marketId.toLowerCase());
        }
    } catch (error) {
        throw error;
    }
}

module.exports = router;