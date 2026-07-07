import { create } from 'zustand';
import api from '../api';

const usePocketStore = create((set) => ({
  pockets: [],
  pocket: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,

  getBalance: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/pocket/balance');
      const data = res.data;
      if (data.err === 200) {
        set({ pocket: data.data, loading: false });
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

  listPockets: async (type = 'all', page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/pocket/list', { type, page, limit });
      const data = res.data;
      if (data.err === 200) {
        set({
          pockets: data.data.pockets,
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

  getDetailPocket: async (pocketId) => {
    set({ loading: true, error: null, pocket: null });
    try {
      const res = await api.post('/admin/pocket/detail', { pocketId });
      const data = res.data;
      if (data.err === 200) {
        set({ pocket: data.data.pocket, loading: false });
        return { success: true, pocket: data.data.pocket };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  adjustPocketBalance: async (pocketId, action, amount, reason) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/pocket/adjust', { pocketId, action, amount, reason });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          pockets: state.pockets.map((p) => p.id === pocketId ? data.data.pocket : p),
          pocket: data.data.pocket,
          loading: false
        }));
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

  createSystemPocket: async (type, label, balance, currencyCode = 'VND') => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/pocket/create/system', { type, label, balance, currencyCode });
      const data = res.data;
      if (data.err === 200) {
        set({ loading: false });
        return { success: true, pocket: data.data.pocket };
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

export default usePocketStore;