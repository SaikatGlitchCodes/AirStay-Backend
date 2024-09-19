// src/models/index.js
const User = require('./User');
const Address = require('./Address');
const Subject = require('./Subject');
const Request = require('./Request');
const RequestSubjectRel = require('./request_subject_rel');
const UserSubjectRel = require('./user_subject_rel');
const Transaction = require('./transaction');

// Define associations
User.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
User.belongsTo(Subject, { foreignKey: 'subject_id' });
User.belongsToMany(Subject, { through: UserSubjectRel, foreignKey: 'user_id', as: 'subjects' });

Address.hasMany(User, { foreignKey: 'address_id', as: 'users' });
Address.hasMany(Request, { foreignKey: 'address_id' });

Subject.hasMany(Request, { foreignKey: 'subject_id' });
Subject.belongsToMany(User, { through: UserSubjectRel, foreignKey: 'subject_id', as: 'users' });
Subject.belongsToMany(Request, { through: RequestSubjectRel, foreignKey: 'subject_id' });

Request.belongsTo(User, { foreignKey: 'student_id' });
Request.belongsTo(Address, { foreignKey: 'address_id' });
Request.belongsTo(Subject, { foreignKey: 'subject_id' });
Request.hasMany(Transaction, { foreignKey: 'request_id' });

Transaction.belongsTo(User, { foreignKey: 'user_id' });
Transaction.belongsTo(Request, { foreignKey: 'request_id' });

module.exports = {
  User,
  Address,
  Subject,
  Request,
  RequestSubjectRel,
  UserSubjectRel,
  Transaction,
};
