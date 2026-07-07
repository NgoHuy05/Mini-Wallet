// pages/Admin/Transaction/AdminTransactionTrailDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTrailStore from '../../../stores/useTrailStore';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaFlag,
  FaTerminal,
  FaInfoCircle,
  FaClock,
} from 'react-icons/fa';

// Component InfoRow được đưa ra ngoài để tránh tạo lại mỗi render
const InfoRow = ({ label, value, mono = false }) => (
  <div className="grid grid-cols-3 gap-1 border-b border-gray-100 py-1">
    <span className="text-gray-400 font-medium">{label}</span>
    <span className={`col-span-2 break-words ${mono ? 'font-mono text-xs' : ''}`}>
      {value !== undefined && value !== null ? String(value) : '—'}
    </span>
  </div>
);

const AdminTransactionTrailDetail = () => {
  const { transRefId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('START');

  const { trail, loading, error, getTrailByTransRef } = useTrailStore();

  useEffect(() => {
    if (transRefId) {
      getTrailByTransRef(transRefId);
    }
  }, [transRefId, getTrailByTransRef]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (trail) setActiveStep('START');
  }, [trail]);

  // Hàm render detail, thay | thành xuống dòng
  const renderDetail = (detail) => {
    if (!detail) return null;
    const parts = detail.split('|').map(s => s.trim()).filter(s => s);
    if (parts.length === 0) return null;
    return parts.map((part, idx) => (
      <div key={idx} className="py-0.5">{part}</div>
    ));
  };

  // Hàm format thời gian đầy đủ
  const formatFullDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 font-sans bg-gray-100 p-4 min-h-screen">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div><h1 className="text-xl font-bold text-blue-900">Loading...</h1></div>
          <button
            onClick={() => navigate('/admin/transaction-trails')}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-1.5 rounded shadow-sm"
          >
            <FaArrowLeft size={12} /> Back
          </button>
        </div>
        <div className="text-center py-10 text-gray-500">Đang tải chi tiết...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 font-sans bg-gray-100 p-4 min-h-screen">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div><h1 className="text-xl font-bold text-red-600">Lỗi</h1></div>
          <button
            onClick={() => navigate('/admin/transaction-trails')}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-1.5 rounded shadow-sm"
          >
            <FaArrowLeft size={12} /> Back
          </button>
        </div>
        <div className="text-center py-10 text-red-500">{error}</div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="space-y-4 font-sans bg-gray-100 p-4 min-h-screen">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div><h1 className="text-xl font-bold text-blue-900">Không tìm thấy</h1></div>
          <button
            onClick={() => navigate('/admin/transaction-trails')}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-1.5 rounded shadow-sm"
          >
            <FaArrowLeft size={12} /> Back
          </button>
        </div>
        <div className="text-center py-10 text-gray-500">
          Không tìm thấy trail với transRefId: {transRefId}
        </div>
      </div>
    );
  }

  const t = trail;

  const availableSteps = t.transStepLog
    ? [...new Set(t.transStepLog.map(log => log.step))]
    : [];
  const hasStep = (step) => availableSteps.includes(step);

  const getLogsForStep = (step) =>
    t.transStepLog?.filter(log => 
      log.step === step && 
      log.detail && 
      log.detail.trim() !== '' && 
      log.detail !== 'No detail'
    ) || [];

  const isStepActive = (step) => hasStep(step);

  const getAuthMethod = () => {
    const confirmLogs = getLogsForStep('CONFIRM');
    for (let log of confirmLogs) {
      if (log.detail && log.detail.toLowerCase().includes('pin')) {
        return 'PIN';
      }
    }
    return 'NONE';
  };

  // Lấy message từ inputMessage (ưu tiên message thường, sau đó MESSAGE)
  const message = t.inputMessage?.message || t.inputMessage?.MESSAGE || '—';

  return (
    <div className="space-y-4 font-sans bg-gray-100 p-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-blue-900">Trail: {t.id || t._id}</h1>
          <p className="text-xs text-gray-500 font-mono">Ref: {t.transRefId}</p>
        </div>
        <button
          onClick={() => navigate('/admin/transaction-trails')}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-1.5 rounded shadow-sm"
        >
          <FaArrowLeft size={12} /> Back
        </button>
      </div>

      {/* 3 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {/* CỘT 1: INFORMATION */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-2 text-xs overflow-y-auto max-h-[calc(100vh-220px)]">
          <h3 className="font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
            <FaInfoCircle className="text-blue-500" /> Information
          </h3>

          <InfoRow label="Trail ID" value={t.id || t._id} mono />
          <InfoRow label="Trans Ref ID" value={t.transRefId} mono />
          <InfoRow label="Service ID" value={t.serviceId} mono />
          <InfoRow label="Triggered By" value={t.triggeredById} mono />
          <InfoRow label="Status" value={t.status} mono />
          <InfoRow label="Created At" value={formatFullDate(t.createdAt)} />
          <InfoRow label="Updated At" value={formatFullDate(t.updatedAt)} />
          <InfoRow label="Expired At" value={t.expiredAt ? formatFullDate(t.expiredAt) : '—'} />
          <InfoRow label="Failure Reason" value={t.failureReason || '—'} />
          <InfoRow label="Preview Total" value={t.preview?.total ? `${t.preview.total} ${t.preview.currency}` : '—'} />
          
          {/* Thêm dòng Message */}
          <InfoRow label="Message" value={message} />

          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className="text-gray-400">Total Logs:</span>
            <span className="ml-2 font-mono font-bold">{t.transStepLog?.length || 0}</span>
          </div>
        </div>

        {/* CỘT 2: STAGES */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center min-h-[500px] relative">
          <div className="absolute w-0.5 bg-blue-900 top-16 bottom-16 left-1/2 -translate-x-1/2 z-0" />

          <button
            onClick={() => setActiveStep('START')}
            disabled={!isStepActive('START')}
            className={`z-10 flex flex-col items-center px-4 py-1.5 rounded text-white text-xs font-bold font-mono uppercase shadow-md transition-all ${
              activeStep === 'START'
                ? 'bg-red-600 scale-105 ring-4 ring-red-200'
                : !isStepActive('START')
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-900 hover:bg-blue-800'
            }`}
          >
            <FaFlag className="mb-0.5" size={10} /> START
          </button>

          <div className="w-full my-6 space-y-8 z-10">
            {['REQUEST', 'CONFIRM', 'VERIFY'].map((stage, idx) => {
              const active = isStepActive(stage);
              const isSelected = activeStep === stage;
              const firstLog = getLogsForStep(stage)[0];
              const timeStr = firstLog?.at ? formatFullDate(firstLog.at) : '';

              return (
                <div
                  key={stage}
                  className="flex items-center justify-between w-full max-w-[280px] mx-auto relative"
                >
                  {/* Thời gian hiển thị bên trái */}
                  <span className="text-[10px] font-mono text-gray-400 absolute -left-32 w-28 text-right">
                    {timeStr}
                  </span>

                  <button
                    onClick={() => active && setActiveStep(stage)}
                    disabled={!active}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-mono text-sm font-bold shadow-md transition-all mx-auto ${
                      isSelected
                        ? 'bg-red-600 border-red-700 text-white scale-110 ring-4 ring-red-200'
                        : !active
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-900 border-blue-950 text-white hover:bg-blue-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                  <span
                    className={`text-xs font-mono font-bold uppercase absolute -right-20 tracking-wider ${
                      isSelected ? 'text-blue-900 font-extrabold' : 'text-gray-500'
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className={`z-10 px-6 py-2 rounded text-white text-xs font-mono font-bold uppercase shadow-md ${
              t.status === 'done'
                ? 'bg-emerald-600'
                : t.status === 'failed'
                ? 'bg-rose-600'
                : 'bg-gray-400'
            }`}
          >
            {t.status.toUpperCase()}
          </div>
        </div>

        {/* CỘT 3: STAGE DETAILS */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>Stage Details: {activeStep}</span>
            <span className="text-xs font-mono text-gray-400">
              {getLogsForStep(activeStep).length} log(s)
            </span>
          </div>

          <div className="p-4 flex-1 text-xs text-gray-700 overflow-y-auto max-h-[calc(100vh-220px)] space-y-4">
            {/* START */}
            {activeStep === 'START' && (
              <div className="space-y-3">
                <div className="font-bold text-gray-600 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <FaClock className="text-blue-500" /> Initialization
                </div>
                {getLogsForStep('START').map((log, idx) => (
                  <div key={idx} className="bg-blue-50/50 rounded-r p-2 border-l-2 border-blue-500">
                    <div className="font-semibold text-gray-800">{renderDetail(log.detail)}</div>
                    <div className="text-gray-500 text-[10px] font-mono">{formatFullDate(log.at)}</div>
                    {log.result && <div className="text-green-600 text-[10px]">✓ {log.result}</div>}
                  </div>
                ))}
                {t.inputMessage && Object.keys(t.inputMessage).length > 0 && (
                  <div className="mt-2 p-2 bg-slate-50 rounded border">
                    <div className="font-bold text-gray-500 text-[10px] uppercase mb-1">Input Payload</div>
                    <div className="font-mono text-[10px] space-y-0.5">
                      {Object.entries(t.inputMessage).map(([k, v]) => (
                        <div key={k}><span className="text-slate-400">{k}:</span> {String(v)}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REQUEST */}
            {activeStep === 'REQUEST' && (
              <div className="space-y-3">
                <div className="font-bold text-gray-600 uppercase text-[11px] flex items-center gap-1">
                  <FaCheckCircle className="text-blue-500" /> Validation & Fee Calculation
                </div>
                {getLogsForStep('REQUEST').map((log, idx) => (
                  <div key={idx} className="bg-amber-50/50 rounded-r p-2 border-l-2 border-amber-500">
                    <div className="font-semibold text-gray-800">{renderDetail(log.detail)}</div>
                    <div className="text-gray-500 text-[10px] font-mono">{formatFullDate(log.at)}</div>
                    {log.result && <div className="text-green-600 text-[10px]">✓ {log.result}</div>}
                  </div>
                ))}
                {t.feeSnapshot && Object.keys(t.feeSnapshot).length > 0 && (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                    <div className="font-bold text-blue-700 text-[10px] uppercase">Fee Snapshot</div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] mt-1">
                      {Object.entries(t.feeSnapshot).map(([k, v]) => (
                        <div key={k}><span className="text-gray-500">{k}:</span> {String(v)}</div>
                      ))}
                    </div>
                  </div>
                )}
                {t.preview && Object.keys(t.preview).length > 0 && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                    <div className="font-bold text-emerald-700 text-[10px] uppercase">Preview</div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] mt-1">
                      <div><span className="text-gray-500">Amount:</span> {t.preview.amount} {t.preview.currency}</div>
                      <div><span className="text-gray-500">Fee:</span> {t.preview.fee} {t.preview.currency}</div>
                      <div><span className="text-gray-500">Total:</span> {t.preview.total} {t.preview.currency}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CONFIRM */}
            {activeStep === 'CONFIRM' && (
              <div className="space-y-3">
                <div className="font-bold text-gray-600 uppercase text-[11px] flex items-center gap-1">
                  <FaCheckCircle className="text-blue-500" /> Confirmation
                </div>
                {getLogsForStep('CONFIRM').map((log, idx) => (
                  <div key={idx} className="bg-purple-50/50 rounded-r p-2 border-l-2 border-purple-500">
                    <div className="font-semibold text-gray-800">{renderDetail(log.detail)}</div>
                    <div className="text-gray-500 text-[10px] font-mono">{formatFullDate(log.at)}</div>
                    {log.result && <div className="text-green-600 text-[10px]">✓ {log.result}</div>}
                  </div>
                ))}
                <div className="p-3 bg-slate-50 border rounded-xl text-center font-mono text-sm">
                  Auth Method: <span className="font-bold text-blue-900">{getAuthMethod()}</span>
                </div>
              </div>
            )}

            {/* VERIFY */}
            {activeStep === 'VERIFY' && (
              <div className="space-y-3">
                <div className="font-bold text-gray-600 font-mono uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <FaTerminal className="text-blue-500" /> GL Execution
                </div>
                {t.status === 'done' || t.status === 'processing' ? (
                  <>
                    {getLogsForStep('VERIFY').map((log, idx) => (
                      <div key={idx} className="bg-green-50/50 rounded-r p-2 border-l-2 border-green-500">
                        <div className="font-semibold text-gray-800">{renderDetail(log.detail)}</div>
                        <div className="text-gray-500 text-[10px] font-mono">{formatFullDate(log.at)}</div>
                        {log.result && <div className="text-green-600 text-[10px]">✓ {log.result}</div>}
                      </div>
                    ))}
                    {t.outputMessage && Object.keys(t.outputMessage).length > 0 && (
                      <div className="p-2 bg-slate-50 border rounded font-mono text-[10px]">
                        <div className="font-bold text-gray-500 uppercase text-[9px]">Output Message</div>
                        {Object.entries(t.outputMessage).map(([k, v]) => (
                          <div key={k}><span className="text-gray-400">{k}:</span> {String(v)}</div>
                        ))}
                      </div>
                    )}
                  </>
                ) : t.status === 'failed' ? (
                  <div className="text-rose-600 italic bg-rose-50 p-3 rounded border border-rose-100">
                    GL execution failed: {t.failureReason || 'Unknown error'}
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Waiting for verify step...</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionTrailDetail;