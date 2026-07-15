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

  const loadServiceDetail = useCallback(
    async (id) => {
      setLoadingDetail(true);
      try {
        const result = await useServiceStore.getState().getFullServiceConfig(id);
        if (result.success) {
          const { service, fields, validations, definition } = result;
          setFormData({
            id: service.id,
            code: service.code,
            name: service.name,
            type: service.type,
            auth: service.auth,
            action: service.action,
            actionParams: JSON.stringify(service.actionParams || {}),
            feeType: service.fee?.type || "fixed",
            feeValue: service.fee?.value || 0,
            feeMax: service.fee?.max || 0,
          });
          setTempSchema({
            fields: fields || [],
            validations: validations || [],
            definition: definition?.glSteps || [],
            inputBuilding: service.fieldBuilder || [],
          });
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
    [navigate]
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
      onSave={handleSaveService}
      onCancel={() => navigate("/admin/services")}
      onToggleEdit={() => setIsEditing(!isEditing)}
      onTabChange={setActiveTab}
    />
  );
};

export default AdminServiceDetail;