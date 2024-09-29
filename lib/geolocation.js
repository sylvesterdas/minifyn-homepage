// lib/geolocation.js
import axios from 'axios';

const GEOLOCATION_API_URL = 'http://ip-api.com/json/';

export async function getUserCountry(req) {
  try {
    // Get the user's IP address
    const ip = getIpAddress(req);

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
    // 'x-forwarded-for' can contain multiple IP addresses in case of multiple proxies
    // The client's IP address is the first one in the list
    return forwardedFor.split(',')[0].trim();
  }
  
  // If 'x-forwarded-for' is not available, try 'x-real-ip'
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp;
  }

  // If neither header is available, use the remote address from the request
  return req.connection.remoteAddress;
}