import nodemailer from 'nodemailer';
import { kv } from '@vercel/kv';
import { emailConfig } from './config';
import { createEmailContent } from './templates/base';

export class EmailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  }

  async canSendEmail(userId) {
    const key = `email:daily:${userId}`;
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, 24 * 60 * 60);
    }
    return count <= emailConfig.limits.maxDailyEmails;
  }

  async send(to, template, data, userId) {
    if (!(await this.canSendEmail(userId))) {
      throw new Error('Daily email limit exceeded');
    }

    const content = createEmailContent(template, data);
    const emailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      ...content
    };

    for (let attempt = 1; attempt <= emailConfig.maxRetries; attempt++) {
      try {
        await this.transporter.sendMail(emailOptions);
        return true;
      } catch (error) {
        if (attempt === emailConfig.maxRetries) throw error;
        await new Promise(r => setTimeout(r, emailConfig.retryDelay * attempt));
      }
    }
  }
}
