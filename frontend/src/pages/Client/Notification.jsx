// pages/NotificationPage.jsx
import { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../stores/useNotificationStore';

const NotificationPage = () => {
  const { notifications, loading, fetchNotifications, fetchUnreadCount } =
    useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications(1, 30);
    fetchUnreadCount();
  }, []);

  if (loading) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">  Tất cả thông báo</h1>
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-400">Chưa có thông báo nào</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isCredit = notif.type === 'credit';
            const sign = isCredit ? '+' : '-';
            const amountClass = isCredit ? 'text-emerald-600' : 'text-rose-600';
            return (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border ${
                  !notif.isRead ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100 bg-white'
                }`}
              >
                <p className="text-gray-800">{notif.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`font-bold ${amountClass}`}>
                    {sign} {notif.amount.toLocaleString()} VND
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Mã GD: <span className="font-mono">{notif.transRefId}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;