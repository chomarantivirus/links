const nodemailer = require('nodemailer');
const winston = require('winston'); 
require('dotenv').config();


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/success.log', level: 'info' }),
  ],
});

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendMail(to, subject, htmlContent, attachments) {
  try {
    const info = await transporter.sendMail({
      from: '"C-Prot Links" <noreply@c-prot.com>',
      to,
      subject,
      html: htmlContent,
    });

    logger.info({
      message: 'Mail gönderildi',
      messageId: info.messageId,
      to,
      subject,
      timestamp: new Date().toISOString(),
    });

    console.log('Mail gönderildi: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {

    logger.error({
      message: 'Mail gönderim hatası',
      error: error.message,
      to,
      subject,
      timestamp: new Date().toISOString(),
    });
    
    console.error('Mail gönderim hatası:', error);
    return { success: false, error };
  }
}

module.exports = { sendMail };
