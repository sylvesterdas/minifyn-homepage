const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

export function validateEmail(email) {
  if (!email) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please provide a valid email address';
  }
  return null;
}

export function validatePassword(password, isSignup = true) {
  if (!password) {
    return 'Password is required';
  }
  
  // Only check password strength on signup
  if (isSignup) {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
  }
  
  return null;
}

export function validateName(name) {
  if (!name?.trim()) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  return null;
}

// Security Helpers
export function sanitizeUser(user) {
  if (!user) return null;
  
  // Remove sensitive fields
  const { password_hash, ...sanitizedUser } = user;
  return sanitizedUser;
}

// Auth Error Handling
export class AuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}