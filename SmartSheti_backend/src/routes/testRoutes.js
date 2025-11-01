const express = require('express');
const router = express.Router();
const EmailService = require('../services/emailService');

// Test email route
router.post('/test-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Test email पाठवा
        await EmailService.sendNotification(
            email,
            "SmartSheti Test Email",
            "हा एक टेस्ट ईमेल आहे. जर तुम्हाला हा ईमेल मिळाला असेल, तर SMTP setup यशस्वी झाले आहे!"
        );

        res.json({ success: true, message: 'Test email sent successfully!' });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ success: false, message: 'Failed to send test email', error: error.message });
    }
});

module.exports = router;