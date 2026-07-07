import { create } from 'zustand';
import api from '../api';

const useServiceStore = create((set) => ({
  services: [],
  service: null,
  fields: [],
  validations: [],
  definition: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,

  listServices: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/services/list', { page, limit });
      const data = res.data;
      if (data.err === 200) {
        set({
          services: data.data.services,
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

  getServiceDetail: async (serviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/services/detail', { serviceId });
      const data = res.data;
      if (data.err === 200) {
        const { service, fields, validations, definition } = data.data;
        set({
          service,
          fields: fields || [],
          validations: validations || [],
          definition: definition || null,
          loading: false,
        });
        return { success: true, service, fields, validations, definition };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  createService: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/services/create', payload);
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          services: [...state.services, data.data.service],
          loading: false,
        }));
        return { success: true, service: data.data.service };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  updateService: async (serviceId, fields) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/services/update', { serviceId, ...fields });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          services: state.services.map((s) =>
            s.id === serviceId ? { ...s, ...data.data.service } : s
          ),
          service: data.data.service,
          loading: false,
        }));
        return { success: true, service: data.data.service };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  deleteService: async (serviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/services/delete', { serviceId });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          services: state.services.filter((s) => s.id !== serviceId),
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

  getFullServiceConfig: async (serviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/service-config/get-full', { serviceId });
      const data = res.data;
      if (data.err === 200) {
        set({
          service: data.data.service,
          fields: data.data.fields,
          validations: data.data.validations,
          definition: data.data.definition,
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

  createFullServiceConfig: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/service-config/create-full', payload);
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          services: [...state.services, data.data.service],
          loading: false,
        }));
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

  updateFullServiceConfig: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/service-config/update-full', payload);
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          services: state.services.map((s) =>
            s.id === payload.serviceId ? data.data.service : s
          ),
          loading: false,
        }));
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

  deleteFullServiceConfig: async (serviceId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/admin/service-config/delete-full', { serviceId });
      const data = res.data;
      if (data.err === 200) {
        set((state) => ({
          services: state.services.filter((s) => s.id !== serviceId),
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

export default useServiceStore;