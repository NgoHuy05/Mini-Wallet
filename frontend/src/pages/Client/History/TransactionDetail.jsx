// pages/Client/TransactionDetail.jsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useTransactionStore from '../../../stores/useTransactionStore';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa6';

const TransactionDetail = () => {
  const { transactionId } = useParams();
  const { transactionDetail, loading, error, fetchTransactionDetail } = useTransactionStore();

  useEffect(() => {
    if (transactionId) fetchTransactionDetail(transactionId);
  }, [transactionId, fetchTransactionDetail]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <FaSpinner className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          Lỗi: {error}
        </div>
      </div>
    );
  }

  if (!transactionDetail) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-slate-500">
        Không tìm thấy giao dịch
      </div>
    );
  }

  const t = transactionDetail;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/history"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <FaArrowLeft size={14} /> Quay lại lịch sử
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Chi tiết giao dịch</h1>
        <p className="text-sm text-slate-500">Thông tin chi tiết của giao dịch</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Mã giao dịch</span>
          <span className="font-mono text-sm text-slate-800">{t.id}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Loại</span>
          <span className="capitalize text-slate-800">
            {t.transactionType === 'p2p' ? 'Chuyển tiền' :
             t.transactionType === 'cashin' ? 'Nạp tiền' :
             t.transactionType === 'billpayment' ? 'Thanh toán hóa đơn' :
             t.transactionType}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Số tiền</span>
          <span className="font-semibold text-slate-900">{t.amount?.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Phí</span>
          <span className="text-amber-600">{t.fee?.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between items-center border-t border-dashed border-slate-200 pt-4">
          <span className="text-slate-900 font-bold">Tổng cộng</span>
          <span className="text-xl font-bold text-slate-900">{t.total?.toLocaleString()} VND</span>
        </div>

        {t.transactionType === 'billpayment' && (
          <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
            {t.billerCode && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Nhà cung cấp</span>
                <span className="text-slate-800 font-medium">{t.billerCode}</span>
              </div>
            )}
            {t.billCode && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Mã hóa đơn</span>
                <span className="text-slate-800 font-mono">{t.billCode}</span>
              </div>
            )}
            {t.billerRefId && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">MÃ BILLER GIAO DỊCH</span>
                <span className="text-slate-800 font-mono text-xs">{t.billerRefId}</span>
              </div>
            )}
          </div>
        )}

        {t.message && (
          <div className="flex justify-between items-center border-t border-dashed border-slate-200 pt-4">
            <span className="text-slate-500">Lời nhắn</span>
            <span className="italic text-slate-700">"{t.message}"</span>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-dashed border-slate-200 pt-4">
          <span className="text-slate-500">Trạng thái</span>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
            t.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
            t.status === 'failed' ? 'bg-rose-100 text-rose-800' :
            'bg-slate-100 text-slate-600'
          }`}>
            {t.status === 'done' ? 'Thành công' :
             t.status === 'failed' ? 'Thất bại' :
             t.status === 'processing' ? 'Đang xử lý' :
             t.status}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 border-t border-dashed border-slate-200 pt-4">
          <span>MÃ REF GIAO DỊCH</span>
          <span className="font-mono">{t.transRefId}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Thời gian</span>
          <span>{new Date(t.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;