import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nodemailer from 'nodemailer';

// Load environment variables
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env.development.local') });

async function testEmailSetup() {
  // First test the connection
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP Connection Successful');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "your-test-email@gmail.com", // Replace with your email
      subject: "MiniFyn Email Test",
      text: "If you're seeing this, the email system is working!",
      html: `
        <h1>MiniFyn Email System Test</h1>
        <p>If you're seeing this, the email system is working!</p>
        <p>Configuration details:</p>
        <ul>
          <li>SMTP Host: smtp.zoho.com</li>
          <li>From: ${process.env.EMAIL_FROM}</li>
          <li>User: ${process.env.EMAIL_USER}</li>
        </ul>
      `
    });

    console.log('✅ Test Email Sent Successfully');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // More detailed error checking
    if (!process.env.EMAIL_USER) {
      console.error('Missing EMAIL_USER environment variable');
    }
    if (!process.env.EMAIL_APP_PASSWORD) {
      console.error('Missing EMAIL_APP_PASSWORD environment variable');
    }
    if (!process.env.EMAIL_FROM) {
      console.error('Missing EMAIL_FROM environment variable');
    }
    
    process.exit(1);
  }
}

testEmailSetup();