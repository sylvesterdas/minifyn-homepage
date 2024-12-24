import { transactionalTemplate } from './transactional';

export const createResetPasswordEmail = (name, resetLink) => {
  const mainContent = `
    <h2>Reset your password</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to set a new password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" 
         style="background: #3498DB; color: white; padding: 12px 30px; 
                text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p>Or copy and paste this link: ${resetLink}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this change, you can safely ignore this email.</p>
  `;

  return transactionalTemplate({
    previewText: 'Reset your MiniFyn password',
    mainContent
  });
};