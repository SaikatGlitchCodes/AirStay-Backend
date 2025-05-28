const sequelize = require('../config/db');

const User = require('./User');
const Address = require('./Address');
const Subject = require('./Subject');
const Request = require('./Request');
const UserSubjectRel = require('./UserSubjectRel');
const RequestSubjectRel = require('./RequestSubjectRel');
const Transaction = require('./transaction');

// 🧑 User ↔️ Address (1:1)
User.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
Address.hasMany(User, { foreignKey: 'address_id', as: 'users' });

// 🧑 User ↔️ Subject (M:N)
User.belongsToMany(Subject, {
  through: UserSubjectRel,
  foreignKey: 'user_email',
  otherKey: 'subject_id',
  as: 'subjects'
});
Subject.belongsToMany(User, {
  through: UserSubjectRel,
  foreignKey: 'subject_id',
  otherKey: 'user_email',
  as: 'users'
});

// 📋 Request ↔️ User (M:1)
Request.belongsTo(User, { foreignKey: 'user_email', as: 'user' });
User.hasMany(Request, { foreignKey: 'user_email', as: 'requests' });

// 📋 Request ↔️ Address (M:1)
Request.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
Address.hasMany(Request, { foreignKey: 'address_id', as: 'requests' });

// 📋 Request ↔️ Subject (M:N)
Request.belongsToMany(Subject, {
  through: RequestSubjectRel,
  foreignKey: 'request_id',
  otherKey: 'subject_id',
  as: 'subjects'
});
Subject.belongsToMany(Request, {
  through: RequestSubjectRel,
  foreignKey: 'subject_id',
  otherKey: 'request_id',
  as: 'requests'
});

// 💰 Transaction ↔️ User (M:1)
Transaction.belongsTo(User, { foreignKey: 'user_email', as: 'user' });
User.hasMany(Transaction, { foreignKey: 'user_email', as: 'transactions' });

// 💰 Transaction ↔️ Request (M:1)
Transaction.belongsTo(Request, { foreignKey: 'request_id', as: 'request' });
Request.hasMany(Transaction, { foreignKey: 'request_id', as: 'transactions' });

module.exports = {
  sequelize,
  User,
  Address,
  Subject,
  Request,
  Transaction,
  UserSubjectRel,
  RequestSubjectRel
};
