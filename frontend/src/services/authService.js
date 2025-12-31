// Auth service for handling JWT tokens and user authentication

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
  // Get the stored JWT token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get the current user data
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < exp;
    } catch {
      return false;
    }
  },

  // Store token and user data after login
  login: (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  },

  // Clear stored data on logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get authorization header for API requests
  getAuthHeader: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default authService;
