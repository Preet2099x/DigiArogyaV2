// API service for making authenticated requests to the backend

import authService from './authService';

const API_BASE = '/api';

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

// Records API (Patient)
export const recordsApi = {
  // Get patient's own records (paginated)
  getMyRecords: async (page = 0, size = 10) => {
    const response = await fetchWithAuth(`/records/me?page=${page}&size=${size}`);
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
      const error = await response.text();
      throw new Error(error || 'Failed to grant access');
    }
    return true;
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
      const error = await response.text();
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
      const error = await response.text();
      throw new Error(error || 'Failed to add record');
    }
    return true;
  },
};

export default { recordsApi, doctorApi };
