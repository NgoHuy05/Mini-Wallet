// src/pages/admin/AdminPocketDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaUser, FaBuildingColumns, 
  FaFileInvoiceDollar, FaGear, FaArrowUp, FaArrowDown 
} from "react-icons/fa6";
import usePocketStore from "../../../stores/usePocketStore";
import api from "../../../api";

const AdminPocketDetails = () => {
  const { pocketId } = useParams();
  const navigate = useNavigate();
  const { pocket, loading, error, getDetailPocket } = usePocketStore();
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  useEffect(() => {
    if (pocketId) {
      getDetailPocket(pocketId);
    }
  }, [pocketId, getDetailPocket]);

  // Fetch biến động số dư (pocket entries)
  useEffect(() => {
    if (!pocketId) return;
    const fetchEntries = async () => {
      setLoadingEntries(true);
      try {
        const res = await api.post('/admin/pocket-entries/by-pocket', { pocketId, page: 1, limit: 10 });
        const data = res.data;
        if (data.err === 200) {
          setEntries(data.data.entries || []);
        } else {
          console.error('Lỗi fetch entries:', data.message);
        }
      } catch (err) {
        console.error('Lỗi fetch entries:', err.message);
      } finally {
        setLoadingEntries(false);
      }
    };
    fetchEntries();
  }, [pocketId]);

  if (loading) {
    return <div className="p-8 text-center text-xs font-medium text-gray-500">Đang tải thông tin ví...</div>;
  }

  if (error || !pocket) {
    return (
      <div className="space-y-4 p-4">
        <Link to="/admin/pockets" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
          <FaArrowLeft /> Quay về danh sách ví
        </Link>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono">
          Lỗi: {error || "Không tìm thấy ví."}
        </div>
      </div>
    );
  }

  // Helper lấy icon theo loại ví
  const getOwnerIcon = () => {
    switch (pocket.type) {
      case 'customer': return <FaUser className="text-emerald-500" size={18} />;
      case 'bank': return <FaBuildingColumns className="text-blue-500" size={18} />;
      case 'biller': return <FaFileInvoiceDollar className="text-purple-500" size={18} />;
      default: return <FaGear className="text-amber-500" size={18} />;
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/pockets" className="p-2 bg-white rounded-lg border text-gray-600 shadow-sm hover:bg-gray-50">
          <FaArrowLeft size={14} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Chi tiết Ví</h1>
      </div>

      {/* 2 box cùng hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box trái: Thông tin ví */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="p-2.5 bg-gray-50 rounded-lg border">{getOwnerIcon()}</div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Loại ví</div>
              <div className="font-semibold text-gray-800 capitalize">{pocket.type}</div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400 block text-xs">Mã ví (Pocket ID)</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded block w-fit text-xs">{pocket.id}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">Nhãn</span>
              <span className="font-medium text-gray-800">{pocket.label || 'Không có nhãn'}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">Trạng thái</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                pocket.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>{pocket.status}</span>
            </div>
          </div>

          {/* Số dư nổi bật */}
          <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl flex justify-between items-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Số dư khả dụng</div>
              <div className="text-2xl font-black text-emerald-900 font-mono">{(pocket.balance || 0).toLocaleString()} ₫</div>
            </div>
            <span className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-md font-bold font-mono">{pocket.currencyCode || 'VND'}</span>
          </div>
        </div>

        {/* Box phải: Biến động số dư gần đây */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
            <FaArrowUp size={14} className="text-emerald-500" />
            <FaArrowDown size={14} className="text-rose-500" />
            Biến động số dư gần đây
          </h3>

          {loadingEntries ? (
            <div className="text-center py-6 text-gray-400 text-xs">Đang tải lịch sử giao dịch...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs">Chưa có giao dịch nào cho ví này.</div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {entries.map((entry) => {
                const isOut = entry.debitPocketId === pocketId;
                return (
                  <div key={entry.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded-full ${isOut ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {isOut ? <FaArrowUp size={15} /> : <FaArrowDown size={15} />}
                      </span>
                      <div>
                        <div
                          className="text-xs font-mono text-blue-600 cursor-pointer hover:text-blue-800 hover:font-bold hover:italic transition-all group"
                          onClick={() => navigate(`/admin/transaction-trails/${entry.transRefId}`)}
                        >
                          Mã REF GIAO DỊCH: {entry.transRefId || 'N/A'}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleString('vi-VN', { 
                            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' 
                          }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xs font-bold ${isOut ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {isOut ? '-' : '+'}{entry.amount.toLocaleString()} ₫
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPocketDetails;