import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

const TOKEN_EXPIRY = 3600; // 1 hour in seconds

export const passwordResetUtils = {
  async createResetToken(userId) {
    const token = uuidv4();
    await kv.set(`reset:${token}`, userId, { ex: TOKEN_EXPIRY });
    return token;
  },

  async validateResetToken(token) {
    const userId = await kv.get(`reset:${token}`);
    if (!userId) return null;
    return userId;
  },

  async invalidateResetToken(token) {
    await kv.del(`reset:${token}`);
  },

  getResetLink(token) {
    return `${process.env.HOME_URL}reset-password?token=${token}`;
  }
};