import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useServiceStore from "../../../stores/useServiceStore";
import ServiceForm from "./ServiceForm";

const defaultSchema = {
  fields: [],
  validations: [],
  definition: [],
  inputBuilding: [],
};

const defaultFormData = {
  code: "",
  name: "",
  type: "billpayment",
  auth: "NONE",
  action: "none",
  actionParams: "{}",
  feeType: "fixed",
  feeValue: 0,
  feeMax: 0,
};

const AdminServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const { createFullServiceConfig, updateFullServiceConfig } = useServiceStore();

  const isCreating = serviceId === "new";
  const [isEditing, setIsEditing] = useState(isCreating);
  const [activeTab, setActiveTab] = useState("fields");
  const [formData, setFormData] = useState(isCreating ? defaultFormData : null);
  const [tempSchema, setTempSchema] = useState(isCreating ? defaultSchema : null);
  const [loadingDetail, setLoadingDetail] = useState(!isCreating && !!serviceId);
  const loadedIdRef = useRef(null);

  // Maps a { service, fields, validations, definition, fieldBuilder } shaped
  // result (from the API, or from an imported JSON file) onto local state.
  const applyLoadedConfig = useCallback((result, { preserveId } = {}) => {
    const service = result.service || {};
    setFormData((prev) => ({
      ...(preserveId && prev?.id
        ? { id: prev.id }
        : service.id
        ? { id: service.id }
        : {}),
      code: service.code || "",
      name: service.name || "",
      type: service.type || "billpayment",
      auth: service.auth || "NONE",
      action: service.action || "none",
      actionParams: JSON.stringify(service.actionParams || {}),
      feeType: service.fee?.type || "fixed",
      feeValue: service.fee?.value || 0,
      feeMax: service.fee?.max || 0,
    }));
    setTempSchema({
      fields: result.fields || [],
      validations: result.validations || [],
      definition: result.definition?.glSteps || [],
      inputBuilding: result.fieldBuilder || service.fieldBuilder || [],
    });
  }, []);

  const loadServiceDetail = useCallback(
    async (id) => {
      setLoadingDetail(true);
      try {
        const result = await useServiceStore.getState().getFullServiceConfig(id);
        if (result.success) {
          applyLoadedConfig(result);
          setIsEditing(false);
          setActiveTab("fields");
          loadedIdRef.current = id;
        } else {
          toast.error("Không lấy được cấu hình: " + (result.message || "Lỗi không xác định"));
          navigate("/admin/services");
        }
      } catch (err) {
        toast.error("Lỗi kết nối khi tải dữ liệu: " + err.message);
        navigate("/admin/services");
      } finally {
        setLoadingDetail(false);
      }
    },
    [navigate, applyLoadedConfig]
  );

  useEffect(() => {
    if (serviceId && serviceId !== "new" && loadedIdRef.current !== serviceId) {
      loadServiceDetail(serviceId);
    }
  }, [serviceId, loadServiceDetail]);

  const handleSaveService = async () => {
    if (!formData || !formData.code || !formData.name) {
      toast.warning("Vui lòng nhập Code và Tên Service!");
      return;
    }

    let actionParams = {};
    try {
      actionParams = JSON.parse(formData.actionParams);
    } catch (e) {
      toast.error("Action Params không đúng định dạng JSON");
      return;
    }

    const payload = {
      code: formData.code.toUpperCase(),
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

    try {
      if (isCreating) {
        const result = await createFullServiceConfig(payload);
        if (result.success) {
          toast.success("Tạo service thành công!");
          navigate("/admin/services");
        } else {
          toast.error("Lỗi tạo service: " + (result.message || "Lỗi không xác định"));
        }
      } else {
        const result = await updateFullServiceConfig({ serviceId, ...payload });
        if (result.success) {
          toast.success("Cập nhật service thành công!");
          navigate("/admin/services");
        } else {
          toast.error("Lỗi cập nhật: " + (result.message || "Lỗi không xác định"));
        }
      }
    } catch (err) {
      toast.error("Lỗi kết nối khi lưu: " + err.message);
    }
  };

  const handleSchemaChange = (updatedSchema) => {
    setTempSchema(updatedSchema);
  };

  const handleImportJson = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);

        // Accept either the "full" shape ({ service, fields, validations,
        // definition, fieldBuilder }) or the flat shape used when saving
        // ({ code, name, ..., fields, validations, glSteps, fieldBuilder }).
        const normalized = json.service
          ? json
          : {
              service: {
                code: json.code,
                name: json.name,
                type: json.type,
                auth: json.auth,
                action: json.action,
                actionParams: json.actionParams,
                fee: json.fee,
              },
              fields: json.fields,
              validations: json.validations,
              definition: { glSteps: json.glSteps },
              fieldBuilder: json.fieldBuilder,
            };

        applyLoadedConfig(normalized, { preserveId: !isCreating });
        toast.success("Đã import cấu hình từ file JSON. Kiểm tra lại trước khi lưu.");
      } catch (err) {
        toast.error("File JSON không hợp lệ: " + err.message);
      }
    };
    reader.onerror = () => toast.error("Không đọc được file JSON");
    reader.readAsText(file);
  };

  if (loadingDetail) {
    return <div className="text-center py-10 text-gray-500">Đang tải chi tiết service...</div>;
  }

  if (!formData || !tempSchema) {
    return <div className="text-center py-10 text-gray-500">Đang khởi tạo...</div>;
  }

  return (
    <ServiceForm
      isCreating={isCreating}
      isEditing={isEditing}
      formData={formData}
      tempSchema={tempSchema}
      activeTab={activeTab}
      onFormChange={setFormData}
      onSchemaChange={handleSchemaChange}
      onImportJson={handleImportJson}
      onSave={handleSaveService}
      onCancel={() => navigate("/admin/services")}
      onToggleEdit={() => setIsEditing(!isEditing)}
      onTabChange={setActiveTab}
    />
  );
};

export default AdminServiceDetail;