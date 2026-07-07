// src/stores/useTransDefinitionStore.js
import { create } from 'zustand';
import api from '../api';

const useTransDefinitionStore = create((set) => ({
  definition: null,    // một definition (theo serviceId)
  loading: false,
  error: null,

  // Lấy chi tiết definition theo serviceId
  getTransDefinitionDetail: async (serviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-definitions/detail', { serviceId });
      const data = res.data;
      if (data.err === 200) {
        set({ definition: data.data.definition, loading: false });
        return { success: true, definition: data.data.definition };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Tạo mới một definition
  createTransDefinition: async (serviceId, glSteps) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-definitions/create', { serviceId, glSteps });
      const data = res.data;
      if (data.err === 200) {
        set({ definition: data.data.definition, loading: false });
        return { success: true, definition: data.data.definition };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Cập nhật definition (glSteps)
  updateTransDefinition: async (serviceId, glSteps) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-definitions/update', { serviceId, glSteps });
      const data = res.data;
      if (data.err === 200) {
        set({ definition: data.data.definition, loading: false });
        return { success: true, definition: data.data.definition };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Xóa definition theo serviceId
  deleteTransDefinition: async (serviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/trans-definitions/delete', { serviceId });
      const data = res.data;
      if (data.err === 200) {
        set({ definition: null, loading: false });
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

export default useTransDefinitionStore;