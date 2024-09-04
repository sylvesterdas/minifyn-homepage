import jwt from 'jsonwebtoken';

export const logout = (setUser) => {
  localStorage.removeItem('token');
  setUser(null);
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};