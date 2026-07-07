// src/stores/useTransValidationStore.js
import { create } from 'zustand';
import api from '../api';

const useTransValidationStore = create((set) => ({
  validations: [],      // danh sách validations của một service
  loading: false,
  error: null,

  // Lấy danh sách TransValidations theo serviceId
  listTransValidations: async (serviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-validations/list', { serviceId });
      const data = res.data;
      if (data.err === 200) {
        set({ validations: data.data.validations, loading: false });
        return { success: true, validations: data.data.validations };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Tạo mới một TransValidation
  createTransValidation: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-validations/create', payload);
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          validations: [...state.validations, data.data.validation],
          loading: false,
        }));
        return { success: true, validation: data.data.validation };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Cập nhật một TransValidation
  updateTransValidation: async (validationId, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-validations/update', { validationId, ...updates });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          validations: state.validations.map((v) =>
            v.id === validationId ? { ...v, ...data.data.validation } : v
          ),
          loading: false,
        }));
        return { success: true, validation: data.data.validation };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Xóa một TransValidation
  deleteTransValidation: async (validationId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-validations/delete', { validationId });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          validations: state.validations.filter((v) => v.id !== validationId),
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

export default useTransValidationStore;