const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const EmailService = require('../services/emailService');
const { findUserByEmail, findUserByMobile, updateUserPassword } = require('../models/userModel');
// Optional SMS provider (Twilio) — configure via env vars if you want real SMS delivery
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
        const twilio = require('twilio');
        twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } catch (e) {
        console.warn('Twilio not available:', e.message);
        twilioClient = null;
    }
}

// Password reset request
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send password reset email
        await EmailService.sendPasswordResetEmail(email, resetToken);

        res.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Password reset request failed:', error);
        res.status(500).json({ message: 'Failed to process password reset request' });
    }
});

// Password reset via mobile (OTP)
router.post('/forgot-password-mobile', async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ message: 'Mobile number is required' });

        const user = await findUserByMobile(mobile);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.resetToken = otp; // reuse resetToken field for OTP
        user.resetTokenExpiry = otpExpiry;
        await user.save();

        // Try sending via SMS if provider configured (Twilio)
        if (twilioClient && process.env.TWILIO_FROM_NUMBER) {
            try {
                await twilioClient.messages.create({
                    body: `Your SmartSheti password reset OTP is ${otp}. It expires in 10 minutes.`,
                    from: process.env.TWILIO_FROM_NUMBER,
                    to: mobile
                });
                return res.json({ message: 'OTP sent via SMS' });
            } catch (smsErr) {
                console.error('Failed to send SMS OTP:', smsErr.message || smsErr);
                // fallthrough to dev response
            }
        }

        // Fallback / dev mode: return OTP in response (safe for development only)
        console.log(`Password OTP for ${mobile}: ${otp}`);
        return res.json({ message: 'OTP generated (development)', otp });

    } catch (error) {
        console.error('Mobile password reset request failed:', error);
        res.status(500).json({ message: 'Failed to process mobile password reset request' });
    }
});

// Reset password with mobile OTP
router.post('/reset-password-mobile', async (req, res) => {
    try {
        const { mobile, otp, newPassword } = req.body;
        if (!mobile || !otp || !newPassword) return res.status(400).json({ message: 'mobile, otp and newPassword are required' });

        const user = await findUserByMobile(mobile);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.resetToken || user.resetToken !== otp || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        await updateUserPassword(user._id, newPassword);

        // Clear token fields
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Mobile password reset failed:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update password
        await updateUserPassword(user._id, newPassword);

        // Clear reset token
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Password reset failed:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

module.exports = router;