import { FaPlus, FaTrash } from "react-icons/fa6";
import {
  LEVEL_SUGGESTIONS,
  TARGET_SUGGESTIONS,
  AMOUNT_SUGGESTIONS,
} from "../../../constants/suggestions";
import {
  POCKET_ALIAS_TO_ID,
  POCKET_ID_TO_ALIAS,
  POCKET_ALIAS_SUGGESTIONS,
} from "../../../constants/pocketAliases";

// Hàm lấy tên hiển thị (alias) cho target, chỉ áp dụng khi level là 'pocket'
const getDisplayTarget = (target, level) => {
  if (!target || level !== 'pocket') return target;
  return POCKET_ID_TO_ALIAS[target] || target;
};

// Hàm chuyển đổi giá trị nhập vào thành ID thực tế (chỉ áp dụng cho level 'pocket')
const resolveRealId = (inputValue, level) => {
  if (level === 'pocket') {
    return POCKET_ALIAS_TO_ID[inputValue] || inputValue;
  }
  return inputValue;
};

const TransDefinitionTab = ({ definition, canEdit, onRowChange, onAddRow, onDeleteRow }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      {canEdit && (
        <button
          onClick={() =>
            onAddRow("definition", {
              order: (definition?.length || 0),
              amount: "",
              debit: { level: "", target: "" },
              credit: { level: "", target: "" },
            })
          }
          className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
        >
          <FaPlus size={11} /> Add Step Ledger
        </button>
      )}
    </div>
    {!definition || definition.length === 0 ? (
      <div className="border border-dashed p-8 text-center text-gray-400 italic rounded-xl">
        Chưa cấu hình bút toán.
      </div>
    ) : (
      definition.map((step, idx) => (
        <div key={idx} className="border border-gray-200 bg-slate-50/50 rounded-xl p-4 space-y-4 relative">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="text-xs font-bold text-slate-800 font-mono">
              Step {idx + 1}
            </div>
            {canEdit && (
              <button onClick={() => onDeleteRow("definition", idx)} className="text-rose-500">
                <FaTrash size={12} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Debit Side */}
            <SideEditor
              side="debit"
              step={step}
              idx={idx}
              canEdit={canEdit}
              onRowChange={onRowChange}
              definition={definition}
            />
            {/* Credit Side */}
            <SideEditor
              side="credit"
              step={step}
              idx={idx}
              canEdit={canEdit}
              onRowChange={onRowChange}
              definition={definition}
            />
          </div>
          {/* Amount Field */}
          <div className="grid grid-cols-3 gap-1 text-xs">
            <span className="text-gray-400">Amount Field:</span>
            <input
              list={`amount-field-${idx}`}
              type="text"
              disabled={!canEdit}
              value={step.amount || ''}
              onChange={(e) => onRowChange("definition", idx, "amount", e.target.value)}
              className="col-span-2 border rounded p-0.5 bg-white disabled:bg-gray-100 disabled:text-gray-500"
            />
            <datalist id={`amount-field-${idx}`}>
              {AMOUNT_SUGGESTIONS.map(s => <option key={s} value={s} />)}
            </datalist>
          </div>
        </div>
      ))
    )}
  </div>
);

// Component con cho Debit/Credit Side
const SideEditor = ({ side, step, idx, canEdit, onRowChange, definition }) => {
  const currentLevel = step[side]?.level || 'productLevel';
  const currentTarget = step[side]?.target || '';

  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    const updated = [...definition];
    updated[idx] = {
      ...updated[idx],
      [side]: { level: newLevel, target: '' },
    };
    onRowChange("definition", idx, side, updated[idx][side]);
  };

  const handleTargetChange = (e) => {
    const newValue = e.target.value;
    const realId = resolveRealId(newValue, currentLevel);
    const updated = [...definition];
    updated[idx] = {
      ...updated[idx],
      [side]: { ...updated[idx][side], target: realId },
    };
    onRowChange("definition", idx, side, updated[idx][side]);
  };

  // Xác định danh sách gợi ý dựa trên level
  const getTargetSuggestions = () => {
    if (currentLevel === 'pocket') {
      return POCKET_ALIAS_SUGGESTIONS;   // chỉ hiện alias của ví hệ thống
    }
    // productLevel -> các biến TRANSBODY
    return TARGET_SUGGESTIONS.filter(s => s.startsWith('SENDER') || s.startsWith('RECEIVER') || s.startsWith('BILLER'));
  };

  const targetSuggestions = getTargetSuggestions();
  const targetListId = `${side}-target-${idx}`;

  return (
    <div className={`${side === 'debit' ? 'bg-amber-50/40 border-amber-200' : 'bg-emerald-50/40 border-emerald-200'} border p-3 rounded-lg space-y-2`}>
      <div className={`font-bold uppercase text-[10px] ${side === 'debit' ? 'text-amber-800' : 'text-emerald-800'}`}>
        {side === 'debit' ? '● Debit Side' : '○ Credit Side'}
      </div>
      <div className="grid grid-cols-3 gap-1">
        <span className="text-gray-400">Level:</span>
        <select
          disabled={!canEdit}
          value={currentLevel}
          onChange={handleLevelChange}
          className="col-span-2 border rounded p-0.5 bg-white disabled:bg-gray-100 disabled:text-gray-500"
        >
          {LEVEL_SUGGESTIONS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-1">
        <span className="text-gray-400">Target:</span>
        <input
          list={targetListId}
          type="text"
          disabled={!canEdit}
          value={getDisplayTarget(currentTarget, currentLevel)}
          onChange={handleTargetChange}
          className="col-span-2 border rounded p-0.5 font-mono bg-white disabled:bg-gray-100 disabled:text-gray-500"
        />
        <datalist id={targetListId}>
          {targetSuggestions.map(s => <option key={s} value={s} />)}
        </datalist>
      </div>
    </div>
  );
};

export default TransDefinitionTab;