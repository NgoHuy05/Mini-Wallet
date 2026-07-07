import { FaPlus, FaTrash } from "react-icons/fa6";
import {
  VARIABLE_SUGGESTIONS,
  QUERY_SUGGESTIONS,
  SOURCE_SUGGESTIONS,
} from "../../../constants/suggestions";

const InputBuildingTab = ({ inputBuilding, canEdit, onRowChange, onAddRow, onDeleteRow }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      {canEdit && (
        <button
          onClick={() => onAddRow("inputBuilding", { name: "", rule: "", source: "", variable: "", query: "" })}
          className="bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
        >
          <FaPlus size={10}/> Add Field
        </button>
      )}
    </div>
    <table className="w-full text-left text-xs border border-gray-200">
      <thead>
        <tr className="bg-slate-100 font-bold border-b text-slate-600">
          <th className="p-2 w-12 text-center">#</th>
          <th className="p-2">Field Name</th>
          <th className="p-2 w-24">Rule</th>
          <th className="p-2">Source</th>
          <th className="p-2">Variable</th>
          <th className="p-2">Query</th>
          {canEdit && <th className="p-2 w-12 text-center">Xóa</th>}
        </tr>
      </thead>
      <tbody className="divide-y font-mono text-[11px]">
        {inputBuilding.length === 0 ? (
          <tr><td colSpan={canEdit ? 7 : 6} className="p-4 text-center text-gray-400 italic">Chưa có rule Input Building.</td></tr>
        ) : (
          inputBuilding.map((rule, i) => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="p-2 text-center text-gray-400">{rule.order}</td>
              <td className="p-2">
                <input type="text" disabled={!canEdit} value={rule.name} onChange={(e) => onRowChange("inputBuilding", i, "name", e.target.value)} className="w-full bg-transparent border p-0.5 rounded disabled:bg-gray-100 disabled:text-gray-500" />
              </td>
              <td className="p-1">
                <select disabled={!canEdit} value={rule.rule} onChange={(e) => onRowChange("inputBuilding", i, "rule", e.target.value)} className="border p-1 rounded w-full bg-white disabled:bg-gray-100 disabled:text-gray-500">
                  <option value="mapping">mapping</option>
                  <option value="query">query</option>
                  <option value="fixed">fixed</option>
                </select>
              </td>
              <td className="p-1">
                <input list={`source-list-${i}`} type="text" disabled={!canEdit} value={rule.source} onChange={(e) => onRowChange("inputBuilding", i, "source", e.target.value)} className="border p-1 rounded w-full disabled:bg-gray-100 disabled:text-gray-500" />
                <datalist id={`source-list-${i}`}>
                  {SOURCE_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                </datalist>
              </td>
              <td className="p-1">
                <input list={`variable-list-${i}`} type="text" disabled={!canEdit} value={rule.variable} onChange={(e) => onRowChange("inputBuilding", i, "variable", e.target.value)} className="border p-1 rounded w-full disabled:bg-gray-100 disabled:text-gray-500" />
                <datalist id={`variable-list-${i}`}>
                  {VARIABLE_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                </datalist>
              </td>
              <td className="p-1">
                <input list={`query-list-${i}`} type="text" disabled={!canEdit} value={rule.query} onChange={(e) => onRowChange("inputBuilding", i, "query", e.target.value)} className="border p-1 rounded w-full disabled:bg-gray-100 disabled:text-gray-500" />
                <datalist id={`query-list-${i}`}>
                  {QUERY_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                </datalist>
              </td>
              {canEdit && (
                <td className="p-2 text-center">
                  <button onClick={() => onDeleteRow("inputBuilding", i)} className="text-rose-600"><FaTrash size={12}/></button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default InputBuildingTab;