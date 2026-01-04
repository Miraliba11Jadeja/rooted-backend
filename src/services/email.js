import nodemailer from 'nodemailer';
import { sendBookingSMS } from './sms.js';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBookingNotification = async (bookingData) => {
  try {
    // Send email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'rooted659@gmail.com',
      subject: 'New Booking Inquiry - Health Coach Website',
      html: `
        <h2>New Booking Inquiry</h2>
        <p><strong>Name:</strong> ${bookingData.name}</p>
        <p><strong>Phone:</strong> ${bookingData.phone}</p>
        <p><strong>Service:</strong> ${bookingData.serviceName || 'Not specified'}</p>
        <p><strong>Service ID:</strong> ${bookingData.serviceId || 'Not specified'}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    const emailInfo = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + emailInfo.response);
    
    // Send SMS
    try {
      await sendBookingSMS(bookingData);
    } catch (smsError) {
      console.error('Failed to send SMS notification:', smsError);
      // Don't fail the entire request if SMS fails
    }
    
    return emailInfo;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};