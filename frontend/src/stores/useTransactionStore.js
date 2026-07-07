import { create } from 'zustand';
import api from '../api';

const useTransactionStore = create((set) => ({
  transRefId: null,
  preview: null,
  authMethod: null,
  transaction: null,
  transactionDetail: null,
  transactions: [],
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,

  requestTransaction: async (serviceId, parameters) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/transaction/request', { serviceId, parameters });
      const data = res.data;
      if (data.err === 200) {
        set({
          transRefId: data.data.transRefId,
          preview: data.data.preview,
          authMethod: data.data.auth ?? null,
          transaction: data.data.transaction ?? null,
          loading: false,
        });
        return {
          success: true,
          transRefId: data.data.transRefId,
          preview: data.data.preview,
          auth: data.data.auth,
          completed: !!data.data.completed,
          transaction: data.data.transaction,
        };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  confirmTransaction: async () => {
    const state = useTransactionStore.getState();
    if (!state.transRefId) return { success: false, message: 'Thiếu transRefId' };
    set({ loading: true, error: null });
    try {
      const res = await api.post('/transaction/confirm', { transRefId: state.transRefId });
      const data = res.data;
      if (data.err === 200) {
        set({ authMethod: data.data.authMethod, loading: false });
        return { success: true, authMethod: data.data.authMethod };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  verifyTransaction: async (pin) => {
    const state = useTransactionStore.getState();
    if (!state.transRefId) return { success: false, message: 'Thiếu transRefId' };
    set({ loading: true, error: null });
    try {
      const res = await api.post('/transaction/verify', {
        transRefId: state.transRefId,
        pin: pin || undefined,
      });
      const data = res.data;
      if (data.err === 200) {
        set({ transaction: data.data.transaction, loading: false });
        return { success: true, transaction: data.data.transaction };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  resetTransaction: () => set({
    transRefId: null,
    preview: null,
    authMethod: null,
    transaction: null,
    error: null,
  }),

  fetchHistory: async (page = 1, limit = 20) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/transactions/all-history', { page, limit });
      const data = res.data;
      if (data.err === 200) {
        set({
          transactions: data.data.transactions,
          total: data.data.total,
          totalPages: data.data.totalPages,
          loading: false,
        });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTransactionDetail: async (transactionId) => {
    set({ loading: true, error: null, transactionDetail: null });
    try {
      const res = await api.post('/transactions/detail', { transactionId });
      const data = res.data;
      if (data.err === 200) {
        set({ transactionDetail: data.data.transaction, loading: false });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchAdminTransactions: async (page = 1, limit = 20, status = '') => {
    set({ loading: true, error: null });
    try {
      const body = { page, limit };
      if (status) body.status = status;
      const res = await api.post('/admin/transactions/list', body);
      const data = res.data;
      if (data.err === 200) {
        set({
          transactions: data.data.transactions,
          total: data.data.total,
          totalPages: data.data.totalPages,
          loading: false,
        });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useTransactionStore;