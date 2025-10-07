// API Base URL
export const API_BASE_URL = 'http://192.168.100.6:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
  VERIFY_TOKEN: '/auth/verify-token',
  
  // Appointments
  CREATE_APPOINTMENT: '/appointments/create',
  GET_APPOINTMENTS: '/appointments/all',
  GET_USER_APPOINTMENTS: '/appointments/user',
  UPDATE_APPOINTMENT: '/appointments/update-status',
  DELETE_APPOINTMENT: '/appointments/delete',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};