// pages/Admin/Transaction/AdminTransactionDetail.jsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useTransactionStore from '../../../stores/useTransactionStore';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaHistory } from 'react-icons/fa';

const AdminTransactionDetail = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { transactionDetail, loading, error, fetchTransactionDetail } = useTransactionStore();

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetail(transactionId);
    }
  }, [transactionId, fetchTransactionDetail]);

  if (loading) return <div className="text-center py-10 text-gray-500">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error}</div>;
  if (!transactionDetail) return <div className="text-center py-10">Không tìm thấy giao dịch</div>;

  const t = transactionDetail;

  // Mapping màu sắc mới
  const colorMap = {
    emerald: {
      bg: 'bg-blue-500 hover:bg-blue-600',
      text: 'text-blue-700',
      light: 'bg-blue-50',
      border: 'border-blue-200'
    },
    indigo: {
      bg: 'bg-purple-500 hover:bg-purple-600',
      text: 'text-purple-700',
      light: 'bg-purple-50',
      border: 'border-purple-200'
    },
    amber: {
      bg: 'bg-amber-500 hover:bg-amber-600',
      text: 'text-amber-700',
      light: 'bg-amber-50',
      border: 'border-amber-200'
    }
  };

  // Xây dựng danh sách các luồng từ Sender đến các đích kèm số tiền
  const flows = [];
  if (t.transactionType === 'p2p') {
    if (t.receiverPocketId) {
      flows.push({
        label: 'Ví đích (Receiver)',
        pocketId: t.receiverPocketId,
        color: 'emerald',
        amount: t.amount
      });
    }
    if (t.systemPocketId) {
      flows.push({
        label: 'Ví System',
        pocketId: t.systemPocketId,
        color: 'indigo',
        amount: t.fee
      });
    }
  } else if (t.transactionType === 'billpayment') {
    if (t.billerPocketId) {
      flows.push({
        label: 'Ví Biller',
        pocketId: t.billerPocketId,
        color: 'amber',
        amount: t.amount
      });
    }
    if (t.systemPocketId) {
      flows.push({
        label: 'Ví System',
        pocketId: t.systemPocketId,
        color: 'indigo',
        amount: t.fee
      });
    }
  } else {
    // fallback cho cashin hoặc các loại khác
    if (t.receiverPocketId) {
      flows.push({
        label: 'Ví đích (Receiver)',
        pocketId: t.receiverPocketId,
        color: 'emerald',
        amount: t.amount
      });
    }
    if (t.systemPocketId) {
      flows.push({
        label: 'Ví System',
        pocketId: t.systemPocketId,
        color: 'indigo',
        amount: t.fee
      });
    }
    if (t.billerPocketId) {
      flows.push({
        label: 'Ví Biller',
        pocketId: t.billerPocketId,
        color: 'amber',
        amount: t.amount
      });
    }
  }

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 shadow-sm"
        >
          <FaArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết Giao dịch</h1>
          <p className="text-sm text-gray-500 font-mono">{t.id}</p>
        </div>
        <Link
          to={`/admin/transaction-trails/${t.transRefId}`}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm"
        >
          <FaHistory size={14} /> Xem Transaction Trail
        </Link>
      </div>

      {/* Hàng 1: Thông tin chung + Tài chính (2 cột) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột 1: Thông tin chung */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Thông tin chung
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400 block">Mã giao dịch</span>
              <span className="font-mono font-semibold text-gray-900 break-all">{t.id}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Mã tham chiếu (transRefId)</span>
              <span className="font-mono text-gray-900 break-all">{t.transRefId}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Loại giao dịch</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                t.transactionType === 'p2p' ? 'bg-blue-100 text-blue-800' :
                t.transactionType === 'cashin' ? 'bg-green-100 text-green-800' :
                t.transactionType === 'billpayment' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {t.transactionType}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block">Dịch vụ </span>
              <span className="font-mono text-gray-900">{t.serviceId} {t.transactionType}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Người khởi tạo</span>
              <span className="font-mono text-gray-900">{t.triggeredById}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Thời gian</span>
              <span className="text-gray-900">{new Date(t.createdAt).toLocaleString()}</span>
            </div>
            {t.message && (
              <div className="col-span-2">
                <span className="text-gray-400 block">Lời nhắn</span>
                <span className="italic text-gray-700">"{t.message}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Cột 2: Tài chính */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tài chính
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">Số tiền giao dịch</span>
              <span className="font-semibold text-gray-900">{t.amount?.toLocaleString()} {t.currencyCode}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-amber-700">Phí giao dịch</span>
              <span className="font-semibold text-amber-700">{t.fee?.toLocaleString()} {t.currencyCode}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-900 font-bold">Tổng cộng</span>
              <span className="font-bold text-lg text-blue-900">{t.total?.toLocaleString()} {t.currencyCode}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-500">Trạng thái</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                t.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                t.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                t.status === 'failed' ? 'bg-rose-100 text-rose-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {t.status === 'done' && <FaCheckCircle size={12} />}
                {t.status === 'failed' && <FaTimesCircle size={12} />}
                {t.status === 'processing' && <FaClock size={12} />}
                {t.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hàng 2: Ví & Đối tác (full width) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span> Ví & Đối tác
        </h2>
        <div className="space-y-4">
          {t.senderPocketId ? (
            <>
              {flows.length > 0 ? (
                flows.map((flow, idx) => {
                  const color = colorMap[flow.color];
                  return (
                    <div key={idx} className={`p-4 ${color.light} rounded-lg border ${color.border}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        {/* Ví nguồn */}
                        <div className="flex-1">
                          <span className="text-xs text-red-600 font-semibold uppercase">Ví nguồn (Sender)</span>
                          <p className="font-mono font-bold text-red-900 break-all">{t.senderPocketId}</p>
                        </div>
                        {/* Mũi tên */}
                        <div className="text-gray-400 text-center sm:text-left">
                          <span className="text-2xl">→</span>
                        </div>
                        {/* Ví đích */}
                        <div className="flex-1">
                          <span className={`text-xs ${color.text} font-semibold uppercase`}>{flow.label}</span>
                          <p className={`font-mono font-bold ${color.text} break-all`}>{flow.pocketId}</p>
                        </div>
                        {/* Badge số tiền với màu mới và hiệu ứng */}
                        <div className={`px-4 py-2 rounded-lg font-bold text-white text-center min-w-[100px] shadow-sm transition-all duration-200 ${color.bg}`}>
                          {flow.amount?.toLocaleString()} {t.currencyCode}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500">Không có thông tin ví đích</div>
              )}
            </>
          ) : (
            <div className="text-gray-500">Không có thông tin ví nguồn</div>
          )}

          {/* Thông tin Biller chi tiết (nếu có) */}
          {t.billerCode && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <span className="text-xs text-purple-600 font-semibold uppercase">Thông tin Biller</span>
              <div className="mt-1 space-y-1">
                <p className="font-mono text-sm">Code: <span className="font-bold">{t.billerCode}</span></p>
                <p className="font-mono text-sm">Bill: <span className="font-bold">{t.billCode}</span></p>
                {t.billerRefId && <p className="font-mono text-sm">Ref: <span className="font-bold">{t.billerRefId}</span></p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionDetail;