// pages/Client/TransactionVerify.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTransactionStore from '../../../stores/useTransactionStore';
import { FaArrowLeft, FaSpinner, FaShield } from 'react-icons/fa6';

const TransactionVerify = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { verifyTransaction, preview } = useTransactionStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length < 6) {
      setError('Vui lòng nhập đủ 6 số PIN');
      return;
    }
    setSubmitting(true);
    setError(null);

    const result = await verifyTransaction(pin);
    if (result.success) {
      navigate('/transaction/result');
    } else {
      setError(result.message || 'Giao dịch thất bại');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <FaArrowLeft size={14} /> Quay lại
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Xác thực giao dịch</h1>
        <p className="text-sm text-slate-500">Nhập mã PIN để hoàn tất giao dịch</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {preview && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Số tiền</span>
              <span className="font-semibold">{preview.amount?.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phí</span>
              <span className="text-amber-600">{preview.fee?.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-slate-200 pt-2">
              <span className="font-bold">Tổng</span>
              <span className="font-bold">{preview.total?.toLocaleString()} VND</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <FaShield size={12} className="text-slate-400" />
              Mã PIN <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              maxLength="6"
              inputMode="numeric"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError(null);
              }}
              placeholder="Nhập 6 số PIN"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-2xl tracking-[0.5em] font-mono transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              autoFocus
            />
            <p className="mt-1 text-xs text-slate-400">Mã PIN gồm 6 chữ số</p>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" size={16} />
                Đang xác thực...
              </>
            ) : (
              'Xác nhận PIN'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionVerify;