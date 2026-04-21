import axios from 'axios';
import app from '@/main';
import NotificationService from '@/services/notification.service';

const http = axios.create({ baseURL: '/api' });

http.interceptors.request.use((request) => {
  const token = localStorage.getItem('token');
  if (token) request.headers.Authorization = `Bearer ${token}`;
  app.$Progress.start();
  return request;
}, (error) => {
  app.$Progress.finish();
  return Promise.reject(error);
});

http.interceptors.response.use((response) => {
  app.$Progress.finish();
  return response;
}, (error) => {
  app.$Progress.finish();

  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    app.$router.push('/login');
    return Promise.reject(error);
  }

  if (error.response && error.response.status >= 500) {
    NotificationService.error('Server error. Please try again.');
  }

  return Promise.reject(error);
});

class HttpAdapter {
  async get(uri) {
    const res = await http.get(`/${uri}`);
    return res.data;
  }

  async post(uri, data) {
    const res = await http.post(`/${uri}`, data);
    return res.data;
  }

  async patch(uri, data) {
    const res = await http.patch(`/${uri}`, data);
    return res.data;
  }

  async put(uri, data) {
    const res = await http.put(`/${uri}`, data);
    return res.data;
  }

  async delete(uri) {
    const res = await http.delete(`/${uri}`);
    return res.data;
  }
}

export default new HttpAdapter();
