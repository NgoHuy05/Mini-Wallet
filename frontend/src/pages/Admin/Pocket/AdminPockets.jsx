import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFilter, FaEye } from "react-icons/fa6";
import usePocketStore from "../../../stores/usePocketStore";
import PaginatorFilter from "../../../components/PaginatorFilter";

const AdminPockets = () => {
  const { pockets, loading, error, totalPages, listPockets } = usePocketStore();
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    listPockets(typeFilter, page, limit);
  }, [typeFilter, page, limit, listPockets]);

  return (
    <div className="space-y-6 p-4 relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Ví Toàn Hệ Thống</h1>
        <p className="text-sm text-gray-500">Giám sát dòng tiền, ví nghiệp vụ nội bộ, ví thanh khoản Bank, ví khách hàng và đối tác.</p>
      </div>

      {error && <div className="p-3 bg-red-50 border text-red-700 text-xs font-mono rounded-lg">{error}</div>}

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between text-xs">
        <div className="flex gap-2 items-center">
          <span className="text-gray-500 font-medium flex items-center gap-1"><FaFilter size={11}/> Phân loại ví:</span>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="border p-2 rounded-lg bg-white font-semibold text-gray-700 outline-none text-xs"
          >
            <option value="all">Tất cả các loại ví</option>
            <option value="system">Ví hệ thống (System)</option>
            <option value="bank">Ví ngân hàng (Bank)</option>
            <option value="customer">Ví khách hàng (Customer)</option>
            <option value="biller">Ví đối tác (Biller)</option>
          </select>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Tổng ví lọc được: <span className="font-bold text-slate-700">{pockets.length}</span>
        </div>
      </div>

      <PaginatorFilter
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Mã Ví (Pocket ID)</th>
                <th className="p-4">Phân loại</th>
                <th className="p-4">Tên nhãn ví</th>
                <th className="p-4">Số dư khả dụng</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y">
              {loading && pockets.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center italic text-gray-400">Đang tải cấu trúc dữ liệu ví...</td></tr>
              ) : (
                pockets.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-mono font-semibold text-blue-600">{p.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${p.type === 'system' ? 'bg-amber-100 text-amber-800' : p.type === 'bank' ? 'bg-blue-100 text-blue-800' : p.type === 'customer' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'}`}>{p.type}</span>
                    </td>
                    <td className="p-4 font-medium text-gray-900">{p.label || `Ví liên kết`}</td>
                    <td className="p-4 font-bold text-slate-900 font-mono text-base">{(p.balance || 0).toLocaleString()} ₫</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{p.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        to={`/admin/pockets/${p.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border rounded-lg text-xs font-semibold transition-colors"
                      >
                        <FaEye size={11} /> Xem chi tiết
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

export default AdminPockets;