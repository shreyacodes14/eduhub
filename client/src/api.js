import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api'
});

// Add token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const register = (name, email, password) =>
    API.post('/auth/register', { name, email, password });

export const login = (email, password) =>
    API.post('/auth/login', { email, password });

export const getCurrentUser = () =>
    API.get('/auth/me');

// Course APIs
export const getAllCourses = () =>
    API.get('/courses');

export const getCourseById = (id) =>
    API.get(`/courses/${id}`);

export const createCourse = (courseData) =>
    API.post('/courses', courseData);

export const enrollCourse = (id) =>
    API.post(`/enroll/${id}`);

export const unenrollCourse = (id) =>
    API.delete(`/enroll/${id}`);

export const updateCourse = (id, courseData) =>
    API.put(`/courses/${id}`, courseData);

export const deleteCourse = (id) =>
    API.delete(`/courses/${id}`);

export default API;
