import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const AUTH_URL = `${API_BASE_URL}/auth/`;
const EXAM_URL = `${API_BASE_URL}/exams/`;

const api = axios.create({
  baseURL: AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach token
// Assuming token is stored in localStorage as 'token' or inside 'user' object.
// Based on previous conversations, check if token exists. If not, maybe session auth?
// Let's assume we store token separately or inside user.
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token) {
      config.headers.Authorization = `Token ${user.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const signup = (data) => api.post('signup/', data);
export const login = (data) => api.post('login/', data);
export const forgotPassword = (data) => api.post('forgot-password/', data);
export const verifyOtp = (data) => api.post('verify-otp/', data);
export const resetPassword = (data) => api.post('reset-password/', data);

// Exam API
const examApi = axios.create({ baseURL: EXAM_URL });

examApi.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token) {
      config.headers.Authorization = `Token ${user.token}`;
    }
  }
  return config;
});

export const getExams = () => examApi.get('exams/');
export const createExam = (data) => examApi.post('exams/', data);
export const updateExam = (id, data) => examApi.put(`exams/${id}/`, data);
export const deleteExam = (id) => examApi.delete(`exams/${id}/`);

export const registerForExam = (examId) => examApi.post(`register/${examId}/`);
export const simulatePayment = (regId) => examApi.post(`payment/${regId}/`);

export const getStudentRegistrations = () => examApi.get('registrations/student/');
export const getStaffRegistrations = (examId) => examApi.get(`registrations/staff/${examId ? '?exam_id=' + examId : ''}`);

export const getMaterials = () => examApi.get('materials/');
export const uploadMaterial = (data) => examApi.post('materials/', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const uploadDocument = (data) => examApi.post('ai/verify-document/', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getAIAdvice = (query) => examApi.post('ai/advice/', { query });

export default api;
