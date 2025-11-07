import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// Sessao (Autenticaçao)
export const sessionAPI = {
  checkEmail: (email) => API.post('/session/check', { email }),
  signup: (name, email, password, confirmPassword) =>
    API.post('/session/signup', { name, email, password, confirmPassword }),
  login: (email, password) =>
    API.post('/session/login', { email, password }),
  getMe: () => API.get('/session/me'),
  logout: () => API.post('/session/logout'),
};

// Feed (Posts)
export const feedAPI = {
  getMessages: () => API.get('/feed'),
  createMessage: (content) =>
    API.post('/feed', { content }),
  deleteMessage: (id) =>
    API.delete(`/feed/${id}`),
};

// Comentarios 
export const replyAPI = {
  getReplies: (messageId, page = 1, limit = 10) =>
    API.get(`/reply/${messageId}`, { params: { page, limit } }),
  createReply: (messageId, content) =>
    API.post('/reply', { messageId, content }),
  deleteReply: (id) =>
    API.delete(`/reply/${id}`),
};

export default API;
