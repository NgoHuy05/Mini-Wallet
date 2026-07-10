import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGear, FaTrash, FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import useServiceStore from "../../../stores/useServiceStore";
import PaginatorFilter from "../../../components/PaginatorFilter";

const AdminServicesList = () => {
  const navigate = useNavigate();
  const { services, loading, error, totalPages, listServices, deleteFullServiceConfig } = useServiceStore();
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    listServices(page, limit);
  }, [page, limit, listServices]);

  const handleDelete = async (serviceId, serviceCode) => {
    if (!window.confirm(`Xóa dịch vụ [${serviceCode}] và toàn bộ cấu hình?`)) return;
    const result = await deleteFullServiceConfig(serviceId);
    if (result.success) {
      toast.success("Đã xóa service");
      listServices(page, limit);
    } else {
      toast.error("Lỗi xóa: " + (result.message || ""));
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ Engine</h1>
          <p className="text-sm text-gray-500">Tạo và cấu hình luồng xử lý giao dịch.</p>
        </div>
        <button
          onClick={() => navigate("/admin/services/detail/new")}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow"
        >
          <FaPlus size={12} /> Thêm Mới Service
        </button>
      </div>

      {loading && <div className="text-center py-4 text-gray-500">Đang tải...</div>}
      {error && <div className="text-center py-4 text-red-500">Lỗi: {error}</div>}

      <PaginatorFilter
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                <th className="p-4">Mã Dịch vụ</th>
                <th className="p-4">Tên Dịch vụ</th>
                <th className="p-4">Loại hình</th>
                <th className="p-4">Xác thực</th>
                <th className="p-4">Hành động</th>
                <th className="p-4">Biểu phí</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-mono font-semibold text-emerald-600">{svc.code}</td>
                  <td className="p-4 font-medium">{svc.name}</td>
                  <td className="p-4 font-medium text-slate-500">{svc.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${svc.auth === "PIN" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"}`}>
                      {svc.auth}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium">{svc.action}</td>
                  <td className="p-4 font-medium">
                    {svc.fee?.type === "fixed" ? (
                      <span>{svc.fee.value?.toLocaleString()} ₫</span>
                    ) : (
                      <span className="text-rose-700">{svc.fee?.value}%{svc.fee?.max ? ` (tối đa ${svc.fee.max.toLocaleString()}₫)` : ""}</span>
                    )}
                  </td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">Active</span></td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/admin/services/detail/${svc.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                    >
                      <FaGear size={12}/> Cấu hình
                    </button>
                    <button onClick={() => handleDelete(svc.id, svc.code)} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold">
                      <FaTrash size={11}/> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminServicesList;