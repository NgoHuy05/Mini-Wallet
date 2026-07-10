// src/stores/useTransFieldStore.js
import { create } from 'zustand';
import api from '../api';

const useTransFieldStore = create((set) => ({
  fields: [],           // danh sách fields của một service
  loading: false,
  error: null,

  // Lấy danh sách TransFields theo serviceId
  listTransFields: async (serviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-fields/list', { serviceId });
      const data = res.data;
      if (data.err === 200) {
        set({ fields: data.data.fields, loading: false });
        return { success: true, fields: data.data.fields };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Tạo mới một TransField
  createTransField: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-fields/create', payload);
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          fields: [...state.fields, data.data.field],
          loading: false,
        }));
        return { success: true, field: data.data.field };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Cập nhật một TransField
  updateTransField: async (fieldId, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-fields/update', { fieldId, ...updates });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          fields: state.fields.map((f) =>
            f.id === fieldId ? { ...f, ...data.data.field } : f
          ),
          loading: false,
        }));
        return { success: true, field: data.data.field };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Xóa một TransField
  deleteTransField: async (fieldId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-fields/delete', { fieldId });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          fields: state.fields.filter((f) => f.id !== fieldId),
          loading: false,
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
}));

export default useTransFieldStore;