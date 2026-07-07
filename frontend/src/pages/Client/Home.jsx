// pages/Client/Home.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useServiceStore from '../../stores/useServiceStore';
import { FaExchangeAlt, FaFileInvoiceDollar, FaArrowRight } from 'react-icons/fa';

const serviceIcons = {
  p2p: FaExchangeAlt,
  billpayment: FaFileInvoiceDollar,
};

const serviceColors = {
  p2p: 'bg-blue-600',
  billpayment: 'bg-orange-500',
};

const serviceDescriptions = {
  p2p: 'Chuyển tiền nhanh đến bạn bè, người thân',
  billpayment: 'Thanh toán hóa đơn tiền điện, nước, internet',
};

const Home = () => {
  const navigate = useNavigate();
  const { services, loading, error, listServices } = useServiceStore();

  useEffect(() => {
    listServices();
  }, [listServices]);

  const activeServices = services.filter(s => s?.status === 'active' && s?.type !== 'cashin');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dịch vụ</h1>
        <p className="text-slate-500 mt-1">Chọn dịch vụ bạn muốn sử dụng</p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          Lỗi: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400">
              Hiện chưa có dịch vụ nào.
            </div>
          ) : (
            activeServices.map(service => {
              const Icon = serviceIcons[service.type] || FaExchangeAlt;
              const color = serviceColors[service.type] || 'bg-slate-600';
              const desc = serviceDescriptions[service.type] || 'Dịch vụ tài chính';

              return (
                <button
                  key={service.id}
                  onClick={() => navigate(`/service/${service.id}`)}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex items-start gap-5 text-left hover:border-emerald-300 hover:-translate-y-1"
                >
                  <div className={`${color} shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <Icon size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{desc}</p>
                    <div className="flex items-center gap-1 mt-3 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                      Sử dụng ngay <FaArrowRight size={12} />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Home;