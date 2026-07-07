import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaLink, FaWallet, FaCircleDot } from "react-icons/fa6";
import useBillerStore from "../../../stores/useBillerStore";

const AdminBillerDetails = () => {
  const { billerId } = useParams();
  
  // --- Zustand Store ---
  const { biller, pocket, loading, error, getBillerDetail } = useBillerStore();

  useEffect(() => {
    if (billerId) {
      getBillerDetail(billerId);
    }
  }, [billerId, getBillerDetail]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-2">
        <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500">Đang nạp dữ liệu kết nối Gateway...</p>
      </div>
    );
  }

  if (error || !biller) {
    return (
      <div className="space-y-4 p-4">
        <Link to="/admin/billers" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
          <FaArrowLeft /> Quay lại danh sách
        </Link>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono">
          ⚠️ Không tìm thấy hoặc xảy ra lỗi khi lấy thông tin Biller: {error || "Biller rỗng"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link 
          to="/admin/billers" 
          className="p-2.5 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <FaArrowLeft size={14} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Chi tiết Biller Endpoints</h1>
          <p className="text-xs text-gray-500 mt-0.5">Nhà cung cấp: <span className="font-semibold text-gray-700">{biller.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cột trái: Thông tin Core & API Connection */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div className="border-b pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <FaLink className="text-blue-500"/> Integration & Core Endpoints
            </h3>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              biller.status === 'active' ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
            }`}>
              <FaCircleDot size={8} /> {biller.status?.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1">Biller ID (UUID)</label>
              <div className="font-mono text-xs text-gray-800 bg-gray-50 p-2.5 rounded border border-gray-200 break-all select-all">
                {biller.id}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1">Biller Code</label>
              <div className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50/30 p-2.5 rounded border border-emerald-100 select-all">
                {biller.code}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-1">Inquiry URL (Đầu nối kiểm tra nợ)</span>
              <input 
                readOnly 
                value={biller.inquiryUrl} 
                className="w-full font-mono text-xs bg-gray-50 text-blue-600 p-2.5 rounded border border-gray-200 focus:outline-none select-all font-bold" 
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-1">Payment URL (Đầu nối gạch nợ gốc)</span>
              <input 
                readOnly 
                value={biller.paymentUrl} 
                className="w-full font-mono text-xs bg-gray-50 text-blue-600 p-2.5 rounded border border-gray-200 focus:outline-none select-all font-bold" 
              />
            </div>
          </div>
        </div>

        {/* Cột phải: Thông tin ví Pocket của đối tác */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2 border-b pb-3">
              <FaWallet className="text-purple-500"/> Ví thụ hưởng đối tác
            </h3>
            
            {pocket ? (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-gray-400 block font-sans">Pocket ID:</span>
                  <span className="text-gray-800 text-[11px] block bg-purple-50/40 p-2 rounded border border-purple-100 select-all font-bold">
                    {pocket.id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-sans">Tên hiển thị ví:</span>
                  <span className="text-gray-800 block font-sans font-semibold">{pocket.label}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-sans">Số dư khả dụng (Balance):</span>
                  <span className="text-base font-bold text-purple-700 font-mono">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: pocket.currencyCode || "VND" }).format(pocket.balance || 0)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Không tìm thấy ví thụ hưởng liên kết với Biller này.</p>
            )}
          </div>

          {pocket && (
            <div className="p-2.5 bg-gray-50 rounded border border-gray-100 text-[10px] text-gray-400 font-mono">
              <span className="font-semibold block font-sans text-gray-500">Security Checksum:</span>
              <span className="break-all">{pocket.checksum}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBillerDetails;