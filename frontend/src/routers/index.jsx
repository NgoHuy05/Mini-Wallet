import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminBillers from "../pages/Admin/Biller/AdminBillers";
import AdminBillerDetails from "../pages/Admin/Biller/AdminBillerDetails";
import AdminListUsers from "../pages/Admin/Customer/AdminListUsers";
import AdminPocketDetails from "../pages/Admin/Pocket/AdminPocketDetails";
import AdminPockets from "../pages/Admin/Pocket/AdminPockets";
import AdminTransactionTrails from "../pages/Admin/Transaction/AdminTransactionTrails";
import AdminTransactions from "../pages/Admin/Transaction/AdminTransactions";
import AdminPocketEntries from "../pages/Admin/Pocket/AdminPocketEntries";

import LoginAdmin from "../pages/Admin/Auth/LoginAdmin";
import Login from "../pages/Client/Auth/Login";
import Register from "../pages/Client/Auth/Register";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminServicesList from "../pages/Admin/Service/ServicesList";
import AdminServiceDetail from "../pages/Admin/Service/ServiceDetail";

import AdminTransactionDetail from "../pages/Admin/Transaction/AdminTransactionDetail";
import AdminTransactionTrailDetail from "../pages/Admin/Transaction/AdminTransactionTrailDetail";
import AdminCustomerDetails from "../pages/Admin/Customer/AdminUserDetails";
import AdminPocketEntryDetails from "../pages/Admin/Pocket/AdminPocketEntryDetailDetail";
import AdminCashIn from "../pages/Admin/CashIn/AdminCashIn";

import Home from "../pages/Client/Home";
import Pocket from "../pages/Client/Pocket";
import TransactionRequest from "../pages/Client/P2P/TransactionRequest";
import TransactionConfirm from "../pages/Client/P2P/TransactionConfirm";
import TransactionVerify from "../pages/Client/P2P/TransactionVerify";
import TransactionResult from "../pages/Client/P2P/TransactionResult";
import TransactionHistory from "../pages/Client/History/TransactionHistory";
import TransactionDetail from "../pages/Client/History/TransactionDetail";
import NotificationPage from "../pages/Client/Notification";


export const routers = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRole="customer">
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "service/:serviceId", element: <TransactionRequest /> },
      { path: "transaction/confirm", element: <TransactionConfirm /> },
      { path: "transaction/verify", element: <TransactionVerify /> },
      { path: "transaction/result", element: <TransactionResult /> },

      { path: "notifications", element: <NotificationPage /> },
      { path: "pocket", element: <Pocket /> },
      { path: "history", element: <TransactionHistory /> },
      { path: "history/:transactionId", element: <TransactionDetail /> },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "admin/login", element: <LoginAdmin /> },
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedRole="officer">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "cash-in", element: <AdminCashIn /> },

      { path: "services", element: <AdminServicesList /> },
      { path: "services/detail/:serviceId", element: <AdminServiceDetail /> },
      // BILLER
      { path: "billers", element: <AdminBillers /> },
      { path: "billers/:billerId", element: <AdminBillerDetails /> },
      // CUSTOMER
      { path: "users", element: <AdminListUsers /> },
      { path: "users/:userId", element: <AdminCustomerDetails /> },

      { path: "pockets/:pocketId", element: <AdminPocketDetails /> },
      { path: "pockets", element: <AdminPockets /> },

      // TRANSACTION
      { path: "transaction-trails", element: <AdminTransactionTrails /> },
      { path: "transaction-trails/:transRefId", element: <AdminTransactionTrailDetail /> },
      { path: "transactions", element: <AdminTransactions /> },
      { path: "transactions/:transactionId", element: <AdminTransactionDetail /> },

      // LEDGER
      { path: "pocket-entries", element: <AdminPocketEntries /> },
      { path: "pocket-entries/:entryId", element: <AdminPocketEntryDetails /> },
    ],
  },
]);
