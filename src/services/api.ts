import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_URL_SERVER,
});

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const token = localStorage.getItem('@happy/user') 
    || sessionStorage.getItem('@happy/user');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
