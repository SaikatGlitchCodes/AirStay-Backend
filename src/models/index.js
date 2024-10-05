// src/models/index.js
const User = require('./User');
const Address = require('./Address');
const Subject = require('./Subject');
const Request = require('./Request');
const RequestSubjectRel = require('./request_subject_rel');
const UserSubjectRel = require('./user_subject_rel');
const Transaction = require('./transaction');
const sequelize = require('../config/db');

// User Relationships
User.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
User.belongsToMany(Subject, { through: UserSubjectRel, foreignKey: 'user_id', as: 'subjects' });

// Address Relationships
Address.hasMany(User, { foreignKey: 'address_id', as: 'users' });
Address.hasMany(Request, { foreignKey: 'address_id' });

// Subject Relationships
Subject.belongsToMany(User, { through: UserSubjectRel, foreignKey: 'subject_id', as: 'users' });
Subject.belongsToMany(Request, {
  through: 'request_subject_rel',
  foreignKey: 'subject_id', // This should match
  otherKey: 'request_id',    // This should also match
  as: 'requests'
});

// Request Relationships
Request.belongsTo(User, { foreignKey: 'email', targetKey: 'email' }); // Link the email field
Request.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
Request.hasMany(Transaction, { foreignKey: 'id', sourceKey: 'id' });
Request.belongsToMany(Subject, {
  through: 'request_subject_rel',
  foreignKey: 'request_id', // This should match the column name in the junction table
  otherKey: 'subject_id',    // This should also match
  as: 'subjects'
});

// Transaction Relationships
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
  sequelize
};
