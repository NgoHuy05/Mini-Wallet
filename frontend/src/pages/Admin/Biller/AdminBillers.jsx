import { useState, useEffect } from "react";
import { FaGear, FaArrowLeft, FaPlus, FaTrash, FaCheck, FaPenToSquare } from "react-icons/fa6";
import { toast } from "react-toastify";
import useBillerStore from "../../../stores/useBillerStore";
import PaginatorFilter from "../../../components/PaginatorFilter";

const AdminBillers = () => {
  const { billers, loading, error, totalPages, listBillers, createBiller, updateBiller } = useBillerStore();
  const [page, setPage] = useState(1);
  const limit = 20;

  const [editingBillerId, setEditingBillerId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddBillerForm, setShowAddBillerForm] = useState(false);
  const [newBillerData, setNewBillerData] = useState({
    code: "",
    name: "",
    inquiryUrl: "",
    paymentUrl: "",
  });

  useEffect(() => {
    listBillers(page, limit);
  }, [page, limit, listBillers]);

  const currentBiller = billers.find((b) => b.id === editingBillerId);

  const handleCreateBiller = async (e) => {
    e.preventDefault();
    if (!newBillerData.code || !newBillerData.name) {
      toast.warning("Vui lòng nhập Mã và Tên Nhà Cung Cấp!");
      return;
    }

    const cleanCode = newBillerData.code.trim().toUpperCase();
    const lowerCode = cleanCode.toLowerCase().replace(/_/g, "-");
    const finalInquiryUrl = newBillerData.inquiryUrl.trim() || `https://api.partner.com/${lowerCode}/inquiry`;
    const finalPaymentUrl = newBillerData.paymentUrl.trim() || `https://api.partner.com/${lowerCode}/payment`;

    const res = await createBiller(cleanCode, newBillerData.name.trim(), finalInquiryUrl, finalPaymentUrl);

    if (res.success) {
      toast.success("Tạo đối tác Biller thành công!");
      setNewBillerData({ code: "", name: "", inquiryUrl: "", paymentUrl: "" });
      setShowAddBillerForm(false);
      listBillers(page, limit);
    } else {
      toast.error(`Lỗi: ${res.message}`);
    }
  };

  const handleDeleteBiller = (billerId, billerCode) => {
    toast.warning(`Tính năng xóa đối tác [ ${billerCode} ] bị từ chối!\nBackend Core không hỗ trợ Hard-Delete để bảo toàn lịch sử giao dịch.`);
  };

  const handleSaveDetails = async () => {
    if (!currentBiller) return;
    const res = await updateBiller(currentBiller.id, {
      name: currentBiller.name,
      inquiryUrl: currentBiller.inquiryUrl,
      paymentUrl: currentBiller.paymentUrl,
      status: currentBiller.status
    });
    if (res.success) {
      toast.success("Cập nhật Biller thành công!");
      setIsEditing(false);
      listBillers(page, limit);
    } else {
      toast.error(`Cập nhật thất bại: ${res.message}`);
    }
  };

  const handleLocalFieldChange = (fieldKey, value) => {
    useBillerStore.setState((state) => ({
      billers: state.billers.map((b) =>
        b.id === editingBillerId ? { ...b, [fieldKey]: value } : b
      ),
    }));
  };

  if (loading && billers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-2">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-medium">Đang tải cấu hình kết nối Biller...</p>
      </div>
    );
  }

  if (!editingBillerId) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Đối tác Biller</h1>
            <p className="text-sm text-gray-500 mt-1">
              Danh sách và cấu hình đầu mối tích hợp thanh toán hóa đơn của các đối tác Core-System.
            </p>
          </div>
          <button
            onClick={() => setShowAddBillerForm(!showAddBillerForm)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-white font-semibold rounded-lg text-xs transition-all shadow-sm ${
              showAddBillerForm ? "bg-gray-600 hover:bg-gray-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            <FaPlus size={12} /> {showAddBillerForm ? "Đóng trình khai báo" : "Khai báo Biller mới"}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-mono">
            Hệ thống lỗi: {error}
          </div>
        )}

        {showAddBillerForm && (
          <form
            onSubmit={handleCreateBiller}
            className="bg-white p-5 rounded-xl border border-emerald-200 shadow-md space-y-4 max-w-4xl"
          >
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Khai báo đối tác Biller mới & Cấp Ví thụ hưởng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Mã Biller *</label>
                <input
                  type="text"
                  placeholder="e.g. WATER_DN"
                  required
                  value={newBillerData.code}
                  onChange={(e) => setNewBillerData({ ...newBillerData, code: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded bg-white font-mono uppercase focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Tên Nhà Cung Cấp *</label>
                <input
                  type="text"
                  placeholder="e.g. Cấp nước Đà Nẵng"
                  required
                  value={newBillerData.name}
                  onChange={(e) => setNewBillerData({ ...newBillerData, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Inquiry URL Endpoint</label>
                <input
                  type="text"
                  placeholder="Để trống hệ thống tự sinh"
                  value={newBillerData.inquiryUrl}
                  onChange={(e) => setNewBillerData({ ...newBillerData, inquiryUrl: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded bg-white font-mono text-[11px] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 font-semibold">Payment URL Endpoint</label>
                <input
                  type="text"
                  placeholder="Để trống hệ thống tự sinh"
                  value={newBillerData.paymentUrl}
                  onChange={(e) => setNewBillerData({ ...newBillerData, paymentUrl: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded bg-white font-mono text-[11px] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded shadow hover:bg-emerald-700 disabled:bg-gray-400 transition-all"
              >
                {loading ? "Đang xử lý tạo ví..." : "Xác nhận khởi tạo & Tạo ví thụ hưởng"}
              </button>
            </div>
          </form>
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
                  <th className="p-4">Mã Biller</th>
                  <th className="p-4">Tên Nhà Cung Cấp</th>
                  <th className="p-4">Ví thụ hưởng (Pocket ID)</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center w-40">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {billers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400 italic">
                      Chưa có cấu hình nhà cung cấp nào trên hệ thống.
                    </td>
                  </tr>
                ) : (
                  billers.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-emerald-600">{b.code}</td>
                      <td className="p-4 font-medium text-gray-900">{b.name}</td>
                      <td className="p-4 font-mono text-xs text-purple-700 bg-purple-50/40 font-semibold rounded-md">
                        {b.pocketId}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          b.status === 'active' ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-center flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingBillerId(b.id);
                            setIsEditing(false);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                        >
                          <FaGear size={12} /> Cấu hình
                        </button>
                        <button
                          onClick={() => handleDeleteBiller(b.id, b.code)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <FaTrash size={11} /> Xóa
                        </button>
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
  }

  if (!currentBiller) return null;

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Cấu hình Gateway: {currentBiller.name}
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                isEditing ? "bg-rose-100 text-rose-700 animate-pulse" : "bg-slate-100 text-slate-500"
              }`}
            >
              {isEditing ? "Chế độ Chỉnh sửa" : "Chế độ Xem (Read-only)"}
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Internal ID: {currentBiller.id} | Code: <span className="text-emerald-600 font-bold">{currentBiller.code}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleSaveDetails}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow flex items-center gap-1.5"
            >
              <FaCheck size={12} /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow flex items-center gap-1.5"
            >
              <FaPenToSquare size={12} /> Mở khóa chỉnh sửa
            </button>
          )}
          <button
            onClick={() => setEditingBillerId(null)}
            className="bg-slate-500 hover:bg-slate-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow flex items-center gap-1.5"
          >
            <FaArrowLeft size={12} /> Quay lại danh sách
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-slate-800 font-sans uppercase border-b pb-2 tracking-wide">
          Gateway Integration Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-gray-500 font-bold">Mã định danh đối tác (Biller Code):</label>
            <input
              type="text"
              disabled={true}
              value={currentBiller.code}
              className="w-full border border-gray-200 p-2.5 rounded bg-gray-100 text-gray-500 font-bold cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-500 font-bold">Tên hiển thị (Biller Name):</label>
            <input
              type="text"
              disabled={!isEditing}
              value={currentBiller.name}
              onChange={(e) => handleLocalFieldChange("name", e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded disabled:bg-slate-50 text-slate-900 font-sans font-semibold focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-500 font-bold">Inquiry Endpoint (Truy vấn nợ):</label>
            <input
              type="text"
              disabled={!isEditing}
              value={currentBiller.inquiryUrl}
              onChange={(e) => handleLocalFieldChange("inquiryUrl", e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded disabled:bg-slate-50 text-blue-600 font-bold focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-500 font-bold">Payment Endpoint (Gạch nợ):</label>
            <input
              type="text"
              disabled={!isEditing}
              value={currentBiller.paymentUrl || ""}
              onChange={(e) => handleLocalFieldChange("paymentUrl", e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded disabled:bg-slate-50 text-blue-600 font-bold focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-500 font-bold">Trạng thái hoạt động (Status):</label>
            <select
              disabled={!isEditing}
              value={currentBiller.status}
              onChange={(e) => handleLocalFieldChange("status", e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded disabled:bg-slate-50 text-slate-800 font-semibold focus:border-blue-500 focus:outline-none"
            >
              <option value="active">ACTIVE</option>
              <option value="inactive">INACTIVE</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-gray-500 font-bold">Settlement Pocket ID (Ví đối tác tự sinh):</label>
            <input
              type="text"
              disabled={true}
              value={currentBiller.pocketId}
              className="w-full border border-purple-200 p-2.5 rounded bg-purple-50/50 text-purple-700 font-bold cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBillers;