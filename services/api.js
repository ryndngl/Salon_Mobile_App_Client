// services/api.js
import API_URL from "../config/api";

export const authAPI = {
  signIn: async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
  
  signUp: async (fullName, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, password }),
    });
    return response.json();
  }
};