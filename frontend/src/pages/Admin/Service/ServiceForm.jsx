import { useRef } from "react";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCheck,
  FaPenToSquare,
  FaLock,
  FaUpload,
  FaDownload,
} from "react-icons/fa6";
import ServiceInfoForm from "./ServiceInfoForm";
import TransFieldsTab from "./TransFieldsTab";
import TransValidationsTab from "./TransValidationsTab";
import TransDefinitionTab from "./TransDefinitionTab";
import InputBuildingTab from "./InputBuildingTab";

const tabs = [
  { key: "fields", label: "Trans Fields" },
  { key: "validations", label: "Trans Validations" },
  { key: "inputBuilding", label: "Input Building" },
  { key: "definition", label: "Trans Definition" },
];

const ServiceForm = ({
  isCreating,
  isEditing,
  formData,
  tempSchema,
  activeTab,
  onFormChange,
  onSchemaChange,
  onImportJson,
  onSave,
  onCancel,
  onToggleEdit,
  onTabChange,
}) => {
  const canEdit = isCreating || isEditing;
  const fileInputRef = useRef(null);

  const handleRowChange = (tabKey, index, fieldKey, value) => {
    const updated = [...tempSchema[tabKey]];
    updated[index][fieldKey] = value;
    onSchemaChange({ ...tempSchema, [tabKey]: updated });
  };

  const addRow = (tabKey, defaultObj) => {
    const updated = [...tempSchema[tabKey]];
    const nextOrder =
      updated.length > 0
        ? Math.max(...updated.map((o) => o.order || 0)) + 1
        : 1;
    updated.push({ ...defaultObj, order: nextOrder });
    onSchemaChange({ ...tempSchema, [tabKey]: updated });
  };

  const deleteRow = (tabKey, index) => {
    const updated = tempSchema[tabKey].filter((_, i) => i !== index);
    const reIndexed = updated.map((item, i) => ({ ...item, order: i + 1 }));
    onSchemaChange({ ...tempSchema, [tabKey]: reIndexed });
  };

  const handleImportButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".json")) {
        toast.error("Vui lòng chọn file .json");
      } else {
        onImportJson?.(file);
      }
    }
    // reset so selecting the same file again still fires onChange
    e.target.value = "";
  };

  const handleExportJson = () => {
    let actionParams = {};
    try {
      actionParams = JSON.parse(formData.actionParams);
    } catch {
      actionParams = {};
    }

    const exportData = {
      code: formData.code,
      name: formData.name,
      type: formData.type,
      auth: formData.auth,
      action: formData.action,
      actionParams,
      fee: {
        type: formData.feeType,
        value: Number(formData.feeValue) || 0,
        ...(formData.feeType === "percent" && { max: Number(formData.feeMax) || 0 }),
      },
      fieldBuilder: tempSchema?.inputBuilding || [],
      fields: tempSchema?.fields || [],
      validations: tempSchema?.validations || [],
      glSteps: tempSchema?.definition || [],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.code || "service"}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {isCreating
              ? "Tạo mới Service"
              : `Chi tiết: ${formData.name || formData.code}`}
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            {isCreating ? (
              "Nhập thông tin và cấu hình các thành phần engine."
            ) : (
              <>
                <span className="block text-sm font-bold text-slate-800">
                  Service ID: {formData.id}
                </span>
                <span className="block text-xs text-slate-500">
                  Service Type: {formData.code}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                onClick={handleImportButtonClick}
                title="Import cấu hình từ file JSON thay vì nhập tay"
                className="bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded shadow flex items-center gap-1"
              >
                <FaUpload size={12} /> Import JSON
              </button>
            </>
          )}
          <button
            onClick={handleExportJson}
            title="Xuất cấu hình hiện tại ra file JSON"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded shadow flex items-center gap-1 border border-slate-200"
          >
            <FaDownload size={12} /> Export JSON
          </button>
          {canEdit && (
            <button
              onClick={onSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded shadow flex items-center gap-1"
            >
              <FaCheck size={12} /> Lưu Service
            </button>
          )}
          {!isCreating && (
            <button
              onClick={onToggleEdit}
              className={`text-xs font-bold px-4 py-2 rounded shadow flex items-center gap-1 ${
                isEditing
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isEditing ? (
                <>
                  <FaLock size={12} /> Khóa
                </>
              ) : (
                <>
                  <FaPenToSquare size={12} /> Mở khóa chỉnh sửa
                </>
              )}
            </button>
          )}
          <button
            onClick={onCancel}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded shadow flex items-center gap-1"
          >
            <FaArrowLeft size={12} /> Quay lại
          </button>
        </div>
      </div>

      <ServiceInfoForm
        formData={formData}
        onChange={onFormChange}
        disabled={!canEdit}
      />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-4 py-2 text-xs font-bold uppercase ${
                activeTab === tab.key
                  ? "bg-blue-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 min-h-[300px]">
          {activeTab === "fields" && (
            <TransFieldsTab
              fields={tempSchema.fields}
              canEdit={canEdit}
              onRowChange={handleRowChange}
              onAddRow={addRow}
              onDeleteRow={deleteRow}
            />
          )}

          {activeTab === "validations" && (
            <TransValidationsTab
              validations={tempSchema.validations}
              canEdit={canEdit}
              onRowChange={handleRowChange}
              onAddRow={addRow}
              onDeleteRow={deleteRow}
            />
          )}

          {activeTab === "inputBuilding" && (
            <InputBuildingTab
              inputBuilding={tempSchema.inputBuilding}
              canEdit={canEdit}
              onRowChange={handleRowChange}
              onAddRow={addRow}
              onDeleteRow={deleteRow}
            />
          )}

          {activeTab === "definition" && (
            <TransDefinitionTab
              definition={tempSchema.definition}
              canEdit={canEdit}
              onRowChange={handleRowChange}
              onAddRow={addRow}
              onDeleteRow={deleteRow}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;