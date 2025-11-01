const { sendEmail } = require('../config/emailConfig');

class EmailService {
    // Welcome email पाठवण्यासाठी
    static async sendWelcomeEmail(userEmail, userName) {
        const subject = 'Welcome to SmartSheti!';
        const text = `नमस्कार ${userName},\n\nSmartSheti मध्ये आपले स्वागत आहे!`;
        const html = `
            <h1>SmartSheti मध्ये आपले स्वागत आहे!</h1>
            <p>नमस्कार ${userName},</p>
            <p>SmartSheti वर नोंदणी केल्याबद्दल धन्यवाद.</p>
            <p>आमच्या सेवा वापरण्यास सुरुवात करा आणि शेतीविषयक माहिती मिळवा.</p>
        `;

        return await sendEmail(userEmail, subject, text, html);
    }

    // Password reset email पाठवण्यासाठी
    static async sendPasswordResetEmail(userEmail, resetToken) {
        const subject = 'Password Reset Request';
        const text = `आपला password reset करण्यासाठी खालील लिंक वापरा:\n\nhttp://localhost:5173/reset-password?token=${resetToken}`;
        const html = `
            <h1>Password Reset Request</h1>
            <p>आपला password reset करण्यासाठी खालील बटन क्लिक करा:</p>
            <a href="http://localhost:5173/reset-password?token=${resetToken}" 
               style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
                Reset Password
            </a>
        `;

        return await sendEmail(userEmail, subject, text, html);
    }

    // सामान्य नोटिफिकेशन पाठवण्यासाठी
    static async sendNotification(userEmail, subject, message) {
        const text = message;
        const html = `
            <h2>${subject}</h2>
            <p>${message}</p>
        `;

        return await sendEmail(userEmail, subject, text, html);
    }
}

module.exports = EmailService;