// api/controllers/AuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_ROUNDS = 10;

module.exports = {
  register: async (req, res) => {
    try {
      const { phone, pin } = req.body;

      if (!phone || !pin) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }
      if (!/^0\d{9}$/.test(phone)) {
        return res.error(sails.config.custom.respCode.INVALID_FORMAT);
      }
      if (String(pin).length < 6) {
        return res.error(sails.config.custom.respCode.MIN_LENGTH);
      }

      const existing = await Customer.findOne({ phone });
      if (existing) {
        return res.error(sails.config.custom.respCode.ERR_DUPLICATE);
      }

      const pinHash = await bcrypt.hash(String(pin), SALT_ROUNDS);

      const pocket = await Pocket.create({
        type: 'customer',
        ownerId: null,
        label: `Ví của ${phone}`,
        currencyCode: 'VND',
        balance: 0,
        checksum: 'pending',
        status: 'active',
      }).fetch();

      const checksum = sails.services.checksumservice.calc(pocket.id, 0);
      await Pocket.updateOne({ id: pocket.id }).set({ checksum });

      const customer = await Customer.create({
        phone,
        pinHash,
        pocketId: pocket.id,
        status: 'active',
      }).fetch();

      await Pocket.updateOne({ id: pocket.id }).set({ ownerId: customer.id });

      const token = jwt.sign(
        { userId: customer.id, userType: 'customer' },
        sails.config.custom.ACCESS_TOKEN_SECRET,
        { expiresIn: sails.config.custom.ACCESS_TOKEN_EXPIRES }
      );

      return res.ok({
        token,
        customer: {
          id: customer.id,
          phone: customer.phone,
          pocketId: customer.pocketId,
        },
      });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  login: async (req, res) => {
    try {
      const { phone, pin } = req.body;
      if (!phone || !pin) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const customer = await Customer.findOne({ phone });
      if (!customer) {
        return res.error(sails.config.custom.respCode.ERR_AUTH_FAILED);
      }

      if (customer.status === 'locked') {
        return res.error(sails.config.custom.respCode.ERR_ACCOUNT_LOCKED);
      }

      const match = await bcrypt.compare(String(pin), customer.pinHash);
      if (!match) {
        return res.error(sails.config.custom.respCode.ERR_AUTH_FAILED);
      }

      const token = jwt.sign(
        { userId: customer.id, userType: 'customer' },
        sails.config.custom.ACCESS_TOKEN_SECRET,
        { expiresIn: sails.config.custom.ACCESS_TOKEN_EXPIRES }
      );

      return res.ok({
        token,
        customer: {
          id: customer.id,
          phone: customer.phone,
          pocketId: customer.pocketId,
        },
      });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const officer = await Officer.findOne({ username });
      if (!officer) {
        return res.error(sails.config.custom.respCode.ERR_AUTH_FAILED);
      }

      if (officer.status === 'locked') {
        return res.error(sails.config.custom.respCode.ERR_ACCOUNT_LOCKED);
      }

      const match = await bcrypt.compare(password, officer.passwordHash);
      if (!match) {
        return res.error(sails.config.custom.respCode.ERR_AUTH_FAILED);
      }

      const token = jwt.sign(
        { userId: officer.id, userType: 'officer' },
        sails.config.custom.ACCESS_TOKEN_SECRET,
        { expiresIn: sails.config.custom.ACCESS_TOKEN_EXPIRES }
      );
      return res.ok({
        token,
        officer: {
          id: officer.id,
          username: officer.username,
          displayName: officer.displayName,
        },
      });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },

  createAdmin: async (req, res) => {
    try {
      const { username, password, displayName } = req.body;

      if (!username || !password) {
        return res.error(sails.config.custom.respCode.MISSING_FIELD);
      }

      const existing = await Officer.findOne({ username });
      if (existing) {
        return res.error(sails.config.custom.respCode.ERR_DUPLICATE);
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const officer = await Officer.create({
        username,
        passwordHash,
        displayName: displayName || username,
        status: 'active',
      }).fetch();

      const token = jwt.sign(
        { userId: officer.id, userType: 'officer' },
        sails.config.custom.ACCESS_TOKEN_SECRET,
        { expiresIn: sails.config.custom.ACCESS_TOKEN_EXPIRES }
      );

      return res.ok({
        token,
        officer: {
          id: officer.id,
          username: officer.username,
          displayName: officer.displayName,
        },
      });
    } catch (err) {
      return res.error(sails.config.custom.respCode.INTERNAL_ERROR, err.message);
    }
  },
};
