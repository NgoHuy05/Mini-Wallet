// pages/Client/TransactionResult.jsx
import { Link } from 'react-router-dom';
import useTransactionStore from '../../../stores/useTransactionStore';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TransactionResult = () => {
  const { transaction, error } = useTransactionStore();

  const isSuccess = !!transaction;

  return (
    <div className="max-w-[600px] mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        {isSuccess ? (
          <>
            <div className="flex justify-center mb-4">
              <FaCheckCircle size={72} className="text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Giao dịch thành công!</h1>
            <p className="text-slate-500 mt-2">
              {transaction.amount?.toLocaleString()} VND đã được xử lý
            </p>
            <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã giao dịch</span>
                <span className="font-mono text-xs">{transaction.transRefId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thời gian</span>
                <span>{new Date(transaction.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <FaTimesCircle size={72} className="text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Giao dịch thất bại</h1>
            <p className="text-slate-500 mt-2">{error || 'Vui lòng thử lại sau'}</p>
          </>
        )}

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default TransactionResult;