import { create } from 'zustand';
import api from '../api';
import useNotificationStore from './useNotificationStore';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  userType: localStorage.getItem('userType') || null,
  userId: localStorage.getItem('userId') || null,
  loading: false,
  error: null,

  register: async (phone, pin) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/customer/register', { phone, pin });
      const data = res.data;
      if (data.err === 200) {
        const { token, customer } = data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userType', 'customer');
        localStorage.setItem('userId', customer.id);
        set({ token, userType: 'customer', userId: customer.id, loading: false });
        useNotificationStore.getState().initSocket(customer.id);
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

  login: async (phone, pin) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/customer/login', { phone, pin });
      const data = res.data;
      if (data.err === 200) {
        const { token, customer } = data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userType', 'customer');
        localStorage.setItem('userId', customer.id);
        set({ token, userType: 'customer', userId: customer.id, loading: false });
        useNotificationStore.getState().initSocket(customer.id);
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

  loginAdmin: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/admin/login', { username, password });
      const data = res.data;
      if (data.err === 200) {
        const { token, officer } = data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userType', 'officer');
        localStorage.setItem('userId', officer.id);
        set({ token, userType: 'officer', userId: officer.id, loading: false });
        useNotificationStore.getState().initSocket(officer.id);
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

  logout: () => {
    const { socket } = useNotificationStore.getState();
    if (socket) {
      socket.disconnect();
    }
    useNotificationStore.getState().reset();
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    set({ token: null, userType: null, userId: null, error: null });
  },
}));

export default useAuthStore;