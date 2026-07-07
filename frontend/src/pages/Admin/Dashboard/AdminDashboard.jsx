/* eslint-disable react-hooks/set-state-in-render */
// pages/Admin/Dashboard/AdminDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWallet,
  FaUsers,
  FaHandshake,
  FaGear,
  FaArrowsRotate,
  FaMoneyBillWave,
  FaLandmark,
} from "react-icons/fa6";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useTransactionStore from "../../../stores/useTransactionStore";
import usePocketStore from "../../../stores/usePocketStore";
import useCustomerStore from "../../../stores/useCustomerStore";
import useBillerStore from "../../../stores/useBillerStore";
import useServiceStore from "../../../stores/useServiceStore";

// StatCard cho 6 box nhỏ
const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4 transition hover:shadow-md">
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      <Icon className={`text-xl ${color}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

// Card lớn hiển thị ngân sách Bank (ví hệ thống)
const BankBalanceCard = ({ balance, currency = "VND" }) => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", { style: "currency", currency });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl border border-blue-200 shadow-sm p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-600/10 rounded-full">
          <FaLandmark className="text-4xl text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-blue-800">Ngân sách Bank (Ví hệ thống)</p>
          <p className="text-3xl font-bold text-blue-900">{formatCurrency(balance)}</p>
        </div>
      </div>
      <div className="text-xs text-blue-600 bg-white/60 px-3 py-1.5 rounded-full border border-blue-200">
        Tổng dự trữ thanh khoản
      </div>
    </div>
  );
};

// Hàm lấy chuỗi ngày từ createdAt an toàn
const getDateStr = (createdAt) => {
  if (!createdAt) return null;
  if (typeof createdAt === "string") return createdAt.split("T")[0];
  if (createdAt instanceof Date) return createdAt.toISOString().split("T")[0];
  try {
    return new Date(createdAt).toISOString().split("T")[0];
  } catch {
    return null;
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    transactions,
    loading: txLoading,
    fetchAdminTransactions,
  } = useTransactionStore();
  const { pockets, loading: pocketLoading, listPockets } = usePocketStore();
  const { customers, loading: custLoading, listCustomers } = useCustomerStore();
  const { billers, loading: billerLoading, listBillers } = useBillerStore();
  const { services, loading: serviceLoading, listServices } = useServiceStore();

  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    totalPockets: 0,
    totalCustomers: 0,
    totalBillers: 0,
    totalServices: 0,
    recentTransactions: [],
    chartData: [],
  });

  const [loading, setLoading] = useState(true);
  const [bankBalance, setBankBalance] = useState(0);
  const [feePocketBalance, setFeePocketBalance] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAdminTransactions(1, 100, ""),
          listPockets("all"),
          listCustomers("", 1, 100),
          listBillers(1, 100),
          listServices(),
        ]);
      } catch (err) {
        console.error("Lỗi fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMemo(() => {
    if (pockets.length > 0) {
      const systemPocket = pockets.find(
        (p) => p.label === "Ví hệ thống" || p.id === "6a4635176f15563499bee7c7"
      );
      if (systemPocket) {
        setBankBalance(systemPocket.balance || 0);
      }

      const feePocket = pockets.find(
        (p) => p.label === "Ví thu phí" || p.id === "6a4352f153d070cff6a5146e"
      );
      if (feePocket) {
        setFeePocketBalance(feePocket.balance || 0);
      }
    }
  }, [pockets]);

  useMemo(() => {
    if (
      transactions.length === 0 &&
      pockets.length === 0 &&
      customers.length === 0 &&
      billers.length === 0 &&
      services.length === 0
    ) {
      return;
    }

    const totalTx = transactions.length;
    const totalPockets = pockets.length;
    const totalCustomers = customers.length;
    const totalBillers = billers.length;
    const totalServices = services.length;

    const recentTx = [...transactions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    const txByDay = days.map((day) => {
      const count = transactions.filter((t) => getDateStr(t.createdAt) === day).length;
      const amount = transactions
        .filter((t) => getDateStr(t.createdAt) === day && t.status === "done")
        .reduce((sum, t) => sum + (t.total || 0), 0);
      return { date: day, count, amount };
    });

    setStats({
      totalTransactions: totalTx,
      totalRevenue: feePocketBalance,
      totalPockets,
      totalCustomers,
      totalBillers,
      totalServices,
      recentTransactions: recentTx,
      chartData: txByDay,
    });
  }, [transactions, pockets, customers, billers, services, feePocketBalance]);

  if (loading || txLoading || pocketLoading || custLoading || billerLoading || serviceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu Dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Tổng Quan</h1>
        <p className="text-sm text-gray-500">
          Giám sát toàn bộ hoạt động của Core Engine Wallet
        </p>
      </div>

      {/* Card Bank */}
      <BankBalanceCard balance={bankBalance} />
      
      {/* 6 box thống kê */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          icon={FaArrowsRotate}
          title="Tổng Giao Dịch"
          value={stats.totalTransactions}
          color="text-blue-600"
          subtitle={`Thành công: ${transactions.filter(t => t.status === "done").length}`}
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Tổng Doanh Thu (phí)"
          value={formatCurrency(stats.totalRevenue)}
          color="text-emerald-600"
          subtitle="Số dư ví thu phí"
        />
        <StatCard
          icon={FaWallet}
          title="Tổng Ví"
          value={stats.totalPockets}
          color="text-purple-600"
        />
        <StatCard
          icon={FaUsers}
          title="Người Dùng"
          value={stats.totalCustomers}
          color="text-amber-600"
        />
        <StatCard
          icon={FaHandshake}
          title="Đối Tác Biller"
          value={stats.totalBillers}
          color="text-rose-600"
        />
        <StatCard
          icon={FaGear}
          title="Dịch Vụ"
          value={stats.totalServices}
          color="text-cyan-600"
        />
      </div>

      {/* Biểu đồ và giao dịch gần đây - cùng hàng 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Số lượng & Tổng tiền giao dịch (7 ngày qua)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "amount") return formatCurrency(value);
                  return value;
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#0088FE" name="Số GD" />
              <Bar yAxisId="right" dataKey="amount" fill="#00C49F" name="Tổng tiền GD" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Giao dịch gần đây với 3 cột */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Giao dịch gần đây
          </h3>
          {stats.recentTransactions.length === 0 ? (
            <p className="text-gray-400 text-center py-6">Chưa có giao dịch</p>
          ) : (
            <div className="space-y-2 max-h-[240px] overflow-y-auto">
              {/* Header 3 cột */}
              <div className="flex items-center text-xs font-semibold text-gray-500 border-b border-gray-200 pb-1.5 px-1">
                <span className="w-5/9">Mã REF GIAO DỊCH</span>
                <span className="w-2/9 text-center">Thời gian</span>
                <span className="w-2/9 text-right">Số tiền</span>
              </div>
              {stats.recentTransactions.map((tx) => (
                <div
                  key={tx.transRefId}
                  className="flex items-center border-b border-gray-100 py-1.5 px-1 text-sm hover:bg-gray-50 transition-all cursor-pointer group"
                >
                  <span
                    className="w-5/9 font-mono text-xs text-gray-500 truncate group-hover:text-blue-600 group-hover:font-bold group-hover:italic transition-all"
                    onClick={() => navigate(`/admin/transaction-trails/${tx.transRefId}`)}
                  >
                    {tx.transRefId}
                  </span>
                  <span className="w-2/9 text-center text-xs text-gray-500">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : 'N/A'}
                  </span>
                  <span className="w-2/9 text-right font-bold text-gray-900">
                    {formatCurrency(tx.total || 0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;