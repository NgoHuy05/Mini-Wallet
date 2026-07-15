import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaPlusCircle, FaMinusCircle, FaCheckDouble } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import useNotificationStore from '../stores/useNotificationStore';

const NotificationDropdown = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead, fetchUnreadCount, markAllAsRead } =
    useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications(1, 10);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    setIsOpen(false);
    const id = notif.transactionId || notif.transRefId;
    if (id) {
      navigate(`/history/${id}`);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('vi-VN');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-indigo-500/20 transition-colors duration-200"
      >
        <FaBell size={22} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[80vh] overflow-hidden transition-all duration-200 ease-out">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
            <span className="font-semibold text-gray-800">Thông báo</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {unreadCount} chưa đọc
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors duration-150"
                >
                  <FaCheckDouble size={12} />
                  Đánh dấu tất cả là đã đọc
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-96">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                <FaBell className="mx-auto text-3xl mb-2 text-gray-300" />
                Không có thông báo nào
              </div>
            ) : (
              notifications.map((notif) => {
                const isCredit = notif.type === 'credit';
                const amount = notif.amount || 0;
                const formattedAmount = formatAmount(amount);
                const sign = isCredit ? '+' : '-';
                const amountClass = isCredit ? 'text-emerald-600' : 'text-rose-600';
                const icon = isCredit ? (
                  <FaPlusCircle className="text-emerald-500" size={14} />
                ) : (
                  <FaMinusCircle className="text-rose-500" size={14} />
                );

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif)}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                      !notif.isRead
                        ? 'bg-blue-50/60 hover:bg-blue-100/80'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{icon}</div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            !notif.isRead ? 'text-gray-800 font-medium' : 'text-gray-600'
                          }`}
                        >
                          {notif.message}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`text-base font-bold ${amountClass}`}>
                            {sign} {formattedAmount} VND
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </span>
                        </div>
                        <div className="mt-0.5 text-xs text-gray-400">
                          Mã GD: <span className="font-mono">{notif.transRefId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-100 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                Xem tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;