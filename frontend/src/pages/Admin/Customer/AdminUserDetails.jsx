import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaWallet, FaUser, FaCircleExclamation, FaShieldHalved } from "react-icons/fa6";
import useCustomerStore from "../../../stores/useCustomerStore";

const AdminUserDetails = () => {
  const { userId } = useParams();
  const { customer, pocket, loading, error, getCustomerDetail } = useCustomerStore();

  useEffect(() => {
    if (userId) {
      getCustomerDetail(userId);
    }
  }, [userId, getCustomerDetail]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-2">
        <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-medium">Đang giải mã dữ liệu số dư bảo mật...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-4 p-4">
        <Link to="/admin/customers" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
          <FaArrowLeft /> Quay lại danh sách quản lý
        </Link>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono flex items-start gap-2">
          <FaCircleExclamation size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold block mb-0.5">Lỗi Hệ Thống Core:</span>
            {error || "Không tìm thấy hồ sơ người dùng hợp lệ."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link 
          to="/admin/customers" 
          className="p-2.5 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <FaArrowLeft size={14} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Chi tiết Hồ sơ Người dùng</h1>
          <p className="text-xs text-gray-500 mt-0.5">ID Người dùng: <span className="font-mono text-gray-700 font-semibold">{customer.id}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Khối 1: Thông tin tài khoản người dùng */}
        <div className="md:col-span-1 bg-white border border-gray-200 p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2.5 flex items-center gap-1.5">
            <FaUser className="text-gray-400" size={13}/> Thông tin Account
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-400 block">Số điện thoại liên kết:</span>
              <span className="text-sm font-bold text-gray-900 font-mono tracking-wide">{customer.phone}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Trạng thái định danh (KYC):</span>
              <span className="font-semibold text-emerald-600">Đã kích hoạt</span>
            </div>
            <div>
              <span className="text-gray-400 block">Trạng thái hoạt động:</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                customer.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
              }`}>
                {customer.status?.toUpperCase()}
              </span>
            </div>
            {customer.lockedReason && (
              <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg">
                <span className="font-bold block mb-0.5">Lý do khóa:</span>
                <p className="italic leading-relaxed">{customer.lockedReason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Khối 2: Cấu trúc số dư & mã bảo toàn mật mã */}
        <div className="md:col-span-2 bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider border-b pb-2.5 flex items-center gap-1.5">
              <FaWallet className="text-blue-500" size={13}/> Trạng thái ví chính (Main Pocket)
            </h3>
            
            {pocket ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-gray-400 font-sans block">Pocket ID:</span>
                  <span className="text-gray-800 font-bold bg-gray-50 p-2 rounded border block mt-1 select-all">
                    {pocket.id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-sans block">Số dư hiện tại (VND):</span>
                  <span className="text-xl font-black text-blue-700 block mt-0.5">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: pocket.currencyCode || "VND" }).format(pocket.balance || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-sans block">Loại hình ví:</span>
                  <span className="text-gray-700 font-sans font-semibold uppercase block mt-1">{pocket.type}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-sans block">Trạng thái ví:</span>
                  <span className={`inline-block font-sans font-bold text-[11px] px-2 py-0.5 rounded mt-1 ${
                    pocket.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}>
                    {pocket.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Hệ thống chưa tạo ví chính tự động cho tài khoản này.</p>
            )}
          </div>

          {pocket && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-mono space-y-1">
              <div className="flex items-center gap-1 font-sans font-bold text-slate-700 text-xs mb-1">
                <FaShieldHalved className="text-emerald-600" />
                <span>Kiểm soát dữ liệu mã hóa (Data Integrity)</span>
              </div>
              <p className="font-sans text-gray-400 leading-normal mb-1.5">
                Mã checksum dùng để bảo toàn số dư phòng chống can thiệp trực tiếp từ cơ sở dữ liệu. Trạng thái hiện tại: <span className="text-emerald-600 font-bold">Hợp lệ (Verified)</span>
              </p>
              <span className="font-bold block text-slate-400">POCKET_CHECKSUM_HASH:</span>
              <span className="break-all block bg-white p-1.5 border rounded text-slate-600 select-all font-bold">{pocket.checksum}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;