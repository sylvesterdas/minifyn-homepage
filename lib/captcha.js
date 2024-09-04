export async function verifyCaptcha(recaptchaToken, req) {
  const verifyUrl = new URL('https://www.google.com/recaptcha/api/siteverify');
  const verifyUrlParams = new URLSearchParams({
    secret: process.env.NEXT_RECAPTCHA_SECRET_KEY,
    response: recaptchaToken,
    remoteip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  });
  verifyUrl.search = verifyUrlParams.toString();
  const recaptchaResponse = await fetch(verifyUrl, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST'
  });
  const recaptchaData = await recaptchaResponse.json();
  if (!recaptchaData.success) {
    console.error('reCAPTCHA verification failed:', recaptchaData['error-codes'], Object.fromEntries(verifyUrlParams));
    throw { status: 400, message: 'reCAPTCHA verification failed', details: recaptchaData['error-codes'] };
  }
}