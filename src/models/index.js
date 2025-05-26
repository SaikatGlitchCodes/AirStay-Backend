const User = require('./User');
const Address = require('./Address');
const Subject = require('./Subject');
const Request = require('./Request');
const UserSubjectRel = require('./UserSubjectRel');
const RequestSubjectRel = require('./RequestSubjectRel');
const Transaction = require('./Transaction');

// User Relationships
User.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
User.belongsToMany(Subject, { through: UserSubjectRel, foreignKey: 'user_id', otherKey: 'subject_id', as: 'subjects' });

// Address Relationships
Address.hasMany(User, { foreignKey: 'address_id', as: 'users' });
Address.hasMany(Request, { foreignKey: 'address_id', as: 'requests' });

// Subject Relationships
Subject.belongsToMany(User, { through: UserSubjectRel, foreignKey: 'subject_id', otherKey: 'user_id', as: 'users' });
Subject.belongsToMany(Request, { through: RequestSubjectRel, foreignKey: 'subject_id', otherKey: 'request_id', as: 'requests' });

// Request Relationships
Request.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Request.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
Request.belongsToMany(Subject, { through: RequestSubjectRel, foreignKey: 'request_id', otherKey: 'subject_id', as: 'subjects' });
Request.hasMany(Transaction, { foreignKey: 'request_id', as: 'transactions' });

// Transaction Relationships
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Transaction.belongsTo(Request, { foreignKey: 'request_id', as: 'request' });

module.exports = {
  User,
  Address,
  Subject,
  Request,
  UserSubjectRel,
  RequestSubjectRel,
  Transaction,
};
