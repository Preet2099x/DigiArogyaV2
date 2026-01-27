// API service for making authenticated requests to the backend

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

// Records API (Patient)
export const recordsApi = {
  // Get patient's own records (paginated)
  getMyRecords: async (page = 0, size = 10, type = null) => {
    let url = `/records/me?page=${page}&size=${size}`;
    if (type && type !== 'ALL') {
      url += `&type=${type}`;
    }
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch records');
    }
    return response.json();
  },

  // Grant access to a doctor
  grantAccess: async (doctorEmail) => {
    const response = await fetchWithAuth('/records/access', {
      method: 'POST',
      body: JSON.stringify({ doctorEmail }),
    });
    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error || 'Failed to grant access');
    }
    return true;
  },

  // Get active accesses
  getActiveAccesses: async () => {
    const response = await fetchWithAuth('/records/accesses');
    if (!response.ok) {
      throw new Error('Failed to fetch active accesses');
    }
    return response.json();
  },

  // Revoke access
  revokeAccess: async (accessId) => {
    const response = await fetchWithAuth(`/records/access/${accessId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to revoke access');
    }
  },

  // Extend access
  extendAccess: async (accessId, days) => {
    const response = await fetchWithAuth(`/records/access/${accessId}/extend`, {
      method: 'PUT',
      body: JSON.stringify({ days }),
    });
    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error || 'Failed to extend access');
    }
  },
};

// Doctor API
export const doctorApi = {
  // Get list of patients doctor has access to
  getMyPatients: async (page = 0, size = 10) => {
    const response = await fetchWithAuth(`/records/patients?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }
    return response.json();
  },

  // Get patient records (doctor viewing patient's records)
  getPatientRecords: async (patientId, page = 0, size = 10) => {
    const response = await fetchWithAuth(`/records/${patientId}?page=${page}&size=${size}`);
    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error || 'Failed to fetch patient records');
    }
    return response.json();
  },

  // Add a record for a patient
  addRecord: async (patientId, recordData) => {
    const response = await fetchWithAuth(`/records/${patientId}`, {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error || 'Failed to add record');
    }
    return response.json(); // Returns { recordId, message }
  },
};

// User API
export const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await fetchWithAuth('/users/me');
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  },

  // Update profile (name)
  updateProfile: async (name) => {
    const response = await fetchWithAuth('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error || 'Failed to update profile');
    }
    return response.json();
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    const response = await fetchWithAuth('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error || 'Failed to change password');
    }
  },
};

// Audit Log API
export const getAuditLogs = async (page = 0, size = 20) => {
  const response = await fetchWithAuth(`/audit-logs?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error('Failed to fetch audit logs');
  }
  return response.json();
};

// File Upload API
export const fileApi = {
  // Upload files to a record
  uploadFiles: async (recordId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE}/files/upload/${recordId}`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeader(),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error || 'Failed to upload files');
    }
    return response.json();
  },

  // Get download URL for a file
  getDownloadUrl: async (attachmentId) => {
    const response = await fetchWithAuth(`/files/download/${attachmentId}`);
    if (!response.ok) {
      throw new Error('Failed to get download URL');
    }
    return response.json();
  },

  // Get all attachments for a record
  getRecordAttachments: async (recordId) => {
    const response = await fetchWithAuth(`/files/record/${recordId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch attachments');
    }
    return response.json();
  },

  // Delete an attachment
  deleteAttachment: async (attachmentId) => {
    const response = await fetchWithAuth(`/files/${attachmentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete attachment');
    }
  },
};

export default { recordsApi, doctorApi, userApi, fileApi };
