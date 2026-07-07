import { create } from 'zustand';
import api from '../api';

const useBillerStore = create((set) => ({
  billers: [],
  biller: null,
  pocket: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,

  listBillers: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/billers/list', { page, limit });
      const data = res.data;
      if (data.err === 200) {
        set({
          billers: data.data.billers,
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

  getBillerDetail: async (billerId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/billers/detail', { billerId });
      const data = res.data;
      if (data.err === 200) {
        set({ biller: data.data.biller, pocket: data.data.pocket, loading: false });
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

  createBiller: async (code, name, inquiryUrl, paymentUrl) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/billers/create', { code, name, inquiryUrl, paymentUrl });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          billers: [...state.billers, data.data.biller],
          loading: false,
        }));
        return { success: true, biller: data.data.biller, pocket: data.data.pocket };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  updateBiller: async (billerId, fields) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/billers/update', { billerId, ...fields });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          billers: state.billers.map((b) =>
            b.id === billerId ? { ...b, ...data.data.biller } : b
          ),
          biller: data.data.biller,
          loading: false,
        }));
        return { success: true, biller: data.data.biller };
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

export default useBillerStore;