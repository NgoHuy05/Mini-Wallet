import { create } from 'zustand';
import api from '../api';

const usePocketEntryStore = create((set) => ({
  entries: [],
  entry: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,

  listPocketEntries: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/pocket-entries/list', { page, limit });
      const data = res.data;
      if (data.err === 200) {
        set({
          entries: data.data.entries,
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

  getPocketEntryDetail: async (entryId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/pocket-entries/detail', { entryId });
      const data = res.data;
      if (data.err === 200) {
        set({ entry: data.data.entry, loading: false });
        return { success: true, entry: data.data.entry };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  getEntriesByTrail: async (transRefId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/pocket-entries/by-trail', { transRefId });
      const data = res.data;
      if (data.err === 200) {
        set({ entries: data.data.entries, loading: false });
        return { success: true, entries: data.data.entries };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  getEntriesByPocket: async (pocketId, page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/pocket-entries/by-pocket', { pocketId, page, limit });
      const data = res.data;
      if (data.err === 200) {
        set({
          entries: data.data.entries,
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
}));

export default usePocketEntryStore;