import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaMoneyBillTransfer,
  FaCircleCheck,
  FaCircleXmark,
  FaSpinner,
  FaReceipt,
  FaPhone,
} from "react-icons/fa6";
import useTransactionStore from "../../../stores/useTransactionStore";

const formatAmountInput = (raw) => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("vi-VN");
};

const toNumber = (formatted) => Number(formatted.replace(/\D/g, "")) || 0;

const AdminCashIn = () => {
  const [receiverPhone, setReceiverPhone] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [message, setMessage] = useState("");
  const [localError, setLocalError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const { requestTransaction, resetTransaction, loading } = useTransactionStore();

  const CASHIN_SERVICE_ID = import.meta.env.VITE_CASHIN_SERVICE_ID;

  const handleAmountChange = (e) => {
    setAmountDisplay(formatAmountInput(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setReceipt(null);

    const amount = toNumber(amountDisplay);

    if (!receiverPhone.trim()) {
      setLocalError("Vui lòng nhập số điện thoại người nhận.");
      toast.warning("Vui lòng nhập số điện thoại người nhận.");
      return;
    }
    if (!/^0\d{9}$/.test(receiverPhone.trim())) {
      setLocalError("Số điện thoại không hợp lệ. Định dạng: 0xxxxxxxxx (10 số).");
      toast.warning("Số điện thoại không hợp lệ.");
      return;
    }
    if (!amount || amount < 1000) {
      setLocalError("Số tiền tối thiểu là 1.000 VND.");
      toast.warning("Số tiền tối thiểu là 1.000 VND.");
      return;
    }

    const requestResult = await requestTransaction(CASHIN_SERVICE_ID, {
      receiverPhone: receiverPhone.trim(),
      amount,
      message: message.trim() || "Admin cash-in",
    });

    if (!requestResult.success) {
      setLocalError(requestResult.message);
      toast.error(requestResult.message || "Lỗi tạo giao dịch.");
      return;
    }

    const { auth, completed, transRefId, preview } = requestResult;

    if (auth === "NONE" && completed) {
      setReceipt({
        transRefId,
        preview,
        receiverPhone: receiverPhone.trim(),
        time: new Date(),
      });
      toast.success("Nạp tiền thành công!");
      setReceiverPhone("");
      setAmountDisplay("");
      setMessage("");
      resetTransaction();
      return;
    }

  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
          <FaMoneyBillTransfer size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Nạp tiền mặt</h1>
          <p className="text-sm text-slate-400">Admin cash-in</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <FaPhone size={12} className="text-slate-400" />
                Số điện thoại người nhận <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="VD: 0987654321"
                maxLength={10}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-slate-400">Bắt đầu bằng 0, gồm 10 chữ số</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Số tiền (VND) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountDisplay}
                  onChange={handleAmountChange}
                  placeholder="100.000"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-14 font-mono text-slate-800 tabular-nums transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                  disabled={loading}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                  VND
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Tối thiểu 1.000 VND</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Tin nhắn (tùy chọn)
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nội dung giao dịch"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" size={16} />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaMoneyBillTransfer size={16} />
                  Thực hiện nạp tiền
                </>
              )}
            </button>

            {localError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                <FaCircleXmark className="mt-0.5 shrink-0 text-rose-500" size={16} />
                <div className="flex-1">
                  <p className="text-sm text-rose-700">{localError}</p>
                  <button
                    type="button"
                    onClick={() => setLocalError(null)}
                    className="mt-1 text-xs font-medium text-rose-500 hover:underline"
                  >
                    Ẩn thông báo
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-2">
          {receipt ? (
            <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-dashed border-emerald-200 bg-emerald-50 px-5 py-4">
                <FaCircleCheck className="text-emerald-600" size={18} />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Giao dịch thành công</p>
                  <p className="text-xs text-emerald-600">
                    {receipt.time.toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 px-5 py-4 font-mono text-sm">
                <Row label="Mã giao dịch" value={receipt.transRefId} mono />
                <Row label="Người nhận" value={receipt.receiverPhone} mono />
                {receipt.preview && (
                  <>
                    <div className="border-t border-dashed border-slate-200 pt-3">
                      <Row label="Số tiền" value={fmt(receipt.preview.amount)} />
                      <Row label="Phí" value={fmt(receipt.preview.fee)} />
                    </div>
                    <div className="border-t border-dashed border-slate-200 pt-3">
                      <Row
                        label="Tổng cộng"
                        value={`${fmt(receipt.preview.total)} ${receipt.preview.currency || "VND"}`}
                        strong
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between px-3 pb-1">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-slate-100" />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
              <FaReceipt className="text-slate-300" size={28} />
              <p className="text-sm text-slate-400">
                Biên nhận sẽ hiện ở đây sau khi giao dịch hoàn tất.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, mono, strong }) => (
  <div className="flex items-center justify-between gap-4 py-0.5">
    <span className="font-sans text-xs text-slate-400">{label}</span>
    <span
      className={[
        mono ? "font-mono" : "font-sans",
        strong ? "text-base font-bold text-slate-800" : "text-slate-700",
        "break-all text-right",
      ].join(" ")}
    >
      {value}
    </span>
  </div>
);

const fmt = (n) => (typeof n === "number" ? n.toLocaleString("vi-VN") : n);

export default AdminCashIn;