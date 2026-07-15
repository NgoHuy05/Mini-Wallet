// config/policies.js
module.exports.policies = {

  'AuthController': {
    '*': true,
    'createAdmin': ['isAuthenticated', 'isOfficer']
  },

  'PocketController': {
    'balance': ['isAuthenticated', 'isCustomer'],
    'createPocketSystem': ['isAuthenticated', 'isOfficer'],
  },

  'TransactionController': {
    'listAdmin': ['isAuthenticated', 'isOfficer'],
    'allHistory': ['isAuthenticated', 'isCustomer'],

    '*': ['isAuthenticated'],
  },

  'ServiceController': {
    'list': ['isAuthenticated'],
    'detail': ['isAuthenticated'],
    '*': ['isAuthenticated', 'isOfficer'],
  },
  'ServiceConfigController': {
    '*': ['isAuthenticated', 'isOfficer'],
  },
  'BillerController': {
    'list': ['isAuthenticated'],
    '*': ['isAuthenticated', 'isOfficer'],
  },
  'CustomerController': {
    '*': ['isAuthenticated', 'isOfficer'],
  },
  'TransFieldController': {
    '*': ['isAuthenticated', 'isOfficer'],
  },
  'TransValidationController': {
    '*': ['isAuthenticated', 'isOfficer'],
  },
  'TransDefinitionController': {
    '*': ['isAuthenticated', 'isOfficer'],
  },
  'TrailController': {
    '*': ['isAuthenticated', 'isOfficer'],
  },
  'PocketEntryController': {
    '*': ['isAuthenticated', 'isOfficer'],
  },
  'NotificationController': {
    '*': 'isAuthenticated',
  },
};
