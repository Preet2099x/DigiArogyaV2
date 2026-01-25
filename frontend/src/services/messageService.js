// Message API service for chat functionality

import authService from './authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Generic fetch wrapper with authentication
async function fetchWithAuth(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...authService.getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - redirect to login
  if (response.status === 401) {
    authService.logout();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  return response;
}

// Helper to parse error messages
async function getErrorMessage(response) {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json.message || text;
  } catch {
    return text;
  }
}

export const messageApi = {
  // Get all conversations
  getConversations: async () => {
    const response = await fetchWithAuth('/messages/conversations');
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    return response.json();
  },

  // Get messages in a specific conversation
  getConversation: async (otherUserId) => {
    const response = await fetchWithAuth(`/messages/conversation/${otherUserId}`);
    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error || 'Failed to fetch messages');
    }
    return response.json();
  },

  // Send a message
  sendMessage: async (receiverId, content) => {
    const response = await fetchWithAuth('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content }),
    });
    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error || 'Failed to send message');
    }
    return response.json();
  },

  // Get contacts (users you can message)
  getContacts: async () => {
    const response = await fetchWithAuth('/messages/contacts');
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return response.json();
  },

  // Get unread message count
  getUnreadCount: async () => {
    const response = await fetchWithAuth('/messages/unread-count');
    if (!response.ok) {
      return { unreadCount: 0 };
    }
    return response.json();
  },
};

export default messageApi;
