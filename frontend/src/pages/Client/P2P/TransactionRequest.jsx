// pages/Client/TransactionRequest.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useServiceStore from '../../../stores/useServiceStore';
import useTransactionStore from '../../../stores/useTransactionStore';
import { FaArrowLeft, FaSpinner, FaPhone, FaFileInvoiceDollar, FaCircleCheck } from 'react-icons/fa6';
import useBillerStore from '../../../stores/useBillerStore';

const TransactionRequest = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState(null);
  const { requestTransaction } = useTransactionStore();
  const { billers, loading: billerLoading, listBillers } = useBillerStore();
  const [selectedBiller, setSelectedBiller] = useState(null);

  // Fetch service
  useEffect(() => {
    const fetchService = async () => {
      try {
        const result = await useServiceStore.getState().getServiceDetail(serviceId);
        if (result.success) {
          setService(result.service);
          // Nếu là billpayment, fetch danh sách biller
          if (result.service.type === 'billpayment') {
            await listBillers(1, 100);
          }
        } else {
          alert('Không tìm thấy dịch vụ');
          navigate('/');
        }
      } catch {
        alert('Lỗi tải dịch vụ');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId, navigate, listBillers]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setFieldError(null);
  };

  const handleSelectBiller = (biller) => {
    setSelectedBiller(biller);
    setFormData(prev => ({ ...prev, billerCode: biller.code }));
    setFieldError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFieldError(null);

    // Validate
    if (service.type === 'p2p') {
      if (!formData.receiverPhone || !/^0\d{9}$/.test(formData.receiverPhone)) {
        setFieldError('Số điện thoại không hợp lệ (10 số, bắt đầu 0)');
        setSubmitting(false);
        return;
      }
      if (!formData.amount || Number(formData.amount) < 1000) {
        setFieldError('Số tiền tối thiểu là 1.000 VND');
        setSubmitting(false);
        return;
      }
    } else if (service.type === 'billpayment') {
      if (!selectedBiller) {
        setFieldError('Vui lòng chọn nhà cung cấp');
        setSubmitting(false);
        return;
      }
      if (!formData.billCode) {
        setFieldError('Vui lòng nhập mã hóa đơn');
        setSubmitting(false);
        return;
      }
    }

    const result = await requestTransaction(serviceId, formData);
    if (result.success) {
      navigate('/transaction/confirm');
    } else {
      setFieldError(result.message || 'Lỗi tạo giao dịch');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) return null;

  const renderFields = () => {
    if (service.type === 'p2p') {
      return (
        <>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <FaPhone size={12} className="text-slate-400" />
              Số điện thoại người nhận <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.receiverPhone || ''}
              onChange={(e) => handleChange('receiverPhone', e.target.value.replace(/[^\d]/g, ''))}
              placeholder="VD: 0987654321"
              maxLength={10}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <p className="mt-1 text-xs text-slate-400">Bắt đầu bằng 0, gồm 10 chữ số</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Số tiền (VND) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1000"
                value={formData.amount || ''}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="100.000"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-14 font-mono transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                VND
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Tối thiểu 1.000 VND</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Lời nhắn (tùy chọn)
            </label>
            <input
              type="text"
              value={formData.message || ''}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Nội dung giao dịch"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </>
      );
    } else if (service.type === 'billpayment') {
      return (
        <>
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Chọn nhà cung cấp <span className="text-rose-500">*</span>
            </label>
            {billerLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : billers.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-sm">
                Chưa có nhà cung cấp nào. Vui lòng tạo biller trước.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {billers.map((biller) => (
                  <button
                    key={biller.id}
                    type="button"
                    onClick={() => handleSelectBiller(biller)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedBiller?.id === biller.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{biller.code}</div>
                        <div className="text-sm text-slate-500">{biller.name}</div>
                      </div>
                      {selectedBiller?.id === biller.id && (
                        <FaCircleCheck className="text-emerald-500" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {selectedBiller && (
              <p className="mt-2 text-xs text-emerald-600">
                Đã chọn: <span className="font-semibold">{selectedBiller.code}</span>
              </p>
            )}
          </div>

          {selectedBiller && (
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <FaFileInvoiceDollar size={12} className="text-slate-400" />
                Mã hóa đơn <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.billCode || ''}
                onChange={(e) => handleChange('billCode', e.target.value)}
                placeholder="VD: ELE-2026-001"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <p className="mt-1 text-xs text-slate-400">Mã hóa đơn do nhà cung cấp cấp</p>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <FaArrowLeft size={14} /> Quay lại
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{service.name}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {service.type === 'p2p' && 'Chuyển tiền nhanh đến người nhận'}
          {service.type === 'cashin' && 'Nạp tiền vào ví của bạn'}
          {service.type === 'billpayment' && 'Thanh toán hóa đơn nhanh chóng'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {renderFields()}

        {fieldError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm text-rose-700">{fieldError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <FaSpinner className="animate-spin" size={16} />
              Đang xử lý...
            </>
          ) : (
            'Tiếp tục'
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionRequest;