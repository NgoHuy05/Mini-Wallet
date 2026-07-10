import { FaPlus, FaTrash } from "react-icons/fa6";
import {
  VALIDATOR_KEY_SUGGESTIONS,
  ERROR_CODE_MAP,
  ERROR_CODE_OPTIONS,
} from "../../../constants/suggestions";

const TransValidationsTab = ({ validations, canEdit, onRowChange, onAddRow, onDeleteRow }) => {
  const handleErrorCodeChange = (index, newCode) => {
    onRowChange("validations", index, "errorCode", newCode);
    if (ERROR_CODE_MAP[newCode]) {
      onRowChange("validations", index, "errorMessage", ERROR_CODE_MAP[newCode]);
    }
  };

  const handleErrorMessageChange = (index, newMessage) => {
    onRowChange("validations", index, "errorMessage", newMessage);
    const foundCode = Object.keys(ERROR_CODE_MAP).find(
      (code) => ERROR_CODE_MAP[code] === newMessage
    );
    if (foundCode) {
      onRowChange("validations", index, "errorCode", foundCode);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {canEdit && (
          <button
            onClick={() =>
              onAddRow("validations", {
                validatorKey: "",
                validateFields: "",
                errorCode: "",
                errorMessage: "",
              })
            }
            className="bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
          >
            <FaPlus size={10} /> Add Field
          </button>
        )}
      </div>
      <table className="w-full text-left text-xs border border-gray-200">
        <thead>
          <tr className="bg-slate-100 font-bold border-b text-slate-600">
            <th className="p-2 w-12 text-center">Order</th>
            <th className="p-2">Rule Function Module</th>
            <th className="p-2">Input Mapping Parameters</th>
            <th className="p-2 w-24 text-center">Err Code</th>
            <th className="p-2">Err Message</th>
            {canEdit && <th className="p-2 w-16 text-center">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y font-mono text-[11px]">
          {validations.length === 0 ? (
            <tr>
              <td colSpan={canEdit ? 6 : 5} className="p-4 text-center text-gray-400 italic">
                Chưa có validation rule.
              </td>
            </tr>
          ) : (
            validations.map((v, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-2 text-center text-gray-400">{v.order}</td>
                <td className="p-1">
                  <input
                    list={`validator-key-list-${i}`}
                    type="text"
                    disabled={!canEdit}
                    value={v.validatorKey || ""}
                    onChange={(e) => onRowChange("validations", i, "validatorKey", e.target.value)}
                    className="border p-1 rounded w-full font-bold text-blue-950 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <datalist id={`validator-key-list-${i}`}>
                    {VALIDATOR_KEY_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={v.validateFields || ""}
                    onChange={(e) => onRowChange("validations", i, "validateFields", e.target.value)}
                    className="border p-1 rounded w-full text-slate-600 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
                <td className="p-1">
                  <input
                    list={`error-code-list-${i}`}
                    type="text"
                    disabled={!canEdit}
                    value={v.errorCode || ""}
                    onChange={(e) => handleErrorCodeChange(i, e.target.value)}
                    className="border p-1 rounded w-full text-center text-red-700 font-bold disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <datalist id={`error-code-list-${i}`}>
                    {ERROR_CODE_OPTIONS.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </td>
                <td className="p-1">
                  <input
                    list={`error-msg-list-${i}`}
                    type="text"
                    disabled={!canEdit}
                    value={v.errorMessage || ""}
                    onChange={(e) => handleErrorMessageChange(i, e.target.value)}
                    className="border p-1 rounded w-full text-red-600 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <datalist id={`error-msg-list-${i}`}>
                    {Object.values(ERROR_CODE_MAP).map((s) => <option key={s} value={s} />)}
                  </datalist>
                </td>
                {canEdit && (
                  <td className="p-2 text-center">
                    <button onClick={() => onDeleteRow("validations", i)} className="text-rose-600">
                      <FaTrash size={12} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransValidationsTab;