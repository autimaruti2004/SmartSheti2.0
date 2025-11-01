const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const EmailService = require('../services/emailService');
const { findUserByEmail, updateUserPassword } = require('../models/userModel');

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