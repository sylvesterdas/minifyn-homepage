import nodemailer from 'nodemailer';
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
import { createVerificationEmail } from './templates/verification';
import { createResetPasswordEmail } from './templates/resetPassword';

const QUEUE_KEY = 'email:queue';
const LOCK_KEY = 'email:lock';
const MAX_CONCURRENT = 5;
const LOCK_TTL = 30; // 30 seconds
const EMAIL_RATE_LIMIT = 5;
const TOKEN_EXPIRY = 24 * 60 * 60;

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_MAIL_USER,
    pass: process.env.ZOHO_MAIL_PASSWORD
  }
});

export const emailService = {
  async acquireLock() {
    return await kv.set(LOCK_KEY, '1', {
      ex: LOCK_TTL,
      nx: true
    });
  },

  async releaseLock() {
    await kv.del(LOCK_KEY);
  },

  async sendEmail(emailData) {
    // Add to queue
    const id = uuidv4();
    await kv.hset(QUEUE_KEY, {
      [id]: JSON.stringify({
        id,
        emailData,
        attempts: 0,
        createdAt: Date.now()
      })
    });

    // Try processing queue
    if (await this.acquireLock()) {
      try {
        const queue = await kv.hgetall(QUEUE_KEY) || {};
        const emails = Object.values(queue)
          .map(item => typeof item === 'string' ? JSON.parse(item) : item)
          .slice(0, MAX_CONCURRENT);

        await Promise.all(emails.map(async (item) => {
          try {
            await transporter.sendMail(item.emailData);
            await kv.hdel(QUEUE_KEY, item.id);
          } catch (error) {
            console.error(`Failed to send email ${item.id}:`, error);
            if (item.attempts >= 2) {
              await kv.hdel(QUEUE_KEY, item.id);
            } else {
              item.attempts++;
              await kv.hset(QUEUE_KEY, {
                [item.id]: JSON.stringify(item)
              });
            }
          }
        }));
      } finally {
        await this.releaseLock();
      }
    }
  },

  async sendVerification(user) {
    const key = `email_rate:${user.id}`;
    const count = await kv.incr(key);
    await kv.expire(key, 60);
    
    if (count > EMAIL_RATE_LIMIT) {
      throw new Error('Too many verification attempts');
    }

    const token = uuidv4();
    await kv.set(`verify:${token}`, user.id, { ex: TOKEN_EXPIRY });

    await this.sendEmail({
      from: process.env.ZOHO_MAIL_FROM,
      to: user.email,
      subject: 'Verify your MiniFyn account',
      html: createVerificationEmail(user.full_name, token)
    });

    return token;
  },

  async sendPasswordReset({ email, name, resetLink }) {
    return this.sendEmail({
      from: process.env.ZOHO_MAIL_FROM,
      to: email,
      subject: 'Reset your MiniFyn password',
      html: createResetPasswordEmail(name || email, resetLink)
    });
  },

  async verifyToken(token) {
    const userId = await kv.get(`verify:${token}`);
    if (!userId) return false;
    await kv.del(`verify:${token}`);
    return userId;
  }
};