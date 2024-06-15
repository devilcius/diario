import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const login = async (username, password) => {
  try {
    // First, attempt to login and get the token
    const loginResponse = await axios.post(`${API_BASE_URL}/token-auth/`, {
      username,
      password,
    });

    // Store the token temporarily
    const token = loginResponse.data.token;
    localStorage.setItem('token', token);


    return { loginResponse };

  } catch (error) {
    // If an error occurs in either request, remove any potentially stored token
    localStorage.removeItem('token');

    return error.response;
  }
};


export const logout = (onLogout) => {
  localStorage.removeItem('token');
  if (onLogout && typeof onLogout === 'function') {
    onLogout();
  }
};