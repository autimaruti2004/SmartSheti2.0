const express = require('express');
const router = express.Router();
const axios = require('axios');

const fallbackSchemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Scheme',
    description: 'Income support scheme providing financial assistance to land-holding farmer families across India.',
    eligibility: 'Small and marginal farmer families with cultivable land',
    benefit: 'Direct income support of ₹6000 per year in three equal installments',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
    status: 'Active'
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Comprehensive crop insurance scheme to protect farmers from crop losses due to natural calamities.',
    eligibility: 'All farmers growing notified crops in notified areas',
    benefit: 'Insurance coverage and financial support in case of crop failure',
    documents: ['Land Records', 'Bank Account', 'Aadhaar Card'],
    status: 'Active'
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card Scheme',
    description: 'Provides farmers with timely access to credit for their agricultural needs.',
    eligibility: 'All farmers, sharecroppers, and agricultural laborers',
    benefit: 'Credit up to ₹3 lakh at low interest rates',
    documents: ['ID Proof', 'Land Records', 'Passport Size Photo'],
    status: 'Active'
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    description: 'Provides information to farmers on nutrient status of their soil and recommendation on fertilizer use.',
    eligibility: 'All farmers with agricultural land',
    benefit: 'Free soil testing and fertilizer recommendations',
    documents: ['Land ownership documents', 'Farmer ID'],
    status: 'Active'
  },
  {
    id: 'pmksy',
    name: 'Pradhan Mantri Krishi Sinchai Yojana',
    description: 'Ensures access to means of irrigation to all agricultural farms to improve productivity.',
    eligibility: 'Farmers needing irrigation facilities',
    benefit: 'Subsidies for irrigation equipment and infrastructure',
    documents: ['Land Documents', 'Bank Account', 'Aadhaar Card'],
    status: 'Active'
  },
  {
    id: 'nfsm',
    name: 'National Food Security Mission',
    description: 'Aims to increase production of rice, wheat, pulses, and other crops through area expansion and productivity enhancement.',
    eligibility: 'Farmers in selected districts growing target crops',
    benefit: 'Subsidies on seeds, machinery, and training support',
    documents: ['Farmer Registration Card', 'Land Documents'],
    status: 'Active'
  },
  {
    id: 'pkvy',
    name: 'Paramparagat Krishi Vikas Yojana',
    description: 'Promotes organic farming and helps farmers in certification and marketing of organic products.',
    eligibility: 'Farmers willing to adopt organic farming',
    benefit: 'Financial assistance of ₹50,000 per hectare for organic farming',
    documents: ['Land Records', 'Bank Account Details'],
    status: 'Active'
  },
  {
    id: 'agri-infra',
    name: 'Agriculture Infrastructure Fund',
    description: 'Provides medium to long term financing for agriculture infrastructure projects.',
    eligibility: 'Farmers, FPOs, Agri entrepreneurs, and rural entrepreneurs',
    benefit: 'Loans up to ₹2 crore with interest subvention',
    documents: ['Project Proposal', 'KYC Documents', 'Land Documents'],
    status: 'Active'
  },
  {
    id: 'e-nam',
    name: 'Electronic National Agriculture Market',
    description: 'Online trading platform for agricultural commodities to get better price discovery.',
    eligibility: 'All farmers can sell their produce on eNAM',
    benefit: 'Direct access to national market and better prices',
    documents: ['Identity Proof', 'Bank Account', 'Mobile Number'],
    status: 'Active'
  },
  {
    id: 'midh',
    name: 'Mission for Integrated Development of Horticulture',
    description: 'Promotes holistic growth of horticulture sector through area based regionally differentiated strategies.',
    eligibility: 'Farmers involved in horticulture cultivation',
    benefit: 'Subsidies for nursery development, cultivation, and post-harvest management',
    documents: ['Land Records', 'Bank Account', 'Identity Proof'],
    status: 'Active'
  }
];

router.get('/', async (req, res) => {
    try {
        const apiUrl = process.env.GOV_SCHEMES_API_URL;
        if (!apiUrl) {
            return res.json(fallbackSchemes);
        }

        const response = await axios.get(apiUrl);
        return res.json(response.data);
    } catch (error) {
        console.error('Error fetching schemes:', error?.response?.data || error.message || error);
        res.status(500).json({ message: 'Failed to fetch schemes', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const apiUrl = process.env.GOV_SCHEMES_API_URL;
        if (!apiUrl) {
            const found = fallbackSchemes.find(s => s.id === id || s.name === id);
            if (!found) return res.status(404).json({ message: 'Scheme not found' });
            return res.json(found);
        }

        const response = await axios.get(`${apiUrl}/${encodeURIComponent(id)}`);
        return res.json(response.data);
    } catch (error) {
        console.error('Error fetching scheme:', error?.response?.data || error.message || error);
        res.status(500).json({ message: 'Failed to fetch scheme details', error: error.message });
    }
});

module.exports = router;