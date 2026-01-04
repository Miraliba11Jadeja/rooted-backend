import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendBookingSMS = async (bookingData) => {
  try {
    const messageBody = `New Booking Inquiry!

Name: ${bookingData.name}
Phone: ${bookingData.phone}
Service: ${bookingData.serviceName || 'Not specified'}
Submitted at: ${new Date().toLocaleString()}`;
    
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+91844816211'
    });
    
    console.log('SMS sent:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};