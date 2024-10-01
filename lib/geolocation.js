// lib/geolocation.js
import axios from 'axios';

const GEOLOCATION_API_URL = 'http://ip-api.com/json/';

export async function getUserCountry(req) {
  try {
    // Get the user's IP address
    const ip = getIpAddress(req);

    // Check if it's a local IP address
    if (isLocalIpAddress(ip)) {
      return 'LOCAL';
    }

    // Make a request to the geolocation API
    const response = await axios.get(`${GEOLOCATION_API_URL}${ip}`);

    if (response.data && response.data.countryCode) {
      return response.data.countryCode;
    } else {
      console.error('Unable to determine user country:', response.data);
      return 'UNKNOWN';
    }
  } catch (error) {
    console.error('Error determining user country:', error);
    return 'UNKNOWN';
  }
}

function getIpAddress(req) {
  // Check for IP address in various headers
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp;
  }

  return req.connection.remoteAddress;
}

function isLocalIpAddress(ip) {
  return ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
}