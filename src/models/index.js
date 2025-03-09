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
Address.hasMany(Request, { foreignKey: 'address_id', as: 'requests' });

// Subject Relationships
Subject.belongsToMany(User, { through: UserSubjectRel, foreignKey: 'subject_id', as: 'users' });
Subject.belongsToMany(Request, { through: RequestSubjectRel, foreignKey: 'subject_id', otherKey: 'request_id', as: 'requests' });

// Request Relationships
Request.belongsTo(User, { foreignKey: 'user_id' }); // Fixed foreign key reference
Request.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
Request.hasMany(Transaction, { foreignKey: 'request_id', as: 'transactions' }); // Fixed foreign key reference
Request.belongsToMany(Subject, { through: RequestSubjectRel, foreignKey: 'request_id', otherKey: 'subject_id', as: 'subjects' });

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
