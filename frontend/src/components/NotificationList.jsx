// components/NotificationList.jsx
import { useEffect } from 'react';
import useNotificationStore from '../store/notificationStore';

const NotificationList = () => {
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    fetchNotifications(1, 20);
    fetchUnreadCount();
  }, []);

  const handleMarkRead = (id) => {
    markAsRead(id);
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h3>Thông báo {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h3>
      <ul>
        {notifications.map(notif => (
          <li key={notif.id} style={{ borderLeft: `4px solid ${notif.type === 'credit' ? 'green' : 'red'}` }}>
            <p>{notif.message}</p>
            <small>Mã GD: {notif.transRefId}</small>
            <br />
            <small>{new Date(notif.createdAt).toLocaleString()}</small>
            {!notif.isRead && (
              <button onClick={() => handleMarkRead(notif.id)}>Đánh dấu đã đọc</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;