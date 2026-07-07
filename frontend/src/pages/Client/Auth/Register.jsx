// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../../stores/useAuthStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(phone, pin);
    if (result.success) {
      navigate('/');
    } else {
      alert(result.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Đăng ký tài khoản
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0xxxxxxxxx"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Nhập PIN (ít nhất 6 ký tự)"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;