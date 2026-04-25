const Contact = require('../models/contactModel');
const nodemailer = require('nodemailer');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Winston logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logDir, 'app.log') })
    ]
});

// @desc    Send contact form
// @route   POST /api/contact
// @access  Public
const sendContact = async (req, res) => {
    logger.info(`[REQUEST] POST /api/contact`);
    
    const { namaLengkap, email, subjek, pesan } = req.body;
    logger.info(`[DATA] namaLengkap=${namaLengkap}, email=${email}, subjek=${subjek}`);

    // Validation
    if (!namaLengkap || !email || !subjek || !pesan) {
        logger.error(`[ERROR] Validation error: Semua field wajib diisi`);
        return res.status(400).json({
            success: false,
            message: "Semua field wajib diisi"
        });
    }

    // Basic email validation regex
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        logger.error(`[ERROR] Validation error: Email tidak valid`);
        return res.status(400).json({
            success: false,
            message: "Email tidak valid"
        });
    }

    let dbSaved = false;
    let emailSent = false;
    let contactDoc = null;

    try {
        // 1. Save to MongoDB
        logger.info(`[DB] Saving contact...`);
        contactDoc = await Contact.create({
            namaLengkap,
            email,
            subjek,
            pesan,
            emailStatus: 'pending'
        });
        dbSaved = true;
        logger.info(`[DB] Contact saved`);

        // 2. Send Email
        logger.info(`[EMAIL] Sending email...`);
        
        const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
        const smtpHost = process.env.SMTP_HOST;
        
        logger.info(`[DEBUG] SMTP Config: Host=${smtpHost}, Port=${smtpPort}`);

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Polbis Contact Form" <${process.env.SMTP_USER}>`, // Gmail requires this to be the authenticated user
            to: process.env.CONTACT_TO_EMAIL || 'admin@polbis.ac.id',
            replyTo: email, // So admin can reply directly to user
            subject: `[Contact Form] ${subjek}`,
            text: `Anda menerima pesan baru dari website Polbis:\n\nNama: ${namaLengkap}\nEmail: ${email}\nSubjek: ${subjek}\n\nPesan:\n${pesan}`
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        
        // Update DB status to sent
        await Contact.findByIdAndUpdate(contactDoc._id, { emailStatus: 'sent' });
        
        logger.info(`[SUCCESS] Email sent: ${subjek} from ${email}`);

        return res.status(200).json({
            success: true,
            message: "Pesan berhasil dikirim"
        });

    } catch (error) {
        logger.error(`[ERROR] Contact API failed: ${error.message}`);
        
        if (dbSaved && !emailSent) {
            logger.error(`[ERROR] Email failed: ${error.message}`);
            
            // Update DB status to failed
            await Contact.findByIdAndUpdate(contactDoc._id, { 
                emailStatus: 'failed',
                emailError: error.message
            });

            return res.status(200).json({
                success: true,
                message: "Pesan tersimpan, tapi email gagal dikirim"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    sendContact
};
