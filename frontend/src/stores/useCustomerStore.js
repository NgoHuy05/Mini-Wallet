import { create } from 'zustand';
import api from '../api';

const useCustomerStore = create((set) => ({
  customers: [],
  customer: null,
  pocket: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,

  listCustomers: async (phone = '', page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/users/list', { phone, page, limit });
      const data = res.data;
      if (data.err === 200) {
        set({
          customers: data.data.customers,
          total: data.data.total,
          totalPages: data.data.totalPages,
          loading: false,
        });
        return { success: true, ...data.data };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  getCustomerDetail: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/users/detail', { userId });
      const data = res.data;
      if (data.err === 200) {
        set({
          customer: data.data.customer,
          pocket: data.data.pocket,
          loading: false,
        });
        return { success: true, ...data.data };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  lockCustomer: async (userId, reason) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/users/lock', { userId, reason });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === userId ? { ...c, status: 'locked', lockedReason: reason } : c
          ),
          customer: data.data.customer,
          loading: false,
        }));
        return { success: true, customer: data.data.customer };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  unlockCustomer: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/users/unlock', { userId });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === userId ? { ...c, status: 'active', lockedReason: null } : c
          ),
          customer: data.data.customer,
          loading: false,
        }));
        return { success: true, customer: data.data.customer };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },
}));

export default useCustomerStore;