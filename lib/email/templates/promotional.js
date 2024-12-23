import { baseTemplate } from './base';

export const promotionalTemplate = ({ previewText, mainContent }) => {
  const content = `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0; padding: 0;">
      <tr><td height="8">&nbsp;</td></tr>
      <tr>
        <td align="center">
          <a href="${process.env.HOME_URL}">
            <img width="48" height="48" src="${process.env.HOME_URL}_next/image?url=%2Flogo.png&w=48&q=75" />
          </a>
        </td>
      </tr>
      <tr><td height="20">&nbsp;</td></tr>
    </table>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${mainContent}
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <a href="${process.env.HOME_URL}/unsubscribe" style="color: #999999; font-size: 12px;">Unsubscribe</a>
    </div>
  `;

  return baseTemplate({
    previewText,
    content,
    footerText: 'MiniFyn - URL Shortener'
  });
};