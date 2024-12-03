export const createEmailContent = (template, data) => {
  const templates = {
    verification: {
      subject: 'Verify your MiniFyn account',
      text: `Welcome to MiniFyn! Click here to verify: ${data.verificationUrl}`,
      html: `
        <p>Welcome to MiniFyn!</p>
        <p><a href="${data.verificationUrl}">Click here to verify your account</a></p>
      `
    },
    resetPassword: {
      subject: 'Reset your MiniFyn password',
      text: `Reset your password: ${data.resetUrl}`,
      html: `
        <p>Reset your MiniFyn password</p>
        <p><a href="${data.resetUrl}">Click here to reset</a></p>
      `
    },
    welcome: {
      subject: 'Welcome to MiniFyn',
      text: `Thanks for verifying! Get started: ${data.loginUrl}`,
      html: `
        <p>Thanks for verifying your account!</p>
        <p><a href="${data.loginUrl}">Click here to get started</a></p>
      `
    }
  };
  return templates[template];
};
