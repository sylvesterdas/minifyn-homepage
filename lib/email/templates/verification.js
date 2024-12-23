import { baseTemplate } from './base';

export const createVerificationEmail = (name, token) => {
  const verifyUrl = `${process.env.HOME_URL}/verify-email?token=${token}`;
  
  const content = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify your email</h2>
      <p>Hi ${name},</p>
      <p>Please click the button below to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" 
           style="background: #3498DB; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>Or copy and paste this link: ${verifyUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
  `;

  return baseTemplate({
    previewText: 'Verify your MiniFyn account',
    content,
    footerText: 'MiniFyn - URL Shortener'
  });
};