import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaClock } from 'react-icons/fa6';
import useTransactionStore from '../../../stores/useTransactionStore';
import PaginatorFilter from '../../../components/PaginatorFilter';

const AdminTransactions = () => {
  const { transactions, loading, error, totalPages, fetchAdminTransactions } = useTransactionStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 20;

  useEffect(() => {
    fetchAdminTransactions(page, limit, statusFilter);
  }, [page, limit, statusFilter, fetchAdminTransactions]);

  const statuses = ['', 'processing', 'done', 'failed', 'reversed'];

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử Giao dịch</h1>
          <p className="text-sm text-gray-500">Sổ cái tổng hợp đầy đủ thuộc tính luồng dữ liệu tài chính.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              {statuses.filter(s => s).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <FaFilter className="absolute right-2 top-3 text-gray-400" size={12} />
          </div>
        </div>
      </div>

      {loading && <div className="text-center py-10 text-gray-500">Đang tải...</div>}
      {error && <div className="text-center py-10 text-red-500">Lỗi: {error}</div>}

      <PaginatorFilter
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Thông tin chung</th>
                  <th className="p-4">Luồng di chuyển Ví (Pocket IDs)</th>
                  <th className="p-4">Chi tiết Hoá đơn (Biller)</th>
                  <th className="p-4">Tài chính</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/70 transition-colors align-top">
                    <td className="p-4 space-y-1">
                      <div className="font-mono font-bold text-gray-900">{t.id}</div>
                      <div className="text-xs text-slate-400 font-mono">Ref: {t.transRefId}</div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 w-fit">
                        <FaClock size={10} className="text-slate-400" />
                        {t.createdAt ? new Date(t.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : 'N/A'}
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200/60 font-mono">
                          {t.serviceId}
                        </span>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-600 rounded">
                          {t.transactionType}
                        </span>
                      </div>
                      {t.message && (
                        <div className="text-xs text-gray-500 italic">"{t.message}"</div>
                      )}
                    </td>
                    
                    <td className="p-4 text-xs space-y-1.5 font-mono">
                      <div><span className="text-gray-400">Nguồn:</span> <span className="text-gray-700 font-medium">{t.senderPocketId}</span></div>
                      {t.receiverPocketId && <div><span className="text-gray-400">Đích:</span> <span className="text-emerald-700 font-medium">{t.receiverPocketId}</span></div>}
                      {t.billerPocketId && <div><span className="text-gray-400">Biller:</span> <span className="text-amber-700 font-medium">{t.billerPocketId}</span></div>}
                      {t.fee > 0 && t.systemPocketId && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <div><span className="text-gray-400">Nguồn:</span> <span className="text-gray-700 font-medium">{t.senderPocketId}</span></div>
                          <div><span className="text-gray-400">System:</span> <span className="text-indigo-700 font-medium">{t.systemPocketId}</span></div>
                          <div className="text-amber-600 text-[11px] ml-12">Phí: {t.fee.toLocaleString()} {t.currencyCode}</div>
                        </>
                      )}
                    </td>

                    <td className="p-4 text-xs space-y-1">
                      {t.transactionType === 'billpayment' ? (
                        <>
                          <div className="font-bold text-gray-800">
                            Nhà cung cấp: {t.billerCode || 'Chưa có mã biller'}
                          </div>
                          <div>
                            <span className="text-gray-400 font-mono">Mã hoá đơn:</span>{' '}
                            <span className="font-mono bg-slate-100 px-1 rounded">
                              {t.billCode || 'N/A'}
                            </span>
                          </div>
                          {t.billerRefId && (
                            <div>
                              <span className="text-gray-400 font-mono">Biller Ref:</span>{' '}
                              <span className="font-mono text-slate-500">{t.billerRefId}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="p-4 space-y-1 text-right pr-6">
                      <div className="font-medium text-gray-900">{t.amount.toLocaleString()} {t.currencyCode}</div>
                      <div className="text-xs text-amber-600">Phí: {t.fee.toLocaleString()} {t.currencyCode}</div>
                      <div className="font-bold text-slate-900 border-t border-slate-100 pt-0.5">
                        {t.total.toLocaleString()} {t.currencyCode}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        t.status === "done" ? "bg-emerald-100 text-emerald-800" :
                        t.status === "processing" ? "bg-amber-100 text-amber-800 animate-pulse" :
                        t.status === "failed" ? "bg-rose-100 text-rose-800" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {t.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => navigate(`/admin/transactions/${t.id}`)}
                          className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => navigate(`/admin/transaction-trails/${t.transRefId}`)}
                          className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
                        >
                          Trail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;