import { create } from 'zustand';
import api from '../api'; // axios instance đã cấu hình baseURL, interceptor...

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  userType: localStorage.getItem('userType') || null,
  loading: false,
  error: null,

  // Đăng ký khách hàng
  register: async (phone, pin) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/customer/register', { phone, pin });
      const data = res.data;
      if (data.err === 200) {
        const { token, customer } = data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userType', 'customer');
        set({ token, userType: 'customer', loading: false });
        return { success: true, customer };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Đăng nhập khách hàng
  login: async (phone, pin) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/customer/login', { phone, pin });
      const data = res.data;
      if (data.err === 200) {
        const token = data.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('userType', 'customer');
        set({ token, userType: 'customer', loading: false });
        return { success: true };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Đăng nhập admin
  loginAdmin: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/admin/login', { username, password });
      const data = res.data;
      if (data.err === 200) {
        const token = data.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('userType', 'officer');
        set({ token, userType: 'officer', loading: false });
        return { success: true };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Tạo admin mới (chỉ dành cho officer)
  createAdmin: async (username, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/admin/create', { username, password, displayName });
      const data = res.data;
      if (data.err === 200) {
        set({ loading: false });
        return { success: true, officer: data.data.officer };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    set({ token: null, userType: null, error: null });
  },
}));

export default useAuthStore;