const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/applicationModel');
const EmailService = require('../services/emailService');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  }
});

const upload = multer({ storage });

// POST /api/applications - submit a new application (accept any files)
router.post('/', upload.any(), async (req, res) => {
  try {
    const body = req.body || {};

    const appData = {
      schemeId: body.schemeId,
      schemeName: body.schemeName || body.schemeId,
      applicantEmail: body.email || body.applicantEmail,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      address: body.address,
      landArea: body.landArea ? Number(body.landArea) : undefined,
      aadharNumber: body.aadharNumber,
      bankAccountNumber: body.bankAccountNumber,
      ifscCode: body.ifscCode,
      documents: []
    };

    // Map uploaded files
    if (req.files && req.files.length) {
      req.files.forEach(f => {
        appData.documents.push({
          originalName: f.originalname,
          fileName: f.filename,
          mimeType: f.mimetype,
          size: f.size,
          path: `/uploads/${f.filename}`
        });
      });
    }

    const application = new Application(appData);
    await application.save();
    // Send confirmation email if email provided
    try {
      if (application.applicantEmail) {
        const to = application.applicantEmail;
        const subject = `Application received for ${application.schemeName || application.schemeId}`;
        const text = `Dear ${application.fullName},\n\nWe have received your application for ${application.schemeName || application.schemeId}. Your application ID is ${application._id}. We will process it and update you soon.\n\nRegards,\nSmartSheti Team`;
        const html = `
          <h2>Application Received</h2>
          <p>Dear ${application.fullName},</p>
          <p>We have received your application for <strong>${application.schemeName || application.schemeId}</strong>.</p>
          <p><strong>Application ID:</strong> ${application._id}</p>
          <p>We will process your application and notify you of any updates.</p>
          <p>Regards,<br/>SmartSheti Team</p>
        `;

  await EmailService.sendNotification(to, subject, text);
      }
    } catch (mailErr) {
      console.error('Failed to send confirmation email:', mailErr);
      // proceed; do not fail the request because of email issues
    }

    res.status(201).json({ message: 'Application submitted', applicationId: application._id });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
});

// GET /api/applications - list applications (simple, not paginated)
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 }).lean();
    res.json(apps);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// GET /api/applications/:id - get single application
router.get('/:id', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).lean();
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: 'Failed to fetch application', error: error.message });
  }
});

module.exports = router;
