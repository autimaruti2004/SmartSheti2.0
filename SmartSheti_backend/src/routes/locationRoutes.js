const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Load locations JSON once (simple cache). Replace file with real dataset if available.
const locationsPath = path.join(__dirname, '..', 'config', 'locations.json');
let LOCATIONS = {};
try {
  const raw = fs.readFileSync(locationsPath, 'utf8');
  LOCATIONS = JSON.parse(raw);
} catch (err) {
  console.warn('Locations file not found or invalid:', err.message || err);
  LOCATIONS = {};
}

// GET /api/locations/districts
router.get('/districts', (req, res) => {
  try {
    const districts = Object.keys(LOCATIONS || {});
    res.json({ districts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch districts' });
  }
});

// GET /api/locations/subdistricts?district=District%20A
router.get('/subdistricts', (req, res) => {
  try {
    const { district } = req.query;
    if (!district) return res.status(400).json({ message: 'district query param required' });
    const subs = LOCATIONS[district] ? Object.keys(LOCATIONS[district]) : [];
    return res.json({ subdistricts: subs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subdistricts' });
  }
});

// GET /api/locations/villages?district=District%20A&subDistrict=Sub%20A1
router.get('/villages', (req, res) => {
  try {
    const { district, subDistrict } = req.query;
    if (!district || !subDistrict) return res.status(400).json({ message: 'district and subDistrict query params required' });
    const villages = (LOCATIONS[district] && LOCATIONS[district][subDistrict]) || [];
    return res.json({ villages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch villages' });
  }
});

// GET /api/locations/tree - returns full tree
router.get('/tree', (req, res) => {
  res.json({ tree: LOCATIONS });
});

module.exports = router;
