const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hanimarji719@gmail.com',
        pass: '138332332332Hmmmm'
    }
});

// Test email configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log("Email configuration error:", error);
    } else {
        console.log("Email server is ready to send messages");
    }
});

// Handle code requests
app.post('/api/download', async (req, res) => {
    console.log('Received request:', req.body);
    
    const { email, codeTitle, codeDescription, category, requirements } = req.body;

    if (!email || !codeTitle || !codeDescription || !category) {
        return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields' 
        });
    }

    try {
        // Send email notification to you
        const adminEmail = await transporter.sendMail({
            from: 'hanimarji719@gmail.com',
            to: 'hanimarji719@gmail.com',
            subject: `New Custom Code Request - ${category}`,
            html: `
                <h2>New Custom Code Request</h2>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Code Title:</strong> ${codeTitle}</p>
                <p><strong>User Email:</strong> ${email}</p>
                <p><strong>Description:</strong> ${codeDescription}</p>
                <p><strong>Additional Requirements:</strong></p>
                <ul>
                    ${requirements ? requirements.map(req => `<li>${req}</li>`).join('') : '<li>None specified</li>'}
                </ul>
            `
        });
        console.log('Admin email sent:', adminEmail.messageId);

        // Send confirmation email to user
        const userEmail = await transporter.sendMail({
            from: 'hanimarji719@gmail.com',
            to: email,
            subject: 'Your Custom Code Request',
            html: `
                <h2>Thank you for your request!</h2>
                <p>We have received your request for a custom ${category} code with the following details:</p>
                <p><strong>Title:</strong> ${codeTitle}</p>
                <p><strong>Description:</strong> ${codeDescription}</p>
                <p>We will create your code according to your specifications and send it to you soon.</p>
                <p>If you need to provide any additional details, please reply to this email.</p>
            `
        });
        console.log('User email sent:', userEmail.messageId);

        res.json({ success: true });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send email',
            details: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        details: err.message 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the website at http://localhost:${PORT}`);
}); 