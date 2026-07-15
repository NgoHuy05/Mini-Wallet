/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { io } from 'socket.io-client';
import api from '../api';
import { toast } from 'react-toastify';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  socket: null,
  userId: null,

  initSocket: (userId) => {
    if (!userId) return;

    set({ userId });

    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('join', { room: `user_${userId}` });
      return;
    }

    if (socket) {
      socket.disconnect();
    }

    const newSocket = io('http://localhost:1337', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      const currentUserId = get().userId;
      if (currentUserId) {
        newSocket.emit('join', { room: `user_${currentUserId}` });
      }
    });

    newSocket.on('reconnect', () => {
      const currentUserId = get().userId;
      if (currentUserId) {
        newSocket.emit('join', { room: `user_${currentUserId}` });
      }
    });

    newSocket.on('transaction-notification', (data) => {
      set((state) => ({
        notifications: [data.notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));

      toast.success(data?.toast || '📩 Bạn có thông báo mới!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
    });

    set({ socket: newSocket });
  },

  reset: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      notifications: [],
      unreadCount: 0,
      totalPages: 1,
      currentPage: 1,
      loading: false,
      socket: null,
      userId: null,
    });
  },

  fetchNotifications: async (page = 1, limit = 20) => {
    set({ loading: true });
    try {
      const res = await api.post('/notifications/list', { page, limit });
      const response = res.data;
      const payload = response?.data ?? response;
      const notificationsData = payload?.data ?? payload;
      const pagination = payload?.pagination ?? { totalPages: 1 };

      set({
        notifications: Array.isArray(notificationsData) ? notificationsData : [],
        totalPages: pagination.totalPages || 1,
        currentPage: page,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const res = await api.post('/notifications/mark-read', { notificationId });
      const response = res.data;
      if (response.err === 200 || response.ok) {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(state.unreadCount - 1, 0),
        }));
      }
    } catch (error) {
      // silent fail
    }
  },

  markAllAsRead: async () => {
    try {
      const res = await api.post('/notifications/mark-all-read');
      const response = res.data;
      if (response.err === 200 || response.ok) {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      }
    } catch (error) {
      // fallback: đánh dấu từng cái
      const { notifications } = get();
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      if (unreadIds.length === 0) return;
      for (const id of unreadIds) {
        await api.post('/notifications/mark-read', { notificationId: id });
      }
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await api.post('/notifications/count-unread');
      const response = res.data;
      const count = response?.data?.count ?? response?.count ?? 0;
      set({ unreadCount: count });
    } catch (error) {
      // silent fail
    }
  },
}));

export default useNotificationStore;