import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTrailStore from "../../../stores/useTrailStore";
import { FaEye, FaClock, FaFilter } from "react-icons/fa6";
import PaginatorFilter from "../../../components/PaginatorFilter";

const AdminTransactionTrails = () => {
  const navigate = useNavigate();
  const { trails, loading, error, totalPages, listTrails } = useTrailStore();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 20;
  console.log(trails);

  useEffect(() => {
    listTrails(page, limit, statusFilter);
  }, [page, limit, statusFilter, listTrails]);

  const statuses = [
    "",
    "init",
    "pending",
    "confirmed",
    "processing",
    "done",
    "failed",
    "cancelled",
    "expired",
  ];

  const handleDetail = (transRefId) => {
    navigate(`/admin/transaction-trails/${transRefId}`);
  };

  return (
    <div className="space-y-6 p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction Trail Logs
          </h1>
          <p className="text-sm text-gray-500">Nhật ký truy vết giao dịch</p>
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            {statuses
              .filter((s) => s)
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
          <FaFilter
            className="absolute right-2 top-3 text-gray-400"
            size={12}
          />
        </div>
      </div>

      {loading && <div className="text-gray-500">Đang tải...</div>}
      {error && <div className="text-red-500">Lỗi: {error}</div>}

      <PaginatorFilter
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Mã Trail / Thời gian</th>
                <th className="p-4">Mã Ref Giao Dịch</th>
                <th className="p-4">Mã Dịch vụ</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-center">Xem trước</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {trails.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/70 transition-colors align-top"
                >
                  <td className="p-4 space-y-1">
                    <div className="font-mono font-bold text-blue-900">
                      {t.id}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">
                      <FaClock size={10} className="text-slate-400" />
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "N/A"}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs pt-5">{t.transRefId}</td>
                  <td className="p-4 font-medium pt-5">{t.serviceId}</td>
                  <td className="p-4 pt-5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                        t.status === "done"
                          ? "bg-emerald-100 text-emerald-800"
                          : t.status === "failed"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-center pt-5 font-semibold text-slate-900 max-w-xs break-words whitespace-normal">
                    {t.status === "done" ? (
                      `${t.preview.total?.toLocaleString()} ${t.preview.currency}`
                    ) : (
                      <span className="text-red-600" title={t.failureReason}>
                        {t.failureReason}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center pt-4">
                    <button
                      onClick={() => handleDetail(t.transRefId)}
                      className="inline-flex items-center gap-1 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm"
                    >
                      <FaEye size={12} /> Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionTrails;
