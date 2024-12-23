import nodemailer from 'nodemailer';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
import { createVerificationEmail } from './templates/verification';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_MAIL_USER,
    pass: process.env.ZOHO_MAIL_PASSWORD
  }
});

const EMAIL_RATE_LIMIT = 5; // emails per minute
const TOKEN_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

export const emailService = {
  async sendVerification(user) {
    const key = `email_rate:${user.id}`;
    const count = await kv.incr(key);
    await kv.expire(key, 60);
    
    if (count > EMAIL_RATE_LIMIT) {
      throw new Error('Too many verification attempts');
    }

    const token = uuidv4();
    await kv.set(`verify:${token}`, user.id, { ex: TOKEN_EXPIRY });

    await transporter.sendMail({
      from: process.env.ZOHO_MAIL_FROM,
      to: user.email,
      subject: 'Verify your MiniFyn account',
      html: createVerificationEmail(user.full_name || user.email, token)
    });

    return token;
  },

  async verifyToken(token) {
    const userId = await kv.get(`verify:${token}`);
    if (!userId) return false;
    
    await kv.del(`verify:${token}`);
    return userId;
  }
};