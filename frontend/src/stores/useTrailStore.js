import { create } from 'zustand';
import api from '../api';

const useTrailStore = create((set) => ({
  trails: [],
  trail: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,

  listTrails: async (page = 1, limit = 20, status = '') => {
    set({ loading: true, error: null });
    try {
      const body = { page, limit };
      if (status) body.status = status;
      const res = await api.post('/admin/trails/list', body);
      const data = res.data;
      if (data.err === 200) {
        set({
          trails: data.data.trails,
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

  getTrailByTransRef: async (transRefId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trails/detail', { transRefId });
      const data = res.data;
      if (data.err === 200) {
        set({ trail: data.data.trail, loading: false });
        return { success: true, trail: data.data.trail };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  getTrailDetail: async (trailId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trails/detail', { trailId });
      const data = res.data;
      if (data.err === 200) {
        set({ trail: data.data.trail, loading: false });
        return { success: true, trail: data.data.trail };
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

export default useTrailStore;