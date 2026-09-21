const sequelize = require('./sequelize');

const Site = require('./site');
const User = require('./user');
const Inspection = require('./inspection');
const Report = require('./report');
const Risk = require('./risk');
const CorrectiveAction = require('./correctiveAction');
const Attachment = require('./attachment');
const Alert = require('./alert');
const Sequence = require('./sequence');

const models = {
  Site,
  User,
  Inspection,
  Report,
  Risk,
  CorrectiveAction,
  Attachment,
  Alert,
  Sequence,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
