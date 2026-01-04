import nodemailer from 'nodemailer';

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

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};