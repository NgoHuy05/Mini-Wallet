// pages/Client/TransactionHistory.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTransactionStore from '../../../stores/useTransactionStore';
import usePocketStore from '../../../stores/usePocketStore';
import { FaEye, FaArrowUp, FaArrowDown, FaSpinner } from 'react-icons/fa6';

const TransactionHistory = () => {
  const { transactions, loading, error, fetchHistory } = useTransactionStore();
  const { pocket, getBalance } = usePocketStore();
  const navigate = useNavigate();
  const [pocketReady, setPocketReady] = useState(false);

  useEffect(() => {
    const loadPocket = async () => {
      if (!pocket) {
        await getBalance();
      }
      setPocketReady(true);
    };
    loadPocket();
  }, [getBalance, pocket]);

  useEffect(() => {
    if (pocketReady) {
      fetchHistory();
    }
  }, [pocketReady, fetchHistory]);

  const isOutgoing = (tx) => pocket?.pocketId && tx.senderPocketId === pocket.pocketId;
  const isIncoming = (tx) => pocket?.pocketId && tx.receiverPocketId === pocket.pocketId;

  if (loading || !pocketReady) {
    return (
      <div className="flex justify-center py-20">
        <FaSpinner className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          Lỗi: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Lịch sử giao dịch</h1>
        <p className="text-sm text-slate-500">Các giao dịch gần đây của bạn</p>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
          Chưa có giao dịch nào
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(tx => (
            <div
              key={tx.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-full ${
                  isOutgoing(tx) ? 'bg-rose-100 text-rose-600' :
                  isIncoming(tx) ? 'bg-emerald-100 text-emerald-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {isOutgoing(tx) ? <FaArrowUp size={16} /> :
                   isIncoming(tx) ? <FaArrowDown size={16} /> :
                   <FaArrowUp size={16} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {isOutgoing(tx) && 'Chuyển tiền'}
                    {isIncoming(tx) && 'Nhận tiền'}
                    {!isOutgoing(tx) && !isIncoming(tx) && (
                      tx.transactionType === 'billpayment' ? 'Thanh toán hóa đơn' :
                      tx.transactionType === 'cashin' ? 'Nạp tiền' :
                      'Giao dịch'
                    )}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                  {tx.message && <p className="text-xs text-slate-500 mt-1">"{tx.message}"</p>}
                  {tx.transactionType === 'billpayment' && tx.billCode && (
                    <p className="text-xs text-blue-600 mt-0.5">
                      Hóa đơn: {tx.billCode} {tx.billerCode ? `(${tx.billerCode})` : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  isOutgoing(tx) ? 'text-rose-600' :
                  isIncoming(tx) ? 'text-emerald-600' :
                  'text-slate-900'
                }`}>
                  {isOutgoing(tx) ? '-' : isIncoming(tx) ? '+' : ''}
                  {tx.amount?.toLocaleString()} VND
                </p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                  tx.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                  tx.status === 'failed' ? 'bg-rose-100 text-rose-800' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {tx.status}
                </span>
                <button
                  onClick={() => navigate(`/history/${tx.id}`)}
                  className="ml-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaEye size={12} /> Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;