// components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { FaWallet, FaHistory, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Header = () => {
  const { token, userType, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Mini Wallet
        </Link>
        {token && userType === 'customer' && (
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/" className="flex items-center gap-1 hover:text-indigo-200 transition-colors">
              <FaHome /> Trang chủ
            </Link>
            <Link to="/pocket" className="flex items-center gap-1 hover:text-indigo-200 transition-colors">
              <FaWallet /> Ví của tôi
            </Link>
            <Link to="/history" className="flex items-center gap-1 hover:text-indigo-200 transition-colors">
              <FaHistory /> Lịch sử
            </Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 px-3 py-1 rounded transition-colors"
            >
              <FaSignOutAlt /> Đăng xuất
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;