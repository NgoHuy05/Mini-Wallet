import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaShield, FaDatabase, FaClock, FaRoute, FaRightLeft } from "react-icons/fa6"; 
import usePocketEntryStore from "../../../stores/usePocketEntryStore";

const AdminPocketEntryDetails = () => {
  const { entryId } = useParams();
  const { entry, loading, error, getPocketEntryDetail } = usePocketEntryStore();

  useEffect(() => {
    if (entryId) {
      getPocketEntryDetail(entryId);
    }
  }, [entryId, getPocketEntryDetail]);

  if (loading) {
    return <div className="p-8 text-center text-xs font-medium font-mono text-gray-500 animate-pulse">Đang tra cứu dữ liệu hạch toán từ cơ sở dữ liệu gốc...</div>;
  }

  if (error || !entry) {
    return (
      <div className="space-y-4 p-4 text-xs font-sans">
        <Link to="/admin/pocket-entries" className="inline-flex items-center gap-1 text-blue-600 hover:underline"><FaArrowLeft /> Quay về danh sách sổ cái</Link>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-mono">
          <span className="font-bold block uppercase">Lỗi hạch toán tài chính:</span> {error || "Không tìm thấy mã bút toán hệ thống."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <Link to="/admin/pocket-entries" className="p-2 bg-white rounded-lg border text-gray-600 shadow-xs hover:bg-gray-50 transition-colors">
          <FaArrowLeft size={14} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Chi tiết Bút toán Kế toán Ví</h1>
          <p className="text-xs text-gray-500">Mã bút toán bất biến: <span className="font-mono text-slate-700 font-bold">{entry.id}</span></p>
        </div>
      </div>

      {/* Cấu trúc 2 Cột chống trống trải giao diện Admin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI (2/3): THÔNG TIN ĐỊNH KHOẢN TÀI CHÍNH */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card Dịch chuyển dòng tiền (Core Double-Entry Logic) */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <FaRightLeft size={12}/> Định khoản hạch toán dòng tiền
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-xl space-y-1">
                <span className="text-rose-600 font-bold uppercase tracking-wider text-[10px] block">Debit (-) Tài khoản Ghi Nợ</span>
                <span className="text-gray-900 font-bold text-sm block break-all">{entry.debitPocketId}</span>
                <span className="text-[10px] text-gray-400 block pt-1">Hành động: Giảm trừ dòng tiền khả dụng</span>
              </div>

              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-1">
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] block">Credit (+) Tài khoản Ghi Có</span>
                <span className="text-gray-900 font-bold text-sm block break-all">{entry.creditPocketId}</span>
                <span className="text-[10px] text-gray-400 block pt-1">Hành động: Tăng cộng dòng tiền khả dụng</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border rounded-xl flex justify-between items-center">
              <div>
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Tổng giá trị dịch chuyển</span>
                <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                  {entry.amount?.toLocaleString()} ₫
                </span>
              </div>
              <span className="text-xs bg-slate-900 text-white px-2 py-1 rounded font-bold font-mono uppercase tracking-wider">{entry.currencyCode || 'VND'}</span>
            </div>
          </div>

          {/* Card Metadata hệ thống */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <FaDatabase size={12}/> Toàn vẹn hệ thống & Thời gian
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400 block">Thời gian hạch toán:</span>
                <span className="font-mono text-gray-800 font-semibold flex items-center gap-1">
                  <FaClock className="text-gray-400"/> {entry.createdAt ? new Date(entry.createdAt).toLocaleString('vi-VN') : "2026-06-15 09:12:44"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block">Trạng thái đồng bộ Sổ cái:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700 uppercase tracking-wide text-[10px] font-mono">
                  {entry.status || "settled"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI (1/3): TRÁI TIM KIỂM SOÁT GIAO DỊCH (AUDIT REFERENCE) */}
        <div className="space-y-6">
          
          {/* Card Reference định vị giao dịch */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 font-sans">
              <FaRoute size={12}/> Kiểm soát dấu vết (Audit Trace)
            </h3>

            <div className="space-y-1 font-mono">
              <span className="text-gray-400 block font-sans">Mã Reference Giao dịch gốc (transRefId):</span>
              <div className="p-2 bg-slate-50 border rounded text-slate-800 break-all select-all text-xs font-bold font-mono">
                {entry.transRefId}
              </div>
              <p className="text-[10px] font-sans text-gray-400 leading-normal pt-1">
                Mã này dùng để nhóm tất cả các bước định khoản (`glStepOrder`) thuộc cùng một phiên giao dịch tài chính lại với nhau.
              </p>
            </div>

            <div className="flex justify-between items-center border-t pt-3 font-mono">
              <span className="text-gray-500 font-sans">Thứ tự bước định khoản:</span>
              <span className="bg-slate-900 text-white font-bold px-2 py-0.5 rounded text-xs">
                #{entry.glStepOrder}
              </span>
            </div>
          </div>

          {/* Card nguyên tắc bất biến */}
          <div className="bg-slate-900 text-slate-300 p-5 rounded-xl space-y-2 border border-slate-950 font-mono text-xs">
            <div className="text-amber-400 font-bold flex items-center gap-1.5 font-sans uppercase text-[11px] tracking-wider">
              <FaShield size={13}/> Sổ cái bất biến (Immutable Ledger)
            </div>
            <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
              Dữ liệu bút toán sau khi đã chuyển sang trạng thái <span className="text-blue-400 font-bold font-mono">SETTLED</span> sẽ không thể sửa đổi hoặc xóa bỏ. Bất kỳ sự can thiệp sai lệch nào vào Database thô sẽ làm gãy chuỗi Checksum của Ví liên quan.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminPocketEntryDetails;