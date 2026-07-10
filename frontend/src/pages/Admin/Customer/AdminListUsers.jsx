import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLock, FaLockOpen, FaMagnifyingGlass, FaFilter, FaXmark, FaEye } from "react-icons/fa6";
import useCustomerStore from "../../../stores/useCustomerStore";
import PaginatorFilter from "../../../components/PaginatorFilter";

const AdminListUsers = () => {
  const { customers, loading, error, totalPages, listCustomers, lockCustomer, unlockCustomer } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustId, setSelectedCustId] = useState(null);
  const [reasonInput, setReasonInput] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    listCustomers(searchTerm, page, limit);
  }, [searchTerm, page, limit, listCustomers]);

  const filteredCustomers = customers.filter(c => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  const handleOpenLockModal = (id) => {
    setSelectedCustId(id);
    setReasonInput("");
  };

  const handleConfirmLock = async (e) => {
    e.preventDefault();
    if (!reasonInput.trim()) return alert("Vui lòng nhập lý do khóa tài khoản!");
    const res = await lockCustomer(selectedCustId, reasonInput.trim());
    if (res.success) {
      setSelectedCustId(null);
    } else {
      alert(`Lỗi khóa tài khoản: ${res.message}`);
    }
  };

  const handleUnlockUser = async (id, phone) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn MỞ KHÓA lại cho tài khoản [ ${phone} ] và giải phóng ví tiền?`);
    if (isConfirmed) {
      const res = await unlockCustomer(id);
      if (!res.success) {
        alert(`Lỗi mở khóa tài khoản: ${res.message}`);
      }
    }
  };

  return (
    <div className="space-y-6 p-4 relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Khách hàng</h1>
        <p className="text-sm text-gray-500 mt-1">
          Giám sát trạng thái vận hành của End-user, kiểm soát dòng tiền, đóng băng số dư ví và xử lý vi phạm.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="w-full md:w-80 relative">
          <FaMagnifyingGlass className="absolute left-3 top-3 text-gray-400" size={13} />
          <input
            type="text"
            placeholder="Tìm kiếm chính xác số điện thoại..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white font-mono text-gray-900 transition-all outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {loading && (
            <div className="absolute right-3 top-3 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-end items-center">
          <span className="text-gray-500 font-medium flex items-center gap-1"><FaFilter size={11}/> Lọc Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg bg-white font-semibold text-gray-700 outline-none focus:border-blue-500 text-xs cursor-pointer"
          >
            <option value="all">Tất cả người dùng</option>
            <option value="active">Chỉ tài khoản Hoạt động (Active)</option>
            <option value="locked">Chỉ tài khoản Bị Khóa (Locked)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-mono">
          ⚠️ System Error: {error}
        </div>
      )}

      {selectedCustId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleConfirmLock} className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xl w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-xs font-bold text-rose-700 flex items-center gap-1.5 uppercase font-mono tracking-wide">
                <FaLock size={12}/> Đình chỉ & Phong tỏa ví khách hàng
              </h3>
              <button type="button" onClick={() => setSelectedCustId(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaXmark size={16}/>
              </button>
            </div>
            
            <div className="text-xs space-y-3">
              <p className="text-gray-500 leading-relaxed">
                Hành động này sẽ **đóng băng ngay lập tức** ví điện tử chính (`pocketId`) liên kết với tài khoản này. 
                Mọi giao dịch thanh toán hoặc nạp rút phát sinh sẽ bị hệ thống Core Engine từ chối hoàn toàn.
              </p>
              <div>
                <label className="block text-gray-700 font-bold mb-1.5">Lý do xử lý vi phạm *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ví dụ: Phát hiện hành vi rửa tiền / Nghi ngờ trục lợi chính sách khuyến mãi / Yêu cầu từ cơ quan chức năng..."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg bg-slate-50 font-sans text-gray-900 outline-none focus:border-rose-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs font-bold">
              <button type="button" onClick={() => setSelectedCustId(null)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Hủy bỏ</button>
              <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-colors">Xác nhận phong tỏa</button>
            </div>
          </form>
        </div>
      )}

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
                <th className="p-4">Mã Khách Hàng</th>
                <th className="p-4">Số Điện Thoại</th>
                <th className="p-4">Mã Ví Chính</th>
                <th className="p-4">Trạng Thái Ví</th>
                <th className="p-4">Lý Do Khóa Hệ Thống</th>
                <th className="p-4 text-center w-56">Hành Động Kiểm Soát</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                    {loading ? "Đang truy vấn dữ liệu..." : "Không tìm thấy khách hàng nào khớp với điều kiện lọc."}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500 font-medium">{c.id}</td>
                    <td className="p-4 font-bold text-gray-900 font-mono tracking-wide">{c.phone}</td>
                    <td className="p-4 font-mono text-xs text-blue-600 font-bold bg-blue-50/20">{c.pocketId}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                        {c.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-rose-600 font-medium max-w-xs truncate" title={c.lockedReason}>
                      {c.lockedReason || <span className="text-gray-300">-</span>}
                    </td>
                    <td className="p-4 text-center flex items-center justify-center gap-2">
                      <Link 
                        to={`/admin/users/${c.id}`} 
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
                        title="Xem chi tiết số dư & Hồ sơ"
                      >
                        <FaEye size={12}/> Xem chi tiết
                      </Link>

                      {c.status === "active" ? (
                        <button
                          onClick={() => handleOpenLockModal(c.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                        >
                          <FaLock size={11} /> Khóa ví
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnlockUser(c.id, c.phone)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <FaLockOpen size={11} /> Mở khóa
                        </button>
                      )}
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

export default AdminListUsers;