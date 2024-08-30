export const logout = (setUser) => {
  localStorage.removeItem('token');
  setUser(null);
  // Optionally, redirect to login page
  // window.location.href = '/login';
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const isAuthenticated = () => {
  const token = getToken();
  // You might want to add token validation logic here
  return !!token;
};