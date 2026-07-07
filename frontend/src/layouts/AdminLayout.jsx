import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaSliders,
  FaUsers,
  FaMagnifyingGlass,
  FaBookOpen,
  FaMoneyBillTransfer,
} from "react-icons/fa6";
import { HiBars3BottomLeft, HiBars3 } from "react-icons/hi2";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuGroups = [
    {
      group: "Tổng quan",
      items: [
        {
          path: "dashboard",
          label: "Dashboard",
          icon: <FaChartPie size={18} />,
        },
      ],
    },
    {
      group: "Dịch vụ",
      items: [
        {
          path: "services",
          label: "Service",
          icon: <FaSliders size={18} />,
        },
      ],
    },
    {
      group: "Biller",
      items: [
        {
          path: "billers",
          label: "Biller",
          icon: <FaSliders size={18} />,
        },
      ],
    },
    {
      group: "Khách hàng",
      items: [
        {
          path: "users",
          label: "Customer",
          icon: <FaUsers size={18} />,
        },
        {
          path: "pockets",
          label: "Pocket",
          icon: <FaUsers size={18} />,
        },
      ],
    },
    {
      group: "Giao dịch",
      items: [
                {
          path: "transactions",
          label: "Transaction History",
          icon: <FaMagnifyingGlass size={18} />,
        },
        {
          path: "transaction-trails",
          label: "Transaction Trail",
          icon: <FaMagnifyingGlass size={18} />,
        },

      ],
    },
    {
      group: "Kế toán",
      items: [
        {
          path: "pocket-entries",
          label: "Ledger Entries",
          icon: <FaBookOpen size={18} />,
        },
      ],
    },
    {
      group: "Nạp tiền",
      items: [
        {
          path: "cash-in",
          label: "Nạp tiền",
          icon: <FaMoneyBillTransfer size={18} />,
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR */}
      <aside
        className={`bg-slate-900 text-slate-300 flex flex-col justify-between shadow-xl transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          {/* LOGO */}
          <div className="h-16 flex items-center justify-between border-b border-slate-800 px-4">
            {!isCollapsed ? (
              <div className="flex items-center space-x-1">
                <span className="text-lg font-bold text-white tracking-wider">
                  MINI-WALLET
                </span>
                <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded font-mono">
                  Admin
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-emerald-400 mx-auto font-mono">
                MW
              </span>
            )}
          </div>

          {/* MENU */}
          <nav className="mt-6 px-3 space-y-4">
            {menuGroups.map((group) => (
              <div key={group.group}>
                {!isCollapsed && (
                  <div className="px-4 mb-2 text-xs text-slate-500 uppercase tracking-wider">
                    {group.group}
                  </div>
                )}

                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                        group relative flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
                        ${isCollapsed ? "justify-center" : "space-x-3"}
                        ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-semibold"
                            : "hover:bg-slate-800 hover:text-slate-100"
                        }
                      `}
                    >
                      <span>{item.icon}</span>

                      {!isCollapsed && <span>{item.label}</span>}

                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* FOOTER SIDEBAR */}
        <div className="p-4 border-t border-slate-800 text-center font-mono">
          {isCollapsed ? (
            <span className="text-xs text-slate-600">v1</span>
          ) : (
            <span className="text-xs text-slate-500">v1.0.0-Tuần2</span>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              {isCollapsed ? (
                <HiBars3 size={22} />
              ) : (
                <HiBars3BottomLeft size={22} />
              )}
            </button>

            <div className="text-sm font-medium text-gray-500 hidden sm:block">
              Hệ thống quản trị
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">
              Officer
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>

        {/* FOOTER */}
        <footer className="h-10 bg-white border-t border-gray-200 flex items-center justify-center text-xs text-gray-400">
          © 2026 Mini-Wallet Engine Dashboard
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;