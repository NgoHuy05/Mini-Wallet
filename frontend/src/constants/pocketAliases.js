// src/constants/pocketAliases.js

// Map từ tên gợi nhớ (alias) sang ID thực tế
export const POCKET_ALIAS_TO_ID = {
  SYSTEM_POCKET_BANK: '6a4352f153d070cff6a5146e',
  SYSTEM_POCKET_FEE: '6a4352f153d070cff6a5146e',
  //SYSTEM_POCKET_SUSPENSE: 'poc-suspense',
};

// Map ngược từ ID thực tế sang alias
export const POCKET_ID_TO_ALIAS = Object.fromEntries(
  Object.entries(POCKET_ALIAS_TO_ID).map(([alias, id]) => [id, alias])
);

// Danh sách alias và ID để gợi ý
export const POCKET_ALIAS_SUGGESTIONS = Object.keys(POCKET_ALIAS_TO_ID);
export const POCKET_ID_SUGGESTIONS = Object.values(POCKET_ALIAS_TO_ID);