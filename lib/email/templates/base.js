export const baseTemplate = ({ previewText, content, footerText }) => `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>${previewText}</title>
    <style>
      @media only screen and (max-width: 620px) {
        h1 { font-size: 28px !important; }
        p, td, span { font-size: 16px !important; }
      }
    </style>
  </head>
  <body style="background-color: #f6f6f6; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; margin: 0; padding: 20px;">
    <span style="display: none">${previewText}</span>
    <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      ${content}
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee;">
        <p style="margin: 0 0 10px">${footerText}</p>
        <a href="${process.env.HOME_URL}legal/privacy" style="color: #666; text-decoration: underline;">Privacy Policy</a>
      </div>
    </div>
  </body>
</html>`;