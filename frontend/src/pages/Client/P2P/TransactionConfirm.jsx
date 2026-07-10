// pages/Client/TransactionConfirm.jsx
import { useNavigate } from 'react-router-dom';
import useTransactionStore from '../../../stores/useTransactionStore';
import { FaArrowLeft, FaCheck, FaXmark } from 'react-icons/fa6';

const TransactionConfirm = () => {
  const navigate = useNavigate();
  const { preview, confirmTransaction, authMethod } = useTransactionStore();

  const handleConfirm = async () => {
    const result = await confirmTransaction();
    if (result.success) {
      if (authMethod === 'NONE') {
        const verifyResult = await useTransactionStore.getState().verifyTransaction(null);
        if (verifyResult.success) {
          navigate('/transaction/result');
        } else {
          alert(verifyResult.message || 'Lỗi xác thực');
        }
      } else {
        navigate('/transaction/verify');
      }
    } else {
      alert(result.message || 'Lỗi xác nhận');
    }
  };

  if (!preview) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Không có thông tin giao dịch</p>
        <button onClick={() => navigate('/')} className="mt-4 text-emerald-600 hover:underline">
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <FaArrowLeft size={14} /> Quay lại
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Xác nhận giao dịch</h1>
        <p className="text-sm text-slate-500">Vui lòng kiểm tra thông tin trước khi xác nhận</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Số tiền</span>
          <span className="font-semibold text-slate-900">{preview.amount?.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Phí giao dịch</span>
          <span className="font-semibold text-amber-600">{preview.fee?.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between items-center border-t border-dashed border-slate-200 pt-4">
          <span className="text-slate-900 font-bold">Tổng cộng</span>
          <span className="text-xl font-bold text-slate-900">{preview.total?.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
          <span>Mã giao dịch</span>
          <span className="font-mono">{preview.transRefId}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            onClick={handleConfirm}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <FaCheck size={14} /> Xác nhận
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FaXmark size={14} /> Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionConfirm;