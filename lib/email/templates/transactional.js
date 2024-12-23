import { baseTemplate } from './base';

export const transactionalTemplate = ({ previewText, mainContent }) => {
  const content = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto;">
      <div style="text-align: center; padding: 20px 0;">
        <a href="${process.env.HOME_URL}">
          <img width="48" height="48" src="${process.env.HOME_URL}_next/image?url=%2Flogo.png&w=48&q=75" alt="MiniFyn Logo"/>
        </a>
      </div>
      <hr />
      ${mainContent}
    </div>
  `;

  return baseTemplate({
    previewText,
    content,
    footerText: 'MiniFyn - URL Shortener'
  });
};