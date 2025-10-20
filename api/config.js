// API Base URL
export const API_BASE_URL = 'http://192.168.100.6:5000/api';


// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGN_IN: '/api/auth/sign-in',    
  SIGN_UP: '/api/auth/sign-up', 
  VERIFY_TOKEN: '/api/auth/verify-token',
  
  // Appointments
  CREATE_APPOINTMENT: '/api/appointments/create',
  GET_APPOINTMENTS: '/api/appointments/all',
  GET_USER_APPOINTMENTS: '/api/appointments/user',
  UPDATE_APPOINTMENT: '/api/appointments/update-status',
  DELETE_APPOINTMENT: '/api/appointments/delete',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};