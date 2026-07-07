const ServiceInfoForm = ({ formData, onChange, disabled }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
    <h3 className="text-sm font-bold text-gray-800 uppercase mb-4">Thông tin Service</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
      <div>
        <label className="block text-gray-600 mb-1 font-semibold">Service Code *</label>
        <input type="text" required placeholder="e.g. BILL_WATER" value={formData.code}
          disabled={disabled}
          onChange={e => onChange({...formData, code: e.target.value})}
          className="w-full border p-2 rounded bg-white font-mono uppercase outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500" />
      </div>
      <div>
        <label className="block text-gray-600 mb-1 font-semibold">Tên Dịch vụ *</label>
        <input type="text" required placeholder="e.g. Thanh toán nước" value={formData.name}
          disabled={disabled}
          onChange={e => onChange({...formData, name: e.target.value})}
          className="w-full border p-2 rounded bg-white outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500" />
      </div>
      <div>
        <label className="block text-gray-600 mb-1 font-semibold">Loại hình</label>
        <select value={formData.type} disabled={disabled}
          onChange={e => onChange({...formData, type: e.target.value})}
          className="w-full border p-2 rounded bg-white outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500">
          <option value="billpayment">Bill Payment</option>
          <option value="p2p">P2P Transfer</option>
          <option value="cashin">Cash In</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-600 mb-1 font-semibold">Xác thực</label>
        <select value={formData.auth} disabled={disabled}
          onChange={e => onChange({...formData, auth: e.target.value})}
          className="w-full border p-2 rounded bg-white outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500">
          <option value="NONE">NONE</option>
          <option value="PIN">PIN</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-600 mb-1 font-semibold">Hành động</label>
        <select value={formData.action} disabled={disabled}
          onChange={e => onChange({...formData, action: e.target.value})}
          className="w-full border p-2 rounded bg-white outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500">
          <option value="none">none</option>
          <option value="billerTrans">billerTrans</option>
        </select>
      </div>
      {formData.action === "billerTrans" && (
        <div>
          <label className="block text-gray-600 mb-1 font-semibold">Action Params (JSON)</label>
          <input type="text" value={formData.actionParams}
            disabled={disabled}
            onChange={e => onChange({...formData, actionParams: e.target.value})}
            className="w-full border p-2 rounded bg-white font-mono text-xs outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
            placeholder='{"billerId": "biller-evn"}' />
        </div>
      )}
      <div>
        <label className="block text-gray-600 mb-1 font-semibold">Cơ chế phí</label>
        <select value={formData.feeType} disabled={disabled}
          onChange={e => onChange({...formData, feeType: e.target.value})}
          className="w-full border p-2 rounded bg-white outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-500">
          <option value="fixed">Phí cố định (VND)</option>
          <option value="percent">Tỷ lệ (%)</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-600 mb-1 font-semibold">
          {formData.feeType === "fixed" ? "Giá trị phí (VND)" : "Tỷ lệ phí (%)"}
        </label>
        <input type="number" placeholder={formData.feeType === "fixed" ? "e.g. 2000" : "e.g. 1.5"}
          disabled={disabled}
          value={formData.feeValue} onChange={e => onChange({...formData, feeValue: e.target.value})}
          className="w-full border p-2 rounded bg-white outline-none focus:border-emerald-500 font-semibold disabled:bg-gray-100 disabled:text-gray-500" />
      </div>
      {formData.feeType === "percent" && (
        <div>
          <label className="block text-rose-700 mb-1 font-bold">Trần phí tối đa (VND) *</label>
          <input type="number" placeholder="e.g. 10000" value={formData.feeMax}
            disabled={disabled}
            onChange={e => onChange({...formData, feeMax: e.target.value})}
            className="w-full border border-rose-300 p-2 rounded bg-rose-50/30 text-rose-900 font-bold outline-none focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-500" />
        </div>
      )}
    </div>
  </div>
);

export default ServiceInfoForm;