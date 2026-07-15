module.exports.routes = {
  // Auth
  'POST /auth/customer/register': 'AuthController.register',
  'POST /auth/customer/login': 'AuthController.login',
  'POST /auth/admin/login': 'AuthController.loginAdmin',
  'POST /auth/admin/create': 'AuthController.createAdmin',

  // Billers
  'POST /admin/billers/list': 'BillerController.list',
  'POST /admin/billers/detail': 'BillerController.detail',
  'POST /admin/billers/create': 'BillerController.create',
  'POST /admin/billers/update': 'BillerController.update',

  // Customers
  'POST /admin/users/list': 'CustomerController.list',
  'POST /admin/users/detail': 'CustomerController.detail',
  'POST /admin/users/lock': 'CustomerController.lock',
  'POST /admin/users/unlock': 'CustomerController.unlock',

  // Pocket
  'POST /pocket/balance': 'PocketController.balance',
  'POST /admin/pocket/create/system': 'PocketController.createPocketSystem',
  'POST /admin/pocket/list': 'PocketController.listPocketsAdmin',
  'POST /admin/pocket/detail': 'PocketController.detailPocketAdmin',
  'POST /admin/pocket/adjust': 'PocketController.manualAdjustAdmin',

  // Services
  'POST /admin/services/list': 'ServiceController.list',
  'POST /admin/services/detail': 'ServiceController.detail',
  'POST /admin/services/create': 'ServiceController.create',
  'POST /admin/services/update': 'ServiceController.update',
  'POST /admin/services/delete': 'ServiceController.delete',

  'POST /admin/service-config/get-full': 'ServiceConfigController.getFullConfig',
  'POST /admin/service-config/create-full': 'ServiceConfigController.createFullConfig',
  'POST /admin/service-config/update-full': 'ServiceConfigController.updateFullConfig',
  'POST /admin/service-config/delete-full': 'ServiceConfigController.deleteFullConfig',

  // Transactions
  'POST /transaction/request': 'TransactionController.request',
  'POST /transaction/confirm': 'TransactionController.confirm',
  'POST /transaction/verify': 'TransactionController.verify',
  'POST /transactions/history': 'TransactionController.history',
  'POST /transactions/detail': 'TransactionController.detail',
  'POST /transactions/all-history': 'TransactionController.allHistory',

  'POST /admin/transactions/list': 'TransactionController.listAdmin',

  // Trans Definitions
  'POST /admin/trans-definitions/detail': 'TransDefinitionController.detail',
  'POST /admin/trans-definitions/create': 'TransDefinitionController.create',
  'POST /admin/trans-definitions/update': 'TransDefinitionController.update',
  'POST /admin/trans-definitions/delete': 'TransDefinitionController.delete',

  // Trans Fields
  'POST /admin/trans-fields/list': 'TransFieldController.list',
  'POST /admin/trans-fields/create': 'TransFieldController.create',
  'POST /admin/trans-fields/update': 'TransFieldController.update',
  'POST /admin/trans-fields/delete': 'TransFieldController.delete',

  // Trans Validations
  'POST /admin/trans-validations/list': 'TransValidationController.list',
  'POST /admin/trans-validations/create': 'TransValidationController.create',
  'POST /admin/trans-validations/update': 'TransValidationController.update',
  'POST /admin/trans-validations/delete': 'TransValidationController.delete',

  // Transaction Trails (Admin)
  'POST /admin/trails/list': 'TrailController.list',
  'POST /admin/trails/detail': 'TrailController.detail',

  // Pocket Entries (Admin)
  'POST /admin/pocket-entries/list': 'PocketEntryController.list',
  'POST /admin/pocket-entries/detail': 'PocketEntryController.detail',
  'POST /admin/pocket-entries/by-trail': 'PocketEntryController.byTrail',    // lấy theo transRefId
  'POST /admin/pocket-entries/by-pocket': 'PocketEntryController.byPocket',  // lấy theo pocketId

  'POST /notifications/list': 'NotificationController.list',
  'POST /notifications/mark-read': 'NotificationController.markAsRead',
  'POST /notifications/mark-all-read': 'NotificationController.markAllAsRead',
  'POST /notifications/count-unread': 'NotificationController.countUnread',
};
