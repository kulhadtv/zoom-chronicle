import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Request interceptor: attach token ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── Response interceptor: handle 401 ── */
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('zc_token');
      localStorage.removeItem('zc_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err.response?.data || err);
  }
);

/* ════════════════════════════════════════
   AUTH
════════════════════════════════════════ */
export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
};

/* ════════════════════════════════════════
   POSTS
════════════════════════════════════════ */
export const postsAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getTrending: () => api.get('/posts/trending'),
  getMoreViewsPosts: () => api.get('/posts/more-views'),
  getPostForAdmin: (params) => api.get('/posts/all-post-admin', { params }),
  getSlugs: () => api.get('/posts/slugs'),
  getByCategory: (cat, params) => api.get(`/posts/category/${cat}`, { params }),
  getByTags: (params) => api.get('/posts/tags', { params }),
  getByDate: (params) => api.get('/posts/date', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  getBySlug: (slug) => api.get(`/posts/slug/${slug}`),
  create: (data) => api.post('/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/posts/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/posts/${id}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
};

/* ════════════════════════════════════════
   ADMIN – USERS
════════════════════════════════════════ */
export const adminAPI = {
  getAllUsers: () => api.get('/auth/users'),
  updateRole: (id, role) => api.put(`/auth/users/${id}/role`, { role }),
  deactivate: (id) => api.put(`/auth/users/${id}/deactivate`),
  activate: (id) => api.put(`/auth/users/${id}/activate`),
};

export default api;