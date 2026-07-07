// pages/Client/Pocket.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePocketStore from '../../stores/usePocketStore';
import useTransactionStore from '../../stores/useTransactionStore';
import { FaWallet, FaArrowUp, FaArrowDown, FaSpinner } from 'react-icons/fa6';

const Pocket = () => {
  const navigate = useNavigate();
  const { pocket, loading, getBalance } = usePocketStore();
  const { transactions, loading: txLoading, fetchHistory } = useTransactionStore();
  const [pocketReady, setPocketReady] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await getBalance();
      setPocketReady(true);
    };
    loadData();
  }, [getBalance]);

  useEffect(() => {
    if (pocketReady) {
      fetchHistory(1, 10); 
    }
  }, [pocketReady, fetchHistory]);

  if (loading || !pocketReady) {
    return (
      <div className="flex justify-center py-20">
        <FaSpinner className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }


  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Ví của tôi</h1>
        <p className="text-sm text-slate-500">Quản lý số dư và theo dõi biến động</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
              <FaWallet className="text-indigo-600" size={20} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ví của bạn</div>
              <div className="font-semibold text-slate-800">{pocket?.label.slice(7)}</div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Mã ví</span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded block w-fit text-xs">
                {pocket?.pocketId || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Trạng thái</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                pocket?.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {pocket?.status === 'active' ? 'Hoạt động' : 'Khóa'}
              </span>
            </div>
          </div>

          {/* Số dư nổi bật */}
          <div className="mt-4 p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex justify-between items-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Số dư khả dụng</div>
              <div className="text-2xl font-black text-indigo-900 font-mono">
                {(pocket?.balance || 0).toLocaleString()} ₫
              </div>
            </div>
            <span className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-md font-bold font-mono">
              {pocket?.currencyCode || 'VND'}
            </span>
          </div>
        </div>

        {/* Box phải: Biến động gần đây */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
            <FaArrowUp size={14} className="text-emerald-500" />
            <FaArrowDown size={14} className="text-rose-500" />
            Biến động gần đây
          </h3>

          {txLoading ? (
            <div className="text-center py-6 text-slate-400 text-xs">Đang tải giao dịch...</div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">Chưa có giao dịch nào.</div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {recentTransactions.map((tx) => {
                const isOut = tx.senderPocketId === pocket?.pocketId;
                const isIn = tx.receiverPocketId === pocket?.pocketId;
                if (!isOut && !isIn) return null;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 cursor-pointer hover:bg-slate-50/50 rounded px-1 transition-all group"
                    onClick={() => navigate(`/history/${tx.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded-full ${isOut ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {isOut ? <FaArrowUp size={14} /> : <FaArrowDown size={14} />}
                      </span>
                      <div>
                        <div className="text-xs font-mono text-indigo-600 group-hover:text-indigo-800 group-hover:font-bold group-hover:italic transition-all">
                          {tx.transRefId}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xs font-bold ${isOut ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {isOut ? '-' : '+'}{tx.amount?.toLocaleString()} ₫
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            >
              Xem tất cả lịch sử →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pocket;