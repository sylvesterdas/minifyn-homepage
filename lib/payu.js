import { PayU } from 'payu-sdk';

const payu = new PayU({
  key: process.env.NEXT_PAYU_API_KEY,
  salt: process.env.NEXT_PAYU_API_SALT,
  clientId: process.env.NEXT_PUBLIC_PAYU_CLIENT_ID,
  clientSecret: process.env.NEXT_PAYU_CLIENT_SECRET,
});

export async function createPayment(amount, productInfo, firstName, email, phone) {
  const txnid = `TXN_${Date.now()}`;
  const surl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`;
  const furl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/failure`;

  const paymentData = {
    txnid,
    amount,
    productinfo: productInfo,
    firstname: firstName,
    email,
    phone,
    surl,
    furl,
  };

  try {
    const response = await payu.makePayment(paymentData);
    return response;
  } catch (error) {
    console.error('PayU payment creation error:', error);
    throw error;
  }
}

export function verifyPayment(data) {
  return payu.validateWebhook(data);
}