const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'aniketandhale2892001@gmail.com', // तुमचा email
        pass: 'kfmv uhjk wijw nogy'  // तुमचा app password
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: 'aniketandhale2892001@gmail.com',
            to: to,                        // List of receivers
            subject: subject,              // Subject line
            text: text,                    // Plain text body
            html: html                     // HTML body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendEmail
};