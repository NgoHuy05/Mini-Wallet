import { FaPlus, FaTrash } from "react-icons/fa6";
import {
  FIELD_NAME_SUGGESTIONS,
  REGEX_SUGGESTIONS,
  ERROR_CODE_MAP,
  ERROR_CODE_OPTIONS,
} from "../../../constants/suggestions";

const TransFieldsTab = ({ fields, canEdit, onRowChange, onAddRow, onDeleteRow }) => {
  const handleErrorCodeChange = (index, newCode) => {
    onRowChange("fields", index, "errorCode", newCode);
    if (ERROR_CODE_MAP[newCode]) {
      onRowChange("fields", index, "description", ERROR_CODE_MAP[newCode]);
    }
  };

  const handleErrorMessageChange = (index, newMessage) => {
    onRowChange("fields", index, "description", newMessage);
    const foundCode = Object.keys(ERROR_CODE_MAP).find(
      (code) => ERROR_CODE_MAP[code] === newMessage
    );
    if (foundCode) {
      onRowChange("fields", index, "errorCode", foundCode);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {canEdit && (
          <button
            onClick={() =>
              onAddRow("fields", {
                fieldName: "",
                inputType: "text",
                rules: { minValue: 0, maxValue: 0, regex: "" },
                needSecured: false,
                isRequired: true,
                errorCode: "",
                description: "",
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
            <th className="p-2 w-12 text-center">#</th>
            <th className="p-2">Field Name</th>
            <th className="p-2 w-28">Input Type</th>
            <th className="p-2 w-20">Min</th>
            <th className="p-2 w-20">Max</th>
            <th className="p-2">Regex</th>
            <th className="p-2 w-14 text-center">Secured</th>
            <th className="p-2 w-14 text-center">Required</th>
            <th className="p-2 w-20">Err Code</th>
            <th className="p-2">Err Message</th>
            {canEdit && <th className="p-2 w-12 text-center">Xóa</th>}
          </tr>
        </thead>
        <tbody className="divide-y font-mono text-[11px]">
          {fields.length === 0 ? (
            <tr>
              <td colSpan={canEdit ? 11 : 10} className="p-4 text-center text-gray-400 italic">
                Chưa có field.
              </td>
            </tr>
          ) : (
            fields.map((f, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-2 text-center text-gray-400">{f.order}</td>
                <td className="p-2 font-bold">
                  <input
                    list={`fieldname-list-${i}`}
                    type="text"
                    disabled={!canEdit}
                    value={f.fieldName || ""}
                    onChange={(e) => onRowChange("fields", i, "fieldName", e.target.value)}
                    className="w-full bg-transparent border p-0.5 rounded disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <datalist id={`fieldname-list-${i}`}>
                    {FIELD_NAME_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </td>
                <td className="p-1">
                  <select
                    disabled={!canEdit}
                    value={f.inputType || "text"}
                    onChange={(e) => onRowChange("fields", i, "inputType", e.target.value)}
                    className="border p-1 rounded w-full bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option>text</option>
                    <option>number</option>
                    <option>phone</option>
                    <option>select</option>
                  </select>
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    disabled={!canEdit}
                    value={f.rules?.minValue ?? ""}
                    onChange={(e) => {
                      const updatedRules = { ...f.rules, minValue: parseInt(e.target.value) || 0 };
                      onRowChange("fields", i, "rules", updatedRules);
                    }}
                    className="border p-1 rounded w-full text-center disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    disabled={!canEdit}
                    value={f.rules?.maxValue ?? ""}
                    onChange={(e) => {
                      const updatedRules = { ...f.rules, maxValue: parseInt(e.target.value) || 0 };
                      onRowChange("fields", i, "rules", updatedRules);
                    }}
                    className="border p-1 rounded w-full text-center disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
                <td className="p-1">
                  <input
                    list={`regex-list-${i}`}
                    type="text"
                    disabled={!canEdit}
                    value={f.rules?.regex || ""}
                    onChange={(e) => {
                      const updatedRules = { ...f.rules, regex: e.target.value };
                      onRowChange("fields", i, "rules", updatedRules);
                    }}
                    className="border p-1 rounded w-full disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <datalist id={`regex-list-${i}`}>
                    {REGEX_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    disabled={!canEdit}
                    checked={f.needSecured || false}
                    onChange={(e) => onRowChange("fields", i, "needSecured", e.target.checked)}
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    disabled={!canEdit}
                    checked={f.isRequired || false}
                    onChange={(e) => onRowChange("fields", i, "isRequired", e.target.checked)}
                  />
                </td>
                <td className="p-1">
                  <input
                    list={`errorcode-list-${i}`}
                    type="text"
                    disabled={!canEdit}
                    value={f.errorCode || ""}
                    onChange={(e) => handleErrorCodeChange(i, e.target.value)}
                    className="border p-1 rounded w-full text-center text-rose-700 font-bold disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <datalist id={`errorcode-list-${i}`}>
                    {ERROR_CODE_OPTIONS.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </td>
                <td className="p-1">
                  <input
                    list={`errormsg-list-${i}`}
                    type="text"
                    disabled={!canEdit}
                    value={f.description || ""}
                    onChange={(e) => handleErrorMessageChange(i, e.target.value)}
                    className="border p-1 rounded w-full text-rose-600 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <datalist id={`errormsg-list-${i}`}>
                    {Object.values(ERROR_CODE_MAP).map((s) => <option key={s} value={s} />)}
                  </datalist>
                </td>
                {canEdit && (
                  <td className="p-2 text-center">
                    <button onClick={() => onDeleteRow("fields", i)} className="text-rose-600">
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

export default TransFieldsTab;