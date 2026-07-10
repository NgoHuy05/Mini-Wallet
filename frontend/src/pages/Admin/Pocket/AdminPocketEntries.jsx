import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaEye, FaDatabase, FaClock } from "react-icons/fa6";
import usePocketEntryStore from "../../../stores/usePocketEntryStore";
import PaginatorFilter from "../../../components/PaginatorFilter";

const AdminPocketEntries = () => {
  const { entries, loading, error, totalPages, listPocketEntries } = usePocketEntryStore();
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    listPocketEntries(page, limit);
  }, [page, limit, listPocketEntries]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ledger Pocket Entries</h1>
          <p className="text-sm text-gray-500">Hệ thống kế toán bút toán kép (Double-Entry) bất biến – Sổ cái Core-Engine.</p>
        </div>
        <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-700 border flex items-center gap-1.5">
          <FaDatabase className="text-slate-500" /> Hệ thống Real-time DB
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-lg">
          Lỗi Core Ledger: {error}
        </div>
      )}

      <PaginatorFilter
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Mã bút toán / Thời gian</th>
                <th className="p-4">Mã Ref Giao dịch</th>
                <th className="p-4 text-center">Thứ tự</th>
                <th className="p-4 text-rose-600 bg-rose-50/20">Debit (-) Tài khoản Nợ</th>
                <th className="p-4 w-4 text-center"></th>
                <th className="p-4 text-emerald-600 bg-emerald-50/20">Credit (+) Tài khoản Có</th>
                <th className="p-4">Số tiền dịch chuyển</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100 font-mono">
              {loading && entries.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-xs text-gray-400 italic">
                    Đang tải dữ liệu định khoản từ sổ cái hệ thống...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-xs text-gray-400 italic">
                    Chưa có bút toán nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50/70 transition-colors align-top">
                    <td className="p-4 space-y-1">
                      <div className="font-bold text-blue-950 text-xs">{e.id}</div>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 w-fit whitespace-nowrap">
                        <FaClock size={10} className="text-slate-400" />
                        {e.createdAt ? new Date(e.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </td>
                    
                    <td className="p-4 text-xs text-gray-400 select-all pt-5">{e.transRefId}</td>
                    <td className="p-4 text-center text-gray-600 pt-5">#{e.glStepOrder}</td>
                    <td className="p-4 text-rose-700 font-semibold bg-rose-50/10 text-xs pt-5">{e.debitPocketId}</td>
                    <td className="p-4 text-gray-300 text-center pt-5"><FaArrowRight size={11} /></td>
                    <td className="p-4 text-emerald-700 font-semibold bg-emerald-50/10 text-xs pt-5">{e.creditPocketId}</td>
                    <td className="p-4 font-bold text-slate-900 text-base pt-4">
                      {e.amount.toLocaleString()} {e.currencyCode === "VND" ? "₫" : e.currencyCode}
                    </td>
                    <td className="p-4 text-xs pt-5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4 text-center pt-4">
                      <Link
                        to={`/admin/pocket-entries/${e.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-sans font-semibold transition-colors"
                      >
                        <FaEye size={12} />Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPocketEntries;